import express from 'express'

import ApiError from '../utils/ApiError.js'

import Application from '../models/Application.js'
import User from '../models/User.js'
const router = express.Router()
router.get("/", async (req, res) => {

    const { status, search } = req.query
    const filter = {}
    if (status) {
        filter.status = status
    }
    if (search) {
        filter.$or = [{ company: { $regex: search.trim(), $options: "i" } }, { role: { $regex: search.trim(), $options: "i" } }]
    }
    const result = await Application.find(filter).populate("owner", "name email")
    res.status(200).json({
        Total_application: result.length,
        result
    })
})

router.get("/:id", async (req, res) => {
    const { id } = req.params
    const item = await Application.findById(id).populate("owner", "name email")
    if (!item) {
        throw new ApiError(404, "Application not found")
    }
    res.status(200).json(item)
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
router.post("/", async (req, res) => {
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
export default router 
