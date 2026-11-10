import { ZodError } from "zod";
import { registerSchema, loginSchema } from "../validators/user.validator.js";
import { ApiError } from "../utils/ApiError.js";


// Converts Zod issues into a clean [{field, message}] array
const formatZodErrors = (error) => {
    return error.issues.map(issue => ({
        field: issue.path.join('.') || 'unknown',
        message: issue.message
    }))
}

export const registrationValidator = ((req, res, next) => {
    try {
        registerSchema.parse(req.body)
        next()
    } catch (error) {
        if (error instanceof ZodError) {
            return next(new ApiError(400, "Validation failed", formatZodErrors(error)))
        }
        next(error)
    }
})

export const loginValidator = ((req, res, next) => {
    try {
        loginSchema.parse(req.body)
        next()
    } catch (error) {
        if (error instanceof ZodError) {
            return next(new ApiError(400, "Validation failed", formatZodErrors(error)))
        }
        next(error)
    }
})