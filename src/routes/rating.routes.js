import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addMovieRating, getAllRatings, getAverageRating } from "../controllers/rating.controller.js";

const ratingRouter = Router();

ratingRouter.route("/get-movie-ratings/:movieId").get(getAllRatings);
ratingRouter.route("/give-rating/:movieId/:rating").post(verifyJwt, addMovieRating);
ratingRouter.route("/get-avg-rating/:movieId").get(getAverageRating);

export { ratingRouter };
