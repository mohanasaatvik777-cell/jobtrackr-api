import express from 'express'
import myjobs from '../data/applications.js'
import ApiError from '../utils/ApiError.js'
import validateApplication from '../middleware/validateApplication.js'
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
    res.status(200).json(result)
})

router.get("/:id", async (req, res) => {
    const { id } = req.params
    const item = await Application.findById(id).populate("owner", "name email")
    if (!item) {
        throw new ApiError(404, "Application not found")
    }
    res.status(200).json(item)
})
router.delete("/:id", async (req, res) => {
    const { id } = req.params
    const item = await Application.findByIdAndDelete(id)
    if (!item) {
        throw new ApiError(404, "Application not found to delete")
    }
    myjobs.splice(index, 1)
    res.status(204).send()
})
router.post("/", validateApplication, (req, res) => {
    const { company, role, status, appliedOn, priority } = req.body
    const id = Math.max(0, ...myjobs.map((j) => j.id)) + 1
    const objj = {
        id,
        company,
        role,
        status, appliedOn, priority
    }
    myjobs.push(objj)
    res.status(201).json(objj)
})
router.patch("/:id", (req, res) => {
    const id = Number(req.params.id)
    const item = myjobs.find((f) => f.id === id)
    if (!item) {
        throw new ApiError(404, "Application not found")
    }
    const allowed_list = ["company", "role", "status", "appliedOn", "priority"]
    for (const field of allowed_list) {
        if (req.body[field] !== undefined) item[field] = req.body[field]
    }
    res.status(200).json(item)

})
export default router 
