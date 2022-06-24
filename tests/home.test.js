const request = require("supertest");
const app = require("../app");

describe("Get movies", () => {
  test("It should get all movies", async () => {
    const response = await request(app).get("/api/home/");

    expect(response.statusCode).toBe(200);
    expect(response.body.trendingMovies.length).toBeGreaterThan(0);
    expect(response.body.popularMovies.length).toBeGreaterThan(0);
  });
});
