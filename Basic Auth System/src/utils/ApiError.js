class ApiError extends Error {
    constructor(statusCode, message="Something went wrong!"){

        super(message)
        this.statusCode = statusCode
        this.message = message
        this.errors = []
        this.data = null
        this.success = false

        Error.captureStackTrace(this, this.constructor);  // Captures the precise file line where the error happened
    }
}

export {ApiError}