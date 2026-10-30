import ApiError from '../utils/ApiError.js'
const statuses = ["Applied", "Interview", "Offer", "Rejected"]
const priorities = ["Low", "Medium", "High"]
const validateApplication = (req, res, next) => {
    const body = req.body ?? {}
    const errors = {}
    if (typeof body.company !== "string" || body.company.trim().length < 2 || body.company.trim().length > 60) {
        errors.company = "Company must be 2-60 characters"

    }
    if (typeof body.role !== "string" || body.role.trim().length < 2 || body.role.trim().length > 60) {
        errors.role = "Role must be 2-60 characters"

    }
    if (!statuses.includes(body.status)) {
        errors.status = "Status must be Applied, Interview, Offer or Rejected"
    }
    if (!priorities.includes(body.priority)) {
        errors.priority = "Priority must be High, Medium or Low"
    }
    if (typeof body.appliedOn !== "string" || body.appliedOn.trim() === "") {
        errors.appliedOn = "Date is required"
    } else {
        const date = new Date(body.appliedOn)
        if (isNaN(date.getTime())) {
            errors.appliedOn = "Date is invalid"
        } else {
            if (date > new Date()) {
                errors.appliedOn = "Date cannot be in the future"
            }
        }
    }
    if (Object.keys(errors).length > 0) {
        return next(new ApiError(400, "Validation failed", errors))
    }
    next()
}
export default validateApplication