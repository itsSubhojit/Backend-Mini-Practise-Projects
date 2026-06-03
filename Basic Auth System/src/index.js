import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./db/index.js"
import { router } from "./routes/user.routes.js"

dotenv.config()
const app = express()


app.use(express.json())  // req.body parse karne ke liye
app.use("/api/v1/users", router)  // routes


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