const express = require("express");
const router = express.Router();

const userController = require("../controllers/user-controller");

router.post("/signup", userController.signUp);

router.get("/dashboard/:uid", userController.getUserCollection);

router.delete("/collection/:mid", userController.deleteFromCollection);

module.exports = router;