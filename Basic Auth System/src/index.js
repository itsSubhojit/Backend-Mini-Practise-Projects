import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./db/index.js"

dotenv.config()
const app = express()


app.listen(process.env.PORT || 3000, ()=>{
    console.log(`Server is running on ${process.env.PORT || 3000}`)
})
connectDB()

