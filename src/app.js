import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";

const app = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
	res.send("<h1>Hii There!</h1>");
});

// Routes Import
import userRouter from "./routes/user.routes.js";
import movieRouter from "./routes/movie.routes.js";
import genreRouter from "./routes/genre.routes.js";
import watchListRouter from "./routes/watchlist.routes.js"
import { favouritesRouter } from "./routes/favourites.routes.js";

// Routes Declaration
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/genres", genreRouter);
app.use("/api/watchlist", watchListRouter)
app.use("/api/favourites", favouritesRouter)

app.use(notFoundMiddleware);

export { app };
