const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        success: false,
        message: err.message,
        errors: err.errors || {}
    })

    if (process.env.NODE_ENV === 'development') {
        responseResponse.stack = err.stack;
    }


    res.status(statusCode).json(responseResponse);

}
export default errorHandler