import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
	const { userName, email, dateOfBirth, role, password } = req.body;

	// * Validations
	if ([role, email, userName, password].some((field) => field?.trim() === "")) {
		return res.status(400).json(new ApiResponse(400, null, "All Fields are Required"));
	}

	// * Check if user alredy exists
	const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
	if (existingUser) {
		return res.status(409).json(new ApiResponse(409, null, "Username or Email alredy exists"));
	}

	// * Creating a User
	const user = await User.create({ email, userName, password, role, dateOfBirth });

	// * Check if user is created
	const createdUser = await User.findById(user._id).select("-password");
	if (!createdUser) {
		return res.status(500).json(new ApiResponse(500, null, "Something went wrong while registering the user"));
	}

	// * returning proper response object
	return res.status(201).json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
	let errorMessage = "Something went Wrong!";
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			errorMessage = "Please fill the login details";
			return res.status(400).json(new ApiResponse(400, null, errorMessage));
		}

		const user = await User.findOne({ email });

		if (!user) {
			errorMessage = "User not found!";
			return res.status(401).json(new ApiResponse(401, null, errorMessage));
		}

		const isPasswordValid = await user.isPasswordCorrect(password);

		if (!isPasswordValid) {
			errorMessage = "Please enter the correct password!";
			return res.status(401).json(new ApiResponse(401, null, errorMessage));
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
	} catch (error) {
		return res.status(400).json(new ApiResponse(400, null, errorMessage));
	}
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
	const user = await User.findById(req.user._id)
		.populate({ path: "watchlist", select: "title" })
		.populate({ path: "favourites", select: "title" })
		.exec();

	return res.status(200).json(new ApiResponse(200, user, "User Fetched Successfully"));
});

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
