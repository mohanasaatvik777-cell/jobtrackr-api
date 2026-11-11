import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import mongoose from 'mongoose'
import ApiError from '../utils/ApiError.js'
import Conversation from '../models/Conversation.js'
import { loadPrompt } from '../services/prompts.js'
import { callLLM, callChat, callChatStream } from '../services/llm.js'

const router = Router()
router.use(protect)
router.post("/", async (req, res, next) => {
    try {
        const { role } = req.body
        if (typeof role !== "string" || role.trim() === "" || role.trim().length > 100) {
            throw new ApiError(400, "role is required (max 100 characters)")
        }
        const newconversation = await Conversation.create({
            owner: req.user.id,
            role
        })
        res.status(201).json(newconversation)
    } catch (err) {
        next(err)
    }
})
router.get("/", async (req, res, next) => {
    try {
        const findconversation = await Conversation.find({ owner: req.user.id }).select("role summary createdAt updatedAt").sort({ updatedAt: -1 })
        res.json(findconversation)

    } catch (err) {
        next(err)
    }
})
router.get("/:conversationId", async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.conversationId)) {
            throw new ApiError(400, "Invalid conversation id")


        }
        const converse = await Conversation.findOne({ _id: req.params.conversationId, owner: req.user.id })
        if (converse === null) {

            throw new ApiError(404, "Conversatoin not found")

        }
        res.json(converse)

    } catch (err) {
        next(err)
    }
})
router.delete('/:conversationId', async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.conversationId)) {
            throw new ApiError(400, "Invalid conversation id")


        }
        const deleted = await Conversation.findOneAndDelete({ _id: req.params.conversationId, owner: req.user.id })
        if (!deleted) {
            throw new ApiError(404, "Conversation not found")

        }
        res.json({ message: "Conversation Deleted Successfully" })
    } catch (err) {
        next(err)
    }
})
router.post("/:conversationId", async (req, res, next) => {
    try {

        const { content } = req.body
        if (!mongoose.isValidObjectId(req.params.conversationId)) {
            throw new ApiError(400, "Invalid conversation id")


        }
        if (typeof content !== "string" || content.trim() === "" || content.trim().length > 2000) {
            throw new ApiError(400, "Message is required (max 2000 characters)")
        }
        const result = await Conversation.findOne({ _id: req.params.conversationId, owner: req.user.id })
        if (!result) {
            throw new ApiError(404, "Conversation not found")
        }
        result.messages.push({
            role: 'user',
            content: content.trim()
        });
        let system_prompt = await loadPrompt("coach.system.txt")
        system_prompt = `The job role being practised is: ${result.role}\n${system_prompt}`
        const llmMessages = [

            ...result.messages.map((msg) => ({
                role: msg.role,
                content: msg.content
            }))
        ]

        await result.save()
        const final_res = await callChat(system_prompt, llmMessages, 0.7, 400)
        result.messages.push({
            role: "assistant",
            content: final_res.text
        })
        await result.save()
        res.json({ Assistant_Reply: final_res })
    } catch (err) {
        next(err)
    }
})
router.post("/:conversationId", async (req, res, next) => {
    const controller = new AbortController()
    try {
        const { content } = req.body
        if (!mongoose.isValidObjectId(req.params.conversationId)) {
            throw new ApiError(400, "Invalid conversation id")


        }
        if (typeof content !== "string" || content.trim() === "" || content.trim().length > 2000) {
            throw new ApiError(400, "Message is required (max 2000 characters)")
        }
        const result = await Conversation.findOne({ _id: req.params.conversationId, owner: req.user.id })
        if (!result) {
            throw new ApiError(404, "Conversation not found")
        }
        result.messages.push({
            role: 'user',
            content: content.trim()
        });
        let system_prompt = await loadPrompt("coach.system.txt")
        system_prompt = `The job role being practised is: ${result.role}\n${system_prompt}`
        const llmMessages = [

            ...result.messages.map((msg) => ({
                role: msg.role,
                content: msg.content
            }))
        ]

        await result.save()
        res.on("close", () => {
            if (!res.writableEnded) controller.abort()
        })
        res.setHeader("Content-Type", "text/plain; charset=utf-8")   // NEW 3
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Connection", "keep-alive")
        res.flushHeaders()
        let fullText = ""                              // NEW 4
        const stream = await callChatStream(system_prompt, llmMessages, 0.7, 400, controller.signal)

        for await (const chunk of stream) {            // NEW 5
            const text = chunk.choices[0]?.delta?.content
            if (text) {
                fullText += text
                res.write(text)
            }
        }

        result.messages.push({                         // NEW 6
            role: "assistant",
            content: fullText
        })
        await result.save()
        res.end()

    } catch (err) {
        if (controller.signal.aborted) return;
        if (res.headersSent) return res.end()
        next(err)
    }
})
export default router