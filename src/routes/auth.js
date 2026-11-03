import jwt from 'jsonwebtoken'

import User from '../models/User.js'
import ApiError from '../utils/ApiError.js'
import { Router } from 'express'
const router = Router()
const signToken = (user) => {
    return jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}
router.post("/register", async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
            throw new ApiError(400, "User or email or is not send")
        }
        const user_check = await User.findOne({ email })
        if (user_check !== null) {
            throw new ApiError(409, "Email already exits")
        }
        const new_user = await User.create({
            name, email, password
        })
        const token = signToken(new_user)
        res.status(201).json({ token, user: { id: new_user._id, name: new_user.name, email: new_user.email, role: new_user.role } })


    }
    catch (err) {
        next(err)
    }
})
export default router