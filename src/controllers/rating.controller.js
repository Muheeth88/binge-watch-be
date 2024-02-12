import { Rating } from "../models/rating.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addMovieRating = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const movieId = req.params.movieId;
	const rating = req.params.rating;
	let uniqueId = movieId + userId;
	let newRating = await Rating.create({ rating: rating, userId: userId, movieId: movieId, uniqueId: uniqueId });
	const postedRating = await Rating.findById(newRating._id);
	return res.status(201).json(new ApiResponse(200, postedRating, "Rating Posted"));
});

const getAllRatings = asyncHandler(async (req, res) => {
	const movieId = req.params.movieId;
	const ratings = await Rating.find({ movieId: movieId });
	return res.status(201).json(new ApiResponse(200, ratings, "Rating Fetched"));
});

const getAverageRating = asyncHandler(async (req, res) => {
	const movieId = req.params.movieId;
	const avgRating = await Rating.aggregate([
		{
			$match: {
				movieId: movieId,
			},
		},
		{
			$group: {
				_id: null,
				avg_rating: { $avg: "$rating" },
			},
		},
	]);
	return res.status(201).json(new ApiResponse(200, avgRating, "Avg Rating Fetched"));
});

export { addMovieRating, getAllRatings, getAverageRating };
