import { Review } from "../models/review.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const getMovieReviews = asyncHandler(async (req, res) => {
	const movieId = req.params.movieId;
	const reviews = await Review.aggregate([
		{
			$match: {
				movie: new mongoose.Types.ObjectId(movieId),
			},
		},
		{
			$project: {
				comment: 1,
				reviewBy: 1,
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "reviewBy",
				foreignField: "_id",
				as: "reviewBy",
				pipeline: [
					{
						$project: {
							email: 1,
							userName: 1,
						},
					},
				],
			},
		},
	]);

	return res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched Successfully"));
});

const addMovieReview = asyncHandler(async (req, res) => {
	const movieId = req.params.movieId;
	const userId = req.user._id;
	const comment = req.body.comment;
	const review = await Review.create({ comment: comment, reviewBy: userId, movie: movieId });
	const postedReview = await Review.findById(review._id);
	return res.status(201).json(new ApiResponse(200, postedReview, "Review Posted"));
});

const deleteMovieReview = asyncHandler(async (req, res) => {
	const { reviewId } = req.params;
	const userId = req.user._id;
	const review = await Review.findById(reviewId);
	const postedBy = review.reviewBy;
	if (userId.toString() !== postedBy.toString()) {
		throw new ApiError(400, "Unauthorized Access");
	}
	await Review.findByIdAndDelete(reviewId);
	res.status(200).json(new ApiResponse(200, { userId, postedBy }, "Review Deleted"));
});

const editMovieReview = asyncHandler(async (req, res) => {
	const { reviewId } = req.params;
	const userId = req.user._id;
	const review = await Review.findById(reviewId);
	const postedBy = review.reviewBy;
	if (userId.toString() !== postedBy.toString()) {
		throw new ApiError(400, "Unauthorized Access");
	}
	const comment = req.body.comment;
	const updatedReview = await Review.findByIdAndUpdate(reviewId, {comment}, {new: true})
	return res.status(200).json( new ApiResponse(200, updatedReview, "Review updated!"))
});

export { getMovieReviews, addMovieReview, deleteMovieReview, editMovieReview };
