import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addToWatchlist, getWatchList, removeFromWatchList } from "../controllers/watchlist.controller.js";

const watchlistRouter = Router();

watchlistRouter.route("/add-to-watchlist/:movieId").post(verifyJwt, addToWatchlist);
watchlistRouter.route("/remove-from-watchlist/:movieId").post(verifyJwt, removeFromWatchList);
watchlistRouter.route("/my-watchlist").get(verifyJwt, getWatchList);

export { watchlistRouter };
