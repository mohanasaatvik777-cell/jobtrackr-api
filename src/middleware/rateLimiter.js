import rateLimit from 'express-rate-limit'
import ApiError from '../utils/ApiError.js'
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => next(new ApiError(429, "Too many attempts, try again later"))
})
export { loginLimiter }