import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
	genre: {
		type: String,
		required: true,
		unique: true,
	},
});

export const Genre = mongoose.model("Genre", genreSchema)