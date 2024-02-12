import mongoose, { Schema } from "mongoose";

const movieSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		tagline: String,
		plotSmmary: String,
		countryOfOrigin: String,
		originalLanguage: {
			type: String,
		},
		genre: [
			{
				type: String,
				required: [true, "Genre is required"],
			},
		],
		releaseDate: {
			type: Date,
			required: [true, "Release date is required"],
		},
		poster: {
			type: String, //Cloudinary url
			required: true,
		},
		reviews: [
			{
				type: Schema.Types.ObjectId,
				ref: "Review",
			},
		],
		ratings: [{
			type: Schema.Types.ObjectId,
			ref: "Rating",
		}]
	},
	{ timestamps: true }
);

export const Movie = mongoose.model("Movie", movieSchema);
