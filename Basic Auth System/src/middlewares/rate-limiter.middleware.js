import { rateLimit } from "express-rate-limit"

const limiter = rateLimit({
    windowMs: 5*60*1000, // 5 minutes
    limit: 10, // 10 request allowed 
    message: "Too much request. Pls wait to try again later", 
    statusCode: 429
})

export default limiter
