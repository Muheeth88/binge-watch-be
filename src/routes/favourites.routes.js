import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addToFavourites, getFavouredByUsersList, getFavouriteMoviesList } from "../controllers/favourite.controller.js";


const favouritesRouter = Router();

favouritesRouter.route("/add-to-favourites/:movieId").post(verifyJwt, addToFavourites)
favouritesRouter.route("/get-favourite-movies/:userId").get(verifyJwt, getFavouriteMoviesList)
favouritesRouter.route("/get-favoured-by-users-list/:movieId").get(verifyJwt, getFavouredByUsersList)

export  {favouritesRouter};