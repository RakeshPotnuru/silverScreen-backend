const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

beforeEach(async () => {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0xlzf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  );
});

afterEach(async () => {
  // await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// search movie with TMDB API
describe("Search movie", () => {
  test("It should search movie by id", async () => {
    const response = await request(app).get("/api/movies/330");

    expect(response.statusCode).toBe(200);
    expect(response.body.movie.original_title).toBe(
      "The Lost World: Jurassic Park"
    );
    expect(response.body.movie.release_date).toBe("1997-05-23");
  });

  test("It should search movie by title", async () => {
    const response = await request(app).post("/api/movies/search").send({
      title: "Avengers: Infinity War",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.movies[0].title).toBe("Avengers: Infinity War");
    expect(response.body.movies[0].release_date).toBe("2018-04-25");
  });
});

// add movie to collection
describe("Add movie", () => {
  test("It should add movie to user collection", async () => {
    const response = await request(app).post("/api/movies/add/").send({
      movieId: "299536",
      imageUrl: "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
      title: "Avengers: Infinity War",
      release_date: "2018-04-25",
      creator: "614f5921fcd5a4f33ed7e672",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.movie.title).toBe("Avengers: Infinity War");
    expect(response.body.movie.release_date).toBe("2018-04-25");
  });
});
