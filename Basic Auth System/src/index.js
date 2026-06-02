import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./db/index.js"

dotenv.config()
const app = express()

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
