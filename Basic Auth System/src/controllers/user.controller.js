import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";


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

export {registerUser, loginUser}