import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import mongoose from 'mongoose'
import ApiError from '../utils/ApiError.js'
import Conversation from '../models/Conversation.js'
const router = Router()
router.use(protect)
router.post("/", async (req, res, next) => {
    try {
        const { role } = req.body
        if (typeof role !== "string" || role.trim() === "" || role.trim.length > 100) {
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
export default router