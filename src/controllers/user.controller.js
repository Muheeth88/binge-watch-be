import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const registerUser = asyncHandler(async (req, res) => {
	const { userName, email, dateOfBirth, role, password } = req.body;

	// * Validations
	if ([role, email, userName, password].some((field) => field?.trim() === "")) {
		throw new ApiError(400, "All Fields are Required");
	}

	// * Check if user alredy exists
	// const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
	// if (existingUser) {
	// 	throw new ApiError(409, "Username or Email alredy exists");
	// }

	// * Creating a User

	const user = await User.create({email, userName, password, role, dateOfBirth});

	// * Check if user is created (optional)
	const createdUser = await User.findById(user._id).select("-password");
	if (!createdUser) {
		throw new ApiError(500, "Something went wrong while registering the user");
	}

	// * returning proper response object
	return res.status(201).json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

export { registerUser };
