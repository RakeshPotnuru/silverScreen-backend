const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const moviesController = require("../controllers/movies-controller");

// get movie by id
router.get("/:mid", moviesController.getMovieById);

// add movie to collection
router.post(
  "/add/",
  [check("movieId").not().isEmpty(), check("creator").not().isEmpty()],
  moviesController.addMovieToCollection
);

// get all movies with matching title
router.post(
  "/search",
  check("title").not().isEmpty(),
  moviesController.searchMovie
);

module.exports = router;
