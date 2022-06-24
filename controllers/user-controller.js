const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

const Movie = require("../models/movie");
const User = require("../models/user");

require("dotenv").config();

async function signUp(req, res, next) {
  const payload = req.body.payload;

  const user_id = payload.user_id;
  const created_on = payload.created_on;
  const email = payload.identifier;
  const identifier_type = payload.identifier_type;
  const verification_token = payload.verification_token;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);

    return next(error);
  }

  if (existingUser) {
    let token;
    try {
      token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        process.env.JWT_KEY,
        { expiresIn: "1d" }
      );
    } catch (err) {
      const error = new HttpError("Login failed, please try again", 500);

      return next(error);
    }

    return res.status(200).json({
      userId: existingUser.id,
      email: existingUser.email,
      token: token,
    });
  }

  const newUser = new User({
    user_id,
    created_on,
    email,
    identifier_type,
    verification_token,
    movies: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError("Signup failed, please try again", 500);

    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );
  } catch (err) {
    const error = new HttpError("Signup failed, please try again", 500);

    return next(error);
  }

  res.status(201).json({
    userId: newUser.id,
    email: newUser.email,
    token: token,
  });
}

async function getUserCollection(req, res, next) {
  const userId = req.params.uid;

  let collection;
  try {
    collection = await Movie.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching collection failed, please try again",
      500
    );
    return next(error);
  }

  res.status(200).json({
    movies: collection.map((movie) => movie.toObject({ getters: true })),
  });
}

async function deleteFromCollection(req, res, next) {
  const movieId = req.params.mid;

  let movie;
  try {
    movie = await Movie.findOne({ movieId: movieId }).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find item.",
      500
    );

    return next(error);
  }

  if (!movie) {
    const error = new HttpError("Could not find user for this id", 404);

    return next(error);
  }

  // if(movie.creator.id !== req.userData.userId) {
  //     const error = new HttpError(
  //         "You are not allowed to delete this item.",
  //         401
  //     );

  //     return next(error);
  // }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await movie.remove({ session: sess });
    movie.creator.movies.pull(movie);
    await movie.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete item.",
      500
    );

    return next(error);
  }

  res.status(200).json({ message: "Movie deleted" });
}

exports.signUp = signUp;
exports.getUserCollection = getUserCollection;
exports.deleteFromCollection = deleteFromCollection;
