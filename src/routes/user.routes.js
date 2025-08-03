import { Router } from "express";
import {
  getUserProfile,
  logOutUser,
  loginUser,
  registerUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const userRouter = Router();

// * Unsecured Routes
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/refresh-token").post(refreshAccessToken);

// * Secured Routes
userRouter.route("/logout").post(verifyJwt, logOutUser);
userRouter.route("/get-user-profile").get(verifyJwt, getUserProfile);

export { userRouter };
