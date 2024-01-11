import mongoose, { Schema } from "mongoose"

const favouriteSchema = new mongoose.Schema({
    movie: {
        type: Schema.Types.ObjectId,
        ref: "Movie"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})