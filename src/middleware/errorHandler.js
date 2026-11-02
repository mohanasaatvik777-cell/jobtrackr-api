const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500
    const body = {
        success: false,
        message: err.message,
        errors: err.errors || {}
    }



    if (err.name === "CastError") {
        statusCode = 400
        body.message = `Invalid id`
    }
    else if (err.name === 'ValidationError') {
        statusCode = 400
        body.message = 'Validation error'
        const fieldErrors = {}
        for (const item of Object.values(err.errors)) {


            fieldErrors[item.path] = item.message
        }
        body.errors = fieldErrors


    }
    else if (err.code === 11000) {
        statusCode = 400
        const fielderrors = {}
        for (const item of Object.keys(err.keyValue)) {
            fielderrors[item] = `${item} already exists`
        }
        body.message = 'Duplicate key error'
        body.errors = fielderrors
    }
    if (statusCode === 500) {
        console.error(err)
    }
    if (process.env.NODE_ENV === 'development') {
        body.stack = err.stack;
    }

    res.status(statusCode).json(body);

}
export default errorHandler

