import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const isAdmin = asyncHandler(async (req, res, next) => {
	try {
		if (req.user.role !== "ADMIN") {
			throw new ApiError(401, "You dont have access to this route");
		}
		next();
	} catch (error) {
		throw new ApiError(401, error?.message || "Admin Verification Failed");
	}
});
