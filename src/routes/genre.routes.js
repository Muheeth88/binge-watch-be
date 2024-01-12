import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { addGenre, deleteGenre, getAllGenres } from "../controllers/genre.controller.js";

const genreRouter = Router();

genreRouter.route("/all-genres").get(verifyJwt, isAdmin, getAllGenres);
genreRouter.route("/add-genre").post(verifyJwt, isAdmin, addGenre);
genreRouter.route("/delete-genre/:genreId").delete(verifyJwt, isAdmin, deleteGenre);

export { genreRouter };
