import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
	try {
		if (req.cookies?.jwtToken || req.header("Authorization")) {
			const token = req.cookies?.jwtToken || req.header("Authorization")?.replace("Bearer ", "");
			const deCodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

			const user = await User.findById(deCodedToken?._id).select("-password");

			if (!user) {
				throw new ApiError(401, "Invalid Access Token");
			}

			req.user = user;
		}

		next();
	} catch (error) {
		throw new ApiError(401, error?.message || "Invalid Access Token");
	}
});
