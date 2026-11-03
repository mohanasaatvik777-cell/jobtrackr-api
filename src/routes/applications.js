import express from 'express'

import ApiError from '../utils/ApiError.js'

import Application from '../models/Application.js'
import User from '../models/User.js'
const router = express.Router()

router.get("/stats", async (req, res, next) => {
    try {
        const user = await User.findOne()
        const rows = await Application.aggregate([
            { $match: { owner: user._id } },
            { $group: { _id: "$status", count: { $sum: 1 }, avgSalary: { $avg: "$salary" } } },
            { $sort: { count: -1 } }
        ])
        if (!rows) {
            throw new ApiError(404, "No applications found for the user")
        }
        const result = rows.reduce((sum, r) => sum + r.count, 0)
        res.status(200).json({ total: result, byStatus: rows })
    } catch (err) {
        next(err)
    }
})
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params
        const item = await Application.findById(id).populate("owner", "name email")
        if (!item) {
            throw new ApiError(404, "Application not found")
        }
        res.status(200).json(item)
    } catch (err) {
        next(err)
    }

})
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params
        const item = await Application.findByIdAndDelete(id)
        if (!item) {
            throw new ApiError(404, "Application not found to delete")
        }

        res.status(204).send()
    }
    catch (err) {
        next(err)
    }
})
router.post("/", async (req, res, next) => {
    try {
        const { company, role, status, priority, salary, appliedOn } = req.body
        const user = await User.findOne()
        const result = await Application.create({
            owner: user._id,
            company,
            role,
            status,
            priority,
            salary,
            appliedOn
        })
        res.status(201).json(result)
    } catch (err) {
        next(err)
    }

})



router.patch("/:id", async (req, res, next) => {
    try {
        const { id } = req.params
        const item = await Application.findById(id)
        const update = ["company", "role", "status", "priority", "salary", "appliedOn"]
        if (!item) {
            throw new ApiError(404, "Application not found")
        }
        for (const field of update) {
            if (req.body[field] !== undefined) {
                item[field] = req.body[field]
            }
        }
        await item.save()
        res.status(200).json(item)
    } catch (err) {
        next(err)
    }

})
router.post("/:id/notes", async (req, res, next) => {
    try {
        const { id } = req.params
        const item = await Application.findById(id)
        if (!item) {
            throw new ApiError(404, "Application not found")
        }
        item.notes.push({ text: req.body.text })
        await item.save()
        res.status(200).json(item)
    } catch (err) {
        next(err)
    }
})
router.get("/", async (req, res, next) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100)
        const skip = (page - 1) * limit
        const { status, search } = req.query
        const filter = {}
        if (req.query.status) {
            filter.status = req.query.status
        }

        if (search) {
            filter.$or = [{ company: { $regex: search.trim(), $options: "i" } }, { role: { $regex: search.trim(), $options: "i" } }]
        }
        const [data, total] = await Promise.all([
            Application.find(filter).sort({ _id: -1 }).skip(skip).limit(limit).populate("owner", "name email"),
            Application.countDocuments(filter)
        ])


        res.status(200).json({
            data, page, limit, total, totalPages: Math.ceil(total / limit)
        })
    } catch (err) {
        next(err)
    }
})
export default router 
