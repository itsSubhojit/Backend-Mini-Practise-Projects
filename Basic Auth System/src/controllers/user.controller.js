import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";


// register user
const registerUser = asyncHandler(async (req, res) =>{
    const {username, fullName, email, password} = req.body
    if(username === "" || fullName === "" || email === "" || password === ""){
        throw new ApiError(400, "All fields are required")
    }
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
    if(username === "" || email === "" || password === "" ){
        throw new ApiError(400, "All fields are required")
    }

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

    const loginUser = await User.findById(user._id).select("-password -refreshToken")

    return res.status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse
        (200, loginUser, "LoggedIn successfully")
    )

})
// end -login user

// logout user
const logoutUser = asyncHandler(async (req, res) =>{
    const user = await User.findByIdAndUpdate(req.user._id, {
        $unset:{refreshToken: 1}
    })

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
    const token = req.cookies.refreshToken || req.headers.authorization?.split(" ")[1]
    
    const verifyToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    if(!verifyToken){
        throw new ApiError(401, "Unauthorized access!!!")
    }

    const user = await User.findById(verifyToken._id).select("-password")
    if(!user){
        throw new ApiError(404, "User refresh token not found!")
    }

    if(!token || token !== user.refreshToken ){
        throw new ApiError(401, "Unauthorized access!!!")
    }

    const newAccessToken = await user.generateAccessToken()
    const cookieOptions ={
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", newAccessToken, cookieOptions)
    .json(new ApiResponse
        (200, newAccessToken, "Access Granted")
    )
})
// end -refreshaccess token

export {registerUser, loginUser, logoutUser, generateRefreshAccessToken}