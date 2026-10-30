import express from 'express'
import myjobs from '../data/applications.js'
import ApiError from '../utils/ApiError.js'
import validateApplication from '../middleware/validateApplication.js'

const router = express.Router()
router.get("/", (req, res) => {
    const { status, search } = req.query
    let result = [...myjobs]
    if (status) {
        result = result.filter((s) => s.status.toLowerCase() === status.toLowerCase())
    }
    if (search) {
        result = result.filter((f) => {
            const com = f.company.toLowerCase().includes(search.trim().toLowerCase())
            const rol = f.role.toLowerCase().includes(search.trim().toLowerCase())
            return com || rol
        })
    }
    res.status(200).json(result)
})
router.get("/:id", (req, res) => {
    const id = Number(req.params.id)
    const item = myjobs.find((f) => f.id === id)
    if (!item) throw new ApiError(404, "Application not found")
    res.status(200).json(item)
})
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id)
    const index = myjobs.findIndex((f) => f.id === id)
    if (index === -1) {
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
