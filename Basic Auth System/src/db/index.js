import mongoose from "mongoose"


export const connectDB = async() =>{
    
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MONGODB connected successfully")
    } catch (error) {
        throw new Error("Database not connected!", error)
        process.exit(1);
    }
}

export default connectDB