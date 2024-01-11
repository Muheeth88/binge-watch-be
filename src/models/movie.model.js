import mongoose, { Schema } from "mongoose"

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    tagline: String,
    plotSmmary: String,
    countryOfOrigin: String,
    plotSmmary: String,
    originalLanguage: {
        type: Schema.Types.ObjectId,
        ref: "Language"
    },
    genre: [{
        type: Schema.Types.ObjectId,
        ref: "Genre"
    }],
    releaseDate: {
        type: Date
    },
    
}, {timestamps: true})

export const Movie = mongoose.model("Movie", movieSchema)