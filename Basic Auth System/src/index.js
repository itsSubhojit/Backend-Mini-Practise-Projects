import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { connectDB } from "./db/index.js"
import { router } from "./routes/user.routes.js"
import { errorHandler } from "./middlewares/errorHandler.js"

dotenv.config()
const app = express()

app.use(cookieParser())
app.use(express.json())  // req.body parse karne ke liye
app.use("/api/v1/users", router)  // routes
app.use(errorHandler) // global error handler


connectDB()
.then(() =>{
    console.log("Database connected")

    // server running
    app.listen(process.env.PORT || 3000, ()=>{
    console.log(`Server is running on ${process.env.PORT || 3000}`)
})
})
.catch((error) =>{
    console.log("Database not connected!", error)
})