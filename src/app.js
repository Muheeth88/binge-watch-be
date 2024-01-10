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

// Routes Declaration
app.use("/api/users", userRouter);

app.use(notFoundMiddleware);

export { app };
