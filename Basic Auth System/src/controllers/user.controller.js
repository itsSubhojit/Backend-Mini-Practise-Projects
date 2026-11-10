import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";


// register user
const registerUser = asyncHandler(async (req, res) =>{
    const {username, fullName, email, password} = req.body

    // No manual empty-string check needed — Zod validator handles this before the controller runs

    const existUser = await User.findOne({$or: [{username: username},{email: email}]})
    if(existUser){
        throw new ApiError(400, "User already registered!")
    }

    const newUser = await User.create({username: username, fullName: fullName, email: email, password: password})

    const registeredUser = await User.findById(newUser._id).select("-password")

    return res.status(200)
    .json(new ApiResponse
        (200, registeredUser, "User registered successfully")
    )
})
// end -register user

// login user
const loginUser = asyncHandler(async (req, res) =>{
    const {username, email, password} = req.body

    // No manual empty-string check needed — Zod loginValidator runs before this controller

    const user = await User.findOne({$or: [{username: username},{email: email}]})
    if(!user){
        throw new ApiError(404, "User not found!")
    }

    const matchedPassword = await user.isPasswordCorrect(password)
    if(!matchedPassword){
        throw new ApiError(401, "Password not match!!")
    }

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    const cookieOptions = {
            httpOnly: true,
            secure: true
        }

    // Avoid a 3rd DB call — build the response from the existing user object
    const { password: _, refreshToken: __, ...userResponse } = user.toObject()

    return res.status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse
        (200, userResponse, "LoggedIn successfully")
    )

})
// end -login user

// logout user
const logoutUser = asyncHandler(async (req, res) =>{
    // req.user is already the full Mongoose document from verifyJwtTokens middleware
    // no need for a redundant findById call
    const user = req.user

    // increment tokenVersion (invalidates all existing tokens) + unset refreshToken in one save
    user.refreshToken = undefined
    await user.incrementTokenVersion() // internally calls this.save()

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse
        (200, {}, "User logout successfully")
    )
})
// end -logout user

// refreshaccess token
const generateRefreshAccessToken = asyncHandler(async (req, res) =>{
    const token = req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1]

    if(!token){
        throw new ApiError(401, "Refresh token not found!")
    }

    // jwt.verify throws if invalid — wrap it to return a clean 401
    let verifyToken
    try {
        verifyToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token!")
    }

    const user = await User.findById(verifyToken._id).select("-password")
    if(!user){
        throw new ApiError(404, "User not found!")
    }

    if(token !== user.refreshToken){
        throw new ApiError(401, "Refresh token is expired or already used!")
    }

    const newAccessToken = user.generateAccessToken()
    const cookieOptions ={
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", newAccessToken, cookieOptions)
    .json(new ApiResponse
        (200, { accessToken: newAccessToken }, "Access Granted")
    )
})
// end -refreshaccess token

export {registerUser, loginUser, logoutUser, generateRefreshAccessToken}