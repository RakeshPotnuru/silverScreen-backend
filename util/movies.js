const axios = require("axios");

const HttpError = require("../models/http-error");

require("dotenv").config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function getMovies() {
  const url1 = `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_API_KEY}`;
  const url2 = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false`;
  const response1 = await axios.get(url1);
  const response2 = await axios.get(url2);

  const data1 = response1.data;
  const data2 = response2.data;

  if (!data1 && !data2) {
    throw new HttpError("Something went wrong, please reload the page.", 404);
  }

  const trendingMovies = data1.results;
  const popularMovies = data2.results;

  const results = {
    trending: trendingMovies,
    popular: popularMovies,
  };

  return results;
}

module.exports = getMovies;
