const {validationResult} = require("express-validator")

exports.handleValidation = (requestParam) => {
    const _errors = validationResult(requestParam)
    if(!_errors.isEmpty()){
        const error = new Error("Validation Error")
        error.statusCode = 422
        error.data = _errors.array()
        throw error
    }
}