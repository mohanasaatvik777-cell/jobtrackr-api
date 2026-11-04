import jwt from 'jsonwebtoken'
import ApiError from '../utils/ApiError.js'
const protect = (req, res, next) => {
    try {
        let jwttoken
        const header = req.headers.authorization
        if (header !== undefined) {
            jwttoken = header?.split(" ")[1]
        }
        const bearer_check = header?.split(" ")[0]
        if (bearer_check !== 'Bearer') {
            throw new ApiError(401, "Bearer is not provided")
        }
        if (jwttoken === undefined) {
            throw new ApiError(401, "Not authorised")
        } else {
            const decoded = jwt.verify(jwttoken, process.env.JWT_SECRET)
            req.user = { id: decoded.id, role: decoded.role }
            next()

        }
    } catch (err) {
        throw new ApiError(401, "Not authorised")
    }
}
const authorize = (...allowedRoles) => (req, res, next) => {
    if (req.user === undefined) {
        throw new ApiError(401, "Not authorised")
    }
    if (!allowedRoles.includes(req.user.role)) {
        throw new ApiError(403, "Forbidden")
    }
    next()
}
export { protect, authorize }