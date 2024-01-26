import { Movie } from "../models/movie.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { promises as fsPromises } from "fs";

const getAllMovies = asyncHandler(async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const pageSize = parseInt(req.query.pageSize) || 100;
	const startIndex = (page - 1) * pageSize;
	const title = req.query.title;
	const totalRecords = await Movie.countDocuments();
	if (!req.user) {
		const movies = await Movie.find({ title: { $regex: new RegExp(title, "i") } })
			.sort("title")
			.skip(startIndex)
			.limit(pageSize);
		return res
			.status(200)
			.json(new ApiResponse(200, { page, pageSize, totalRecords, movies }, "Movies fatched Successfully"));
	}

	if (req.user) {
		const movies = await Movie.aggregate([
			{
				$match: {
					title: {
						$regex: title,
						$options: "i",
					},
				},
			},
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
				$sort: {
					title: 1,
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
	const { title, tagline, countryOfOrigin, originalLanguage, genre, releaseDate } = req.body;

	const posterPath = req.file.path;
	if (!posterPath) {
		throw new ApiError(400, "Avatar is required");
	}

	const poster = await uploadToCloudinary(posterPath);
	const posterUrl = poster.url;

	const movie = await Movie.create({
		title,
		tagline,
		countryOfOrigin,
		originalLanguage,
		genre,
		releaseDate,
		poster: posterUrl,
	});

	// For deleting the local file
	const filename = req.file.filename;
	const filePath = `public/temp/${filename}`;
	await fsPromises.access(filePath);
	await fsPromises.unlink(filePath);

	const addedMovie = await Movie.findById(movie._id);
	return res.status(201).json(new ApiResponse(200, addedMovie, "Movie added Successfully"));
});

export { getAllMovies, getMovieById, addMovie };
