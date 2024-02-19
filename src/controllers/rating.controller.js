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

const deleteRating = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const ratingId = req.params.ratingId;
	const existingRating = await Rating.findById(ratingId);
	const ratingOf = existingRating.userId;
	if (userId.toString() !== ratingOf.toString()) {
		throw new ApiError(400, "Unauthorized Access");
	}
	await Rating.findByIdAndDelete(ratingId);
	res.status(200).json(new ApiResponse(200, {}, "Rating Deleted"));
});

const editRating = asyncHandler(async (req, res) => {
	const ratingId = req.params.ratingId;
	const userId = req.user._id;
	const existingRating = await Rating.findById(ratingId);
	if (userId.toString() !== existingRating.userId.toString()) {
		throw new ApiError(400, "Unauthorized Access");
	}
	const movieId = req.params.movieId;
	const rating = req.params.rating;
	const uniqueId = movieId + userId;
	const updatedRating = await Rating.findByIdAndUpdate(ratingId, { rating: rating, uniqueId: uniqueId }, { new: true });
	return res.status(200).json(new ApiResponse(200, updatedRating, "Rating Updated"));
});
export { addMovieRating, getAllRatings, getAverageRating, deleteRating, editRating };
