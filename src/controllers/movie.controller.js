import { Movie } from "../models/movie.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const getAllMovies = asyncHandler(async (req, res) => {
	const allMovies = await Movie.find();
	return res.status(200).json(new ApiResponse(200, allMovies, "Movies fatched Successfully"));
});

const getMovieById = asyncHandler(async (req, res) => {
	const movieId = req.params.movieId;
	const isFav = await Movie.aggregate([
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
	return res.status(200).json(new ApiResponse(200, isFav, "Movie fatched Successfully"));
});

const addMovie = asyncHandler(async (req, res) => {
	const movie = await Movie.create(req.body);
	const addedMovie = await Movie.findById(movie._id);
	return res.status(201).json(new ApiResponse(200, addedMovie, "Movie added Successfully"));
});

export { getAllMovies, getMovieById, addMovie };
