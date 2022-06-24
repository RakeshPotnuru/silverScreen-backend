const express = require("express");

const app = express();

const HttpError = require("./models/http-error");
const moviesRoutes = require("./routes/movies-routes");
const userRoutes = require("./routes/user-routes");
const homeRoutes = require("./routes/home-routes");

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});
app.use("/api/movies", moviesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/home", homeRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

module.exports = app;
