import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addToWatchlist = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const movieId = req.params.movieId
    const user = await User.findById(userId)
    user.watchlist.push(movieId)
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, {}, "Added to Watchlist!"))
})

const removeFromWatchList = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const movieId = req.params.movieId
    const user = await User.findById(userId)
    const movieIndex = user.watchlist.indexOf(movieId);
    user.watchlist.splice(movieIndex, 1)
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, {}, "Removed from Watchlist!"))
})
 
export {addToWatchlist, removeFromWatchList}