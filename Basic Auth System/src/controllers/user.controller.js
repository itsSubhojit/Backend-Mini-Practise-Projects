import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

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


export {registerUser}