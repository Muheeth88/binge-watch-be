import { Favourite } from "../models/favourite.model.js";
import { Movie } from "../models/movie.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addToFavourites = asyncHandler(async (req, res) => {
    const movieId = req.params.movieId
    const user = req.user
    const movie = await Movie.findById(movieId)
    const favouriteDoc =  await Favourite.create({user, movie})
    return res.status(201).json(new ApiResponse(200, favouriteDoc, "Added to favourites"))
})

const getFavouriteMoviesList = asyncHandler(async (req, res) => {
    
});

const getFavouredByUsersList = asyncHandler(async (req, res) => {
  
});

export {getFavouriteMoviesList, getFavouredByUsersList, addToFavourites}