import { shortenUrl, redirectUrl } from "../controllers/url.controller.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";
import {Router} from "express";


const router = Router()
router.route("/shortUrl").post(rateLimiter, shortenUrl)
router.route("/:shortUrl").get(redirectUrl)

export default router