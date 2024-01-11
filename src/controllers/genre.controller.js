import { Genre } from "../models/genre.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllGenres = asyncHandler(async (req, res) => {
    const allGenres = await Genre.find();
    return res.status(200).json(new ApiResponse(200, allGenres, "All Genres Fetched"))
})

const addGenre = asyncHandler(async (req, res) => {
    const genre = await Genre.create(req.body)
    const addedGenre = await Genre.findById(genre._id)
    return res.status(201).json(new ApiResponse(200, addedGenre, "New Genre Added"))
})

const deleteGenre = asyncHandler(async (req, res) => {
    const genreId = req.params.genreId
    await Genre.findByIdAndDelete(genreId)
    return res.status(200).json(new ApiResponse(200, {}, "Genre Deleted"))
})

export {getAllGenres, deleteGenre, addGenre}