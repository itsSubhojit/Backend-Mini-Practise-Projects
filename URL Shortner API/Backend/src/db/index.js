import mongoose from "mongoose";

const dbConnect = async() =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database Connected Successfully")
    } catch (error) {
        console.log("Database Connection Failure!!!");
        console.log(error);
        process.exit(1);
    }
}


export default dbConnect;