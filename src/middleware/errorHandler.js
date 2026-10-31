const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const body = {
        success: false,
        message: err.message,
        errors: err.errors || {}
    }


    if (process.env.NODE_ENV === 'development') {
        body.stack = err.stack;
    }


    res.status(statusCode).json(body);

}
export default errorHandler