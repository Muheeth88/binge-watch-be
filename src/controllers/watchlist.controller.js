import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addToWatchlist = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const movieId = req.params.movieId;
	const user = await User.findById(userId);
	if (user.watchlist.includes(movieId)) {
		throw new ApiError(400, "Movie Alredy exists in Watchlist");
	}
	user.watchlist.push(movieId);
	await user.save({ validateBeforeSave: false });
	return res.status(200).json(new ApiResponse(200, user.watchlist, "Added to Watchlist!"));
});

const removeFromWatchList = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const movieId = req.params.movieId;
	const user = await User.findById(userId);
	const movieIndex = user.watchlist.indexOf(movieId);
	if (movieIndex === -1) {
		throw new ApiError(400, "Movie Not Found in Watchlist");
	}
	user.watchlist.splice(movieIndex, 1);
	await user.save({ validateBeforeSave: false });
	return res.status(200).json(new ApiResponse(200, user.watchlist, "Removed from Watchlist!"));
});

const getWatchList = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const watchList = await User.aggregate([
		{
			$match: {
				_id: userId,
			},
		},
		{
			$lookup: {
				from: "movies",
				localField: "watchlist",
				foreignField: "_id",
				as: "watchlist",
				pipeline: [
					{
						$project: {
							title: 1,
							tagline: 1,
						},
					},
				],
			},
		},
		{
			$project: {
				watchlist: 1,
			},
		},
	]);

	return res.status(200).json(new ApiResponse(200, watchList, "Watchlist fetched Successfully!"));
});

export { addToWatchlist, removeFromWatchList, getWatchList };
