import dotenv from "dotenv";
import dbConnect from "./src/db/index.js";
import app from "./app.js";


dotenv.config();  // sabse pehle, standalone

dbConnect()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
    console.log(`Server Started On Port ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log("Server Start Fail!!!");
    process.exit(1);
});