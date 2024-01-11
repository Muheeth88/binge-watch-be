import { Movie } from "../models/movie.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllMovies = asyncHandler(async (req, res) => {
    const allMovies = await Movie.find()
    return res.status(200).json(new ApiResponse(200, allMovies, "Movies fatched Successfully"))
})

const getMovieDetails =  asyncHandler(async (req, res) => {
    const movieId = req.params.movieId
    const movie = await Movie.findById(movieId)
    return res.status(200).json(new ApiResponse(200, movie, "Movies fatched Successfully")) 
})


const addMovie =  asyncHandler(async (req, res) => {
    const movie = await Movie.create(req.body)
    const addedMovie = await Movie.findById(movie._id)
    return res.status(201).json(new ApiResponse(200, addedMovie, "Movie added Successfully"))
})

export {getAllMovies, getMovieDetails, addMovie }