import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addToWatchlist, removeFromWatchList } from "../controllers/watchlist.controller.js";

const router = Router();

router.route("/add-to-watchlist/:movieId").post(verifyJwt, addToWatchlist)
router.route("/remove-from-watchlist/:movieId").post(verifyJwt, removeFromWatchList)

export default router;