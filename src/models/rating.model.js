import mongoose, { Schema } from "mongoose";

const ratingSchema = new mongoose.Schema(
	{
		rating: {
			type: Number,
			required: true,
			default: 0,
		},
		userId: {
			type: String,
			required: true,
		},
		movieId: {
			type: String,
			required: true,
		},
		uniqueId: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true }
);

export const Rating = mongoose.model("Rating", ratingSchema);
