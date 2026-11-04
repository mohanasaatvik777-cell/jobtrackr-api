import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import ApiError from '../utils/ApiError.js'
import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import { loginLimiter } from '../middleware/rateLimiter.js'
const router = Router()
const signToken = (user) => {
    return jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}
router.post("/register", async (req, res, next) => {
    try {
        const { name, email, password, role = "user" } = req.body
        if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
            throw new ApiError(400, "User or email or is not send")
        }
        const user_check = await User.findOne({ email })
        if (user_check !== null) {
            throw new ApiError(409, "Email already exits")
        }
        const new_user = await User.create({
            name, email, password, role
        })
        const token = signToken(new_user)
        res.status(201).json({ token, user: { id: new_user._id, name: new_user.name, email: new_user.email, role: new_user.role } })


    }
    catch (err) {
        next(err)
    }
})
router.post("/login", loginLimiter, async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (typeof email !== "string" || typeof password !== "string") {
            throw new ApiError(400, "User,Role or Password is missing")
        }

        const user = await User.findOne({ email }).select("+password")
        if (user === null || !(await bcrypt.compare(password, user.password))) {
            throw new ApiError(401, "Invalid email or password")
        }
        const token = signToken(user)
        res.status(200).json({
            token, user: {
                id: user._id, name: user.name, email: user.email, role: user.role
            }
        })
    } catch (err) {
        next(err)
    }
})

router.get("/me", protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            throw new ApiError(401, "Not authorised")
        }
        res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } })
    } catch (err) {
        next(err)
    }
})


export default router