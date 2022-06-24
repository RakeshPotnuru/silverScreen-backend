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

describe("Authentication", () => {
  test("It should add new user", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send({
        payload: {
          user_id: "745f5921fcd5a4f33ed7e672",
          created_on: "2018-04-25",
          email: "test@gmail.com",
          identifier_type: "email",
          verification_token: "4g5cP9KG6Lw6JKnE3iWaepCMs85x6esybhdy",
        },
      });

    console.log(response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body.userId).toBe("745f5921fcd5a4f33ed7e672");
    expect(response.body.email).toBe("test@gmail.com");
  });
});

describe("Actions on users collection", () => {
  test("It should get user collection", async () => {
    const response = await request(app).get(
      "/api/users/dashboard/614f5921fcd5a4f33ed7e672"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.movies.length).toBeGreaterThan(0);
  });

  test("It should delete movie by id from user collection", async () => {
    const response = await request(app).delete("/api/users/collection/299536");

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Movie deleted");
  });
});
