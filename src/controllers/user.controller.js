import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const registerUser = asyncHandler(async (req, res) => {
	const { userName, email, dateOfBirth, role, password } = req.body;

	// * Validations
	if ([role, email, userName, password].some((field) => field?.trim() === "")) {
		throw new ApiError(400, "All Fields are Required");
	}

	// * Check if user alredy exists
	const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
	if (existingUser) {
		throw new ApiError(409, "Username or Email alredy exists");
	}

	// * Creating a User
	const user = await User.create({ email, userName, password, role, dateOfBirth });

	// * Check if user is created
	const createdUser = await User.findById(user._id).select("-password");
	if (!createdUser) {
		throw new ApiError(500, "Something went wrong while registering the user");
	}

	// * returning proper response object
	return res.status(201).json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {

	const { email, password } = req.body;
	if (!email) {
		throw new ApiError(400, "email is required");
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new ApiError(404, "User not found");
	}

	const isPasswordValid = await user.isPasswordCorrect(password);

	if (!isPasswordValid) {
		throw new ApiError(401, "Incorrect Password");
	}

	const { jwtToken } = await generateJwtToken(user._id);

	const loggedInUser = await User.findById(user._id).select("-password");

	const options = {
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.cookie("jwtToken", jwtToken, options)
		.json(new ApiResponse(200, { user: loggedInUser, jwtToken }, "User LoggedIn Successfully"));
});

const logOutUser = asyncHandler(async (req, res) => {
	await User.findByIdAndUpdate(
		req.user._id,
		{
			$unset: {
				jwtToken: 1,
			},
		},
		{ new: true }
	);

	const options = {
		httpOnly: true,
		secure: true,
	};

	return res.status(200).clearCookie("jwtToken", options).json(new ApiResponse(200, {}, "User LoggedOut"));
});

const getUserProfile = asyncHandler(async (req, res) => {
	return res.status(200).json(new ApiResponse(200, req.user, "User Fetched Successfully"));
})

const generateJwtToken = async (userId) => {
	try {
		const user = await User.findById(userId);
		const jwtToken = user.generateJwtToken();
		await user.save({ validateBeforeSave: false });
		return { jwtToken };
	} catch (error) {
		throw new ApiError(500, "Something went wrong while generating refresh and access token");
	}
};

export { registerUser, loginUser, logOutUser, getUserProfile };
