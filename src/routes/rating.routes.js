import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
	addMovieRating,
	deleteRating,
	editRating,
	getAllRatings,
	getAverageRating,
} from "../controllers/rating.controller.js";

const ratingRouter = Router();

ratingRouter.route("/get-movie-ratings/:movieId").get(getAllRatings);
ratingRouter.route("/give-rating/:movieId/:rating").post(verifyJwt, addMovieRating);
ratingRouter.route("/get-avg-rating/:movieId").get(getAverageRating);
ratingRouter.route("/edit-rating/:movieId/:ratingId/:rating").patch(verifyJwt, editRating);
ratingRouter.route("/delete-rating/:ratingId").delete(verifyJwt, deleteRating);

export { ratingRouter };
