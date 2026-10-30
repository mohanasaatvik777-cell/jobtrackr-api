export default class ApiError extends Error {
    constructor(statusCode = 500, message, errors = {}) {
        super(message)
        this.statusCode = statusCode
        this.errors = errors
    }
}