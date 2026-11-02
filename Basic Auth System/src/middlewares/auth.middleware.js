import { ApiError } from "../utils/ApiError.js";
import jwt  from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const verifyJwtTokens = asyncHandler(async (req, res, next) =>{
    const accessToken = req.cookies.accessToken
    if(!accessToken){
        throw new ApiError(401, "Invalid access token!")
    }

    const decodedAccessToken = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedAccessToken._id).select("-password -refreshToken")
    if(!user){
        throw new ApiError(404, "User id not found!")
    }

    req.user = user
    next();
})

const checkTokenVersion = asyncHandler(async(req, res, next) =>{
    const token = req.headers['authorization'].split(' ')[1]
    if(!token){
        throw new ApiError(401, "Token Not Found!!!")
    }

    const decodePayload = await jwt.verify(token, process.env.JWT_SECRET)
    
    const user = decodePayload.userId
    const findUser = await User.findById(user)
    if(decodePayload.tokenVersion !== findUser.tokenVersion){
        throw new ApiError(401, "Unauthorized: Session Expired")
    }

    req.user = user
    next()
})

export {verifyJwtTokens, checkTokenVersion}