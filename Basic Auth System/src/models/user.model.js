import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";

const userSchema = new Schema({
    username:{
        type:String,
        required: true,
        unique: true
    },
    fullName:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    refreshToken:{
        type:String
    },
    tokenVersion:{
        type:Number,
        default:0,
        required:true
    }
}, {timestamps: true})



// Password Hashing using bcrypt
userSchema.pre("save", async function(next){
    try {
        if(!this.isModified("password")) return;
        const hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = hashedPassword
    } catch (error) {
        console.log("Something went wrong while generating password hash!", error)
        return(error);
    }
})

// Verify password
userSchema.methods.isPasswordCorrect = async function (password) {
   try {
    const verifiedPassword = await bcrypt.compare(password, this.password)
    return verifiedPassword
   } catch (error) {
        throw new ApiError(400, "Something went wrong while verifying password!")
   }
}


// generating accessToken
userSchema.methods.generateAccessToken = function(){
    const options = {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    return jwt.sign({
        _id: this._id,
        username: this.username,
        fullName: this.fullName,
        email: this.email,
        tokenVersion: this.tokenVersion
    },
    process.env.ACCESS_TOKEN_SECRET,
    options
    )
 } 

 // generating refreshToken
userSchema.methods.generateRefreshToken = function(){
    const options = {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    return jwt.sign({
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    options
    )
 } 

 //increment tokenVersion
 userSchema.methods.incrementTokenVersion = async function(){
    this.tokenVersion += 1
    await this.save({validateBeforeSave: false})
 }


export const User = mongoose.model("User", userSchema)