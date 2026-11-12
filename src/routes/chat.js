import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import mongoose from 'mongoose'
import ApiError from '../utils/ApiError.js'
import Conversation from '../models/Conversation.js'
import { loadPrompt } from '../services/prompts.js'
import { callLLM, callChat, callChatStream } from '../services/llm.js'
import { logUsage } from '../services/usage.js'
import { chatLimiter } from '../middleware/rateLimiter.js'
const router = Router()
const KEEP_MESSAGES = 12
const SUMMARY_AFTER = 24
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

router.post("/:conversationId", chatLimiter, async (req, res, next) => {
    const controller = new AbortController()
    let timedOut = false
    const timer = setTimeout(() => {
        timedOut = true
        controller.abort()
    }, 30000)
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
        let fullText = ""
        let usage = null
        const started = Date.now()
        const stream = await callChatStream(system_prompt, llmMessages, 0.9, 400, controller.signal)

        for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content
            if (text) {
                fullText += text
                res.write(text)
            }
            usage = chunk.x_groq?.usage || chunk.usage || usage
        }

        result.messages.push({
            role: "assistant",
            content: fullText
        })
        await result.save()
        res.end()

        if (usage) {
            try {
                await logUsage(req.user.id, "chat", {
                    inputTokens: usage.prompt_tokens,
                    outputTokens: usage.completion_tokens,
                    ms: Date.now() - started,
                })
            } catch (e) {
                console.error("usage log failed", e)
            }
        }

        try {
            const total = result.messages.length
            const pending = total - KEEP_MESSAGES - result.summarizedCount
            if (total > SUMMARY_AFTER && pending >= 6) {
                const old = result.messages.slice(result.summarizedCount, total - KEEP_MESSAGES)
                const s = await summarizeMessages(result.summary, old)
                result.summary = s.text
                result.summarizedCount = total - KEEP_MESSAGES
                await result.save()
                await logUsage(req.user.id, "summary", s)
            }
        } catch (e) {
            console.error("summary failed", e)
        }

    } catch (err) {
        console.error("chat error:", err)
        if (timedOut) {
            if (res.headersSent) {
                res.write("\n\n[The reply took too long. Please try again.]")
                return res.end()
            }
            return next(new ApiError(504, "The coach took too long to reply. Please try again."))
        }
        if (controller.signal.aborted) return
        if (res.headersSent) return res.end()
        next(err)
    } finally {
        clearTimeout(timer)
    }
})
export default router