const axios = require("axios");

const HttpError = require("../models/http-error");

require("dotenv").config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function searchMovie(title) {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=en-US&include_adult=false&query=${title}`;

  const response = await axios.get(url);

  const data = response.data;

  if (!data) {
    throw new HttpError("Something went wrong, please try again", 500);
  }

  const results = data.results;

  return results;
}

module.exports = searchMovie;
