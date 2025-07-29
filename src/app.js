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
import { userRouter } from "./routes/user.routes.js";
import { movieRouter } from "./routes/movie.routes.js";
import { genreRouter } from "./routes/genre.routes.js";
import { watchlistRouter } from "./routes/watchlist.routes.js";
import { favouritesRouter } from "./routes/favourites.routes.js";
import { reviewRouter } from "./routes/review.routes.js";
import { ratingRouter } from "./routes/rating.routes.js";

// Swagger setup
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerJsonPath = path.join(__dirname, "../swagger.json");
const swaggerDefinition = JSON.parse(fs.readFileSync(swaggerJsonPath, "utf-8"));

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: [], // You can add paths to your route files here for auto-generation
});

// Routes Declaration
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/genres", genreRouter);
app.use("/api/watchlist", watchlistRouter);
app.use("/api/favourites", favouritesRouter);
app.use("/api/ratings", ratingRouter);

// Swagger docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFoundMiddleware);

export { app };
