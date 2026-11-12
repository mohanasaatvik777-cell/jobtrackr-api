import rateLimit from 'express-rate-limit'
import ApiError from '../utils/ApiError.js'
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => next(new ApiError(429, "Too many attempts, try again later"))
})
const chatLimiter = async (req, res, next) => {
    try {
        const since = new Date(Date.now() - 60 * 60 * 1000)
        const rows = await Conversation.aggregate([
            { $match: { owner: new mongoose.Types.ObjectId(req.user.id) } },
            { $unwind: "$messages" },
            { $match: { "messages.role": "user", "messages.createdAt": { $gte: since } } },
            { $sort: { "messages.createdAt": 1 } },
            { $group: { _id: null, count: { $sum: 1 }, oldest: { $first: "$messages.createdAt" } } },
        ])
        if (rows.length > 0 && rows[0].count >= 30) {
            const wait = Math.ceil((rows[0].oldest.getTime() + 60 * 60 * 1000 - Date.now()) / 60000)
            return next(new ApiError(429, `Too many messages. Try again in ${wait} minutes.`))
        }
        next()
    } catch (err) {
        next(err)
    }
}
export { loginLimiter, chatLimiter }
