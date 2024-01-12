import mongoose, { Schema } from "mongoose";

const reviewSchema = new mongoose.Schema(
	{
		comment: {
			type: String,
			required: true,
		},
		reviewBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
            required: true,
		},
		movie: {
			type: Schema.Types.ObjectId,
			ref: "Movie",
            required: true,
		},
	},
	{ timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
