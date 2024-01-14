import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addMovieReview, deleteMovieReview, editMovieReview, getMovieReviews } from "../controllers/review.controller.js";


const reviewRouter = Router();

reviewRouter.route("/movie-reviews/:movieId").get(getMovieReviews);
reviewRouter.route("/add-review/:movieId").post(verifyJwt, addMovieReview)
reviewRouter.route("/delete-review/:reviewId").delete(verifyJwt, deleteMovieReview)
reviewRouter.route("/edit-review/:reviewId").patch(verifyJwt, editMovieReview)

export { reviewRouter };