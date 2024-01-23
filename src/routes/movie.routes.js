import { Router } from "express";
import { addMovie, getAllMovies, getMovieById } from "../controllers/movie.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const movieRouter = Router();

// * Unsecured Routes
movieRouter.route("/all-movies").get(isLoggedIn, getAllMovies);
movieRouter.route("/get-movie/:movieId").get(isLoggedIn, getMovieById);

// * Secured Routes
movieRouter.route("/add-movie").post(verifyJwt, isAdmin, upload.single("poster"), addMovie);

export { movieRouter };
