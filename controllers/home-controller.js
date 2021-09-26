const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const findmovies = require("../util/movies");

function sendEmail(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new HttpError("Invalid inputs", 422);
    }

    const { name, email, message } = req.body;

    res.status(200).json({ message: "Message sent successfully" });
}

async function getMovies(req, res, next) {
    const movies = await findmovies(); // json

    res.status(200).json({ 
        trendingMovies: movies.trending,
        popularMovies: movies.popular
    });
}

exports.sendEmail = sendEmail;
exports.getMovies = getMovies;