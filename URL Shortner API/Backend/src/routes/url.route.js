import { shortenUrl, redirectUrl } from "../controllers/url.controller.js";
import {Router} from "express";


const router = Router()
router.route("/shortUrl").post(shortenUrl)
router.route("/:shortUrl").get(redirectUrl)

export default router