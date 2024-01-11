import mongoose, { Schema } from "mongoose"

const favouriteSchema = new mongoose.Schema({
    movie: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

export const Favourite = mongoose.model("Favourite", favouriteSchema)