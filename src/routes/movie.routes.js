import { Router } from "express";
import { addMovie, getAllMovies, getMovieDetails } from "../controllers/movie.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// * Unsecured Routes
router.route("/all-movies").get(getAllMovies);
router.route("/get-movie/:movieId").get(getMovieDetails);

// * Secured Routes
router.route("/add-movie").post(verifyJwt, isAdmin, addMovie);

export default router;
