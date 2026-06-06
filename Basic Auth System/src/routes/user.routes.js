import { Router } from "express"
import { registerUser, loginUser, logoutUser, generateRefreshAccessToken } from "../controllers/user.controller.js";
import { verifyJwtTokens } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

// secure logout
router.route("/logout").post(verifyJwtTokens, logoutUser)

//secure refreshAccessToken
router.route("/refresh-accesstoken").post(generateRefreshAccessToken)


export {router}