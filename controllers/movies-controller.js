const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");

const myMovie = require("../util/requestMovie");
const getMovies = require("../util/searchMovie");

const Movie = require("../models/movie");
const User = require("../models/user");


async function getMovieById(req, res, next) {

    const movieId = req.params.mid;

    const movie = await myMovie(movieId);

    res.status(200).json({ movie });
}

async function addMovieToCollection(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed", 422)
        );
    }

    const { movieId, imageUrl, title, release_date, creator } = req.body;
    
    const newMovie = new Movie({
        movieId,
        imageUrl,
        title,
        release_date,
        creator
    });

    let user;

    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError(
            "Adding movie to collection failed, please try again",
            500
        );

        return next(error);
    }

    if (!user) {
        const error = new HttpError(
            "Could not find user", 404
        );
        return next(error);
    }


    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newMovie.save({ session: sess });
        user.movies.push(newMovie);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Adding movie to collection failed, please try again",
            500
        );
        return next(error);
    }
    
    res.status(201).json({ movie: newMovie });
}

async function searchMovie(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed", 422)
        );
    }
    
    const title = req.body.title;

    const movies = await getMovies(title);

    res.status(200).json({ movies: movies });
}

exports.getMovieById = getMovieById;
exports.addMovieToCollection = addMovieToCollection;
exports.searchMovie = searchMovie;