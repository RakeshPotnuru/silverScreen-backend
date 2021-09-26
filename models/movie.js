const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const movieSchema = new Schema({
    movieId: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    release_date: {
        type: String
    },
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
});

module.exports = mongoose.model("Movie", movieSchema);