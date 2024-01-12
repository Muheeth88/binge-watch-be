import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addToFavourites = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const movieId = req.params.movieId;
	const user = await User.findById(userId);
	if (user.favourites.includes(movieId)) {
		throw new ApiError(400, "Movie Alredy exists in Favourites");
	}
	user.favourites.push(movieId);
	await user.save({ validateBeforeSave: false });
	return res.status(200).json(new ApiResponse(200, user.favourites, "Added to Favourites!"));
});

const removeFromFavourites = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const movieId = req.params.movieId;
	const user = await User.findById(userId);
	const movieIndex = user.favourites.indexOf(movieId);
	if (movieIndex === -1) {
		throw new ApiError(400, "Movie Not Found in Favourites");
	}
	user.favourites.splice(movieIndex, 1);
	await user.save({ validateBeforeSave: false });
	return res.status(200).json(new ApiResponse(200, user.favourites, "Removed from Favourites!"));
});

const getFavouriteMoviesList = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const favouriteMovies = await User.aggregate([
		{
			$match: {
				_id: userId,
			},
		},
		{
			$lookup: {
				from: "movies",
				localField: "favourites",
				foreignField: "_id",
				as: "favourites",
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
				favourites: 1,
			},
		},
	]);

	return res.status(200).json(new ApiResponse(200, favouriteMovies, "Favourite Movies fetched Successfully!"));
});

export { getFavouriteMoviesList, addToFavourites, removeFromFavourites };
