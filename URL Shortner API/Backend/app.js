import express from "express";
import cors from "cors";
import router from "./src/routes/url.route.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/url", router)

app.use(errorHandler);


export default app;