const express = require("express");
const {check} = require("express-validator");

const homeController = require("../controllers/home-controller");
const router = express.Router();

router.get("/", homeController.getMovies);

router.post("/contact", [
    check("name").not().isEmpty(),
    check("email").isEmail().normalizeEmail(),
    check("message").isLength({ min: 5 })
], homeController.sendEmail);

module.exports = router;