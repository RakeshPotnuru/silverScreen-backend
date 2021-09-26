const express = require("express");
const {check} = require("express-validator");
const router = express.Router();

const moviesController = require("../controllers/movies-controller");

router.get("/:mid", moviesController.getMovieById); // get movie by id

router.post("/add/", [
    check("movieId").not().isEmpty(),
    check("creator").not().isEmpty()
], moviesController.addMovieToCollection
);

router.post("/search", 
    check("title").not().isEmpty(), 
    moviesController.searchMovie
); // get all movies with matching title

module.exports = router;