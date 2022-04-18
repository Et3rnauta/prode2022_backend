/**
 * For logging errors
 */
module.exports.errorLogger = (error, req, res, next) => {
    console.error("-> Error", error);
    next(error);
}

/**
 * Responding to client
 */
module.exports.errorResponder = (error, req, res, next) => {
    if (error.number)
        res.status(error.number).send({
            message: error.content
        })
    else
        next(error.content)
}

/**
 * Generic handler for exceptional case errors
 */
module.exports.failSafeHandler = (error, req, res, next) => {
    res.status(500).send(error)
}