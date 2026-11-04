import { Router } from 'express'
import { protect, authorize } from '../middleware/auth.js'
import User from '../models/User.js'
import Application from '../models/Application.js'
const router = Router()
router.get("/stats", protect, authorize("admin"), async (req, res, next) => {
    try {
        const total = {
            total_users: await User.countDocuments(),
            total_applications: await Application.countDocuments(),
            byStatus: await Application.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }, { $sort: { count: -1 } }])
        }
        res.status(200).json(total)
    } catch (err) {
        next(err)
    }
})
export default router