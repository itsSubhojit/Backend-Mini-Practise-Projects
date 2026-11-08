import { ApiError } from "../utils/ApiError.js";
import jwt  from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const verifyJwtTokens = asyncHandler(async (req, res, next) =>{
    // Read token from cookie OR Authorization header (supports Postman + browser)
    const accessToken = req.cookies?.accessToken
                     || req.headers['authorization']?.split(' ')[1]

    if(!accessToken){
        throw new ApiError(401, "Access token not found!")
    }

    // Verify JWT
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

    // Find user in DB
    const user = await User.findById(decoded._id).select("-password -refreshToken")
    if(!user){
        throw new ApiError(404, "User not found!")
    }

    // Check tokenVersion — invalidates old tokens after logout/password-change
    if(decoded.tokenVersion !== user.tokenVersion){
        throw new ApiError(401, "Session expired! Please login again.")
    }

    // Assign the full Mongoose document so req.user._id works everywhere
    req.user = user
    next();
})

export { verifyJwtTokens }