import { Router } from "express";
import { addMovie, getAllMovies, getMovieById } from "../controllers/movie.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const movieRouter = Router();

// * Unsecured Routes
movieRouter.route("/all-movies").get(getAllMovies);
movieRouter.route("/get-movie/:movieId").get(getMovieById);

// * Secured Routes
movieRouter.route("/add-movie").post(verifyJwt, isAdmin, addMovie);

export { movieRouter };
