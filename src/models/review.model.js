import mongoose, { Schema } from "mongoose"

const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    reviewBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    movie: {
        type: Schema.Types.ObjectId,
        ref: "Movie"
    } 
}, {timestamps: true})