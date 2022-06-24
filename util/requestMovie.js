const axios = require("axios");

const HttpError = require("../models/http-error");

require("dotenv").config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function getRequestedMovie(movie_id) {
  const url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${TMDB_API_KEY}`;

  const response = await axios.get(url);

  const data = response.data;

  if (!data) {
    throw new HttpError("Could not find requested movie", 500);
  }

  const results = data;

  return results;
}

module.exports = getRequestedMovie;
