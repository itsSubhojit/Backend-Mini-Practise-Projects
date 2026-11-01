import { Router } from "express"
import { registerUser, loginUser, logoutUser, generateRefreshAccessToken } from "../controllers/user.controller.js";
import { verifyJwtTokens } from "../middlewares/auth.middleware.js";
import limiter from "../middlewares/rate-limiter.middleware.js"


const router = Router()

router.route("/register").post(limiter, registerUser)
router.route("/login").post(limiter, loginUser)

// secure logout
router.route("/logout").post(verifyJwtTokens, logoutUser)

//secure refreshAccessToken
router.route("/refresh-accesstoken").post(generateRefreshAccessToken)


export {router}