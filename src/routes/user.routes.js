import { Router } from "express";
import { logOutUser, loginUser, registerUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser)

// * Secured Routes
router.route("/logout").post(verifyJwt, logOutUser)


export default router;