import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"

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
}, {timestamps: true})



// Password Hashing using bcrypt
userSchema.pre("save", async function(next){
    try {
        if(!this.isModified("password")) return next();
        const hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = hashedPassword
        next();
    } catch (error) {
        console.log("Something went wrong while generating password hash!", error)
        next(error);
    }
})


export const User = mongoose.model("User", userSchema)