import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { addGenre, deleteGenre, getAllGenres } from "../controllers/genre.controller.js";

const router = Router();

router.route("/all-genres").get(verifyJwt, isAdmin, getAllGenres)
router.route("/add-genre").post(verifyJwt, isAdmin, addGenre )
router.route("/delete-genre/:genreId").delete(verifyJwt, isAdmin, deleteGenre)

export default router;