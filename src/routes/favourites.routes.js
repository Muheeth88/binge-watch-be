import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addToFavourites, getFavouriteMoviesList, removeFromFavourites } from "../controllers/favourite.controller.js";

const favouritesRouter = Router();

favouritesRouter.route("/get-favourite-movies").get(verifyJwt, getFavouriteMoviesList);
favouritesRouter.route("/add-to-favourites/:movieId").post(verifyJwt, addToFavourites);
favouritesRouter.route("/remove-from-favourites/:movieId").post(verifyJwt, removeFromFavourites);

export { favouritesRouter };
