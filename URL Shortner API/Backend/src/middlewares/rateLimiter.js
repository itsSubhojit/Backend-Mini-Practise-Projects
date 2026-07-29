import { rateLimit } from 'express-rate-limit';


const rateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 5, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
    statusCode: 429, // HTTP status code after limit is reached
    message: "Too many requests, please try again later", // Response to return after limit is reached.
})

export {rateLimiter}