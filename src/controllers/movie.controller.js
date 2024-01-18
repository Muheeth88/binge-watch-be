import { Movie } from "../models/movie.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const getAllMovies = asyncHandler(async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const pageSize = parseInt(req.query.pageSize) || 100;
	const startIndex = (page - 1) * pageSize;
	const totalRecords = await Movie.countDocuments();
	if (!req.user) {
		const movies = await Movie.find().skip(startIndex).limit(pageSize);
		return res
			.status(200)
			.json(new ApiResponse(200, { page, pageSize, totalRecords, movies }, "Movies fatched Successfully"));
	}

	if (req.user) {
		const movies = await Movie.aggregate([
			{
				$addFields: {
					isFavourite: {
						$cond: {
							if: { $in: ["$_id", req.user.favourites] },
							then: true,
							else: false,
						},
					},
					isInWatchlist: {
						$cond: {
							if: { $in: ["$_id", req.user.watchlist] },
							then: true,
							else: false,
						},
					},
				},
			},
			{
				$skip: startIndex,
			},
			{
				$limit: pageSize,
			},
		]);
		return res
			.status(200)
			.json(new ApiResponse(200, { page, pageSize, totalRecords, movies }, "Movies fatched Successfully"));
	}
});

const getMovieById = asyncHandler(async (req, res) => {
	const movieId = req.params.movieId;
	let movie;
	if (!req.user) {
		movie = await Movie.findById(movieId);
	} else {
		movie = await Movie.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(movieId),
				},
			},
			{
				$addFields: {
					isFavourite: {
						$cond: {
							if: { $in: [new mongoose.Types.ObjectId(movieId), req.user.favourites] },
							then: true,
							else: false,
						},
					},
					isInWatchlist: {
						$cond: {
							if: { $in: [new mongoose.Types.ObjectId(movieId), req.user.watchlist] },
							then: true,
							else: false,
						},
					},
				},
			},
		]);
		movie = movie[0];
	}

	return res.status(200).json(new ApiResponse(200, movie, "Movie fetched Successfully"));
});

const addMovie = asyncHandler(async (req, res) => {
	const movie = await Movie.create(req.body);
	const addedMovie = await Movie.findById(movie._id);
	return res.status(201).json(new ApiResponse(200, addedMovie, "Movie added Successfully"));
});

export { getAllMovies, getMovieById, addMovie };
