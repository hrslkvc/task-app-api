const app = require("../src/app");
const request = require("supertest");
const User = require("../src/models/user");

const mongoose = require("mongoose");

// Manually close db connection so it doesn't prevent jest
// from exiting after all the tests have been completed
afterAll(() => {
    mongoose.disconnect();
});

// Data setup/teardown
beforeEach(async () => {
    const exampleUser = {
        email: "user@example.com",
        name: "example",
        password: "1234567",
    };

    await new User(exampleUser).save();
});

afterEach(async () => {
    await User.deleteMany();
});

// Tests
describe("User registration", () => {
    test("Register success", async () => {
        await request(app)
            .post("/auth/register")
            .send({
                email: "user1@example.com",
                name: "example1",
                password: "1234567",
            })
            .expect(201);
    });

    test("User already exists", async () => {
        await request(app)
            .post("/auth/register")
            .send({
                email: "user@example.com",
                name: "example",
                password: "1234567",
            })
            .expect(400);
    });

    test("Register invalid input", async () => {
        await request(app)
            .post("/auth/register")
            .send({
                email: "user1@example.com",
                name: "example1",
            })
            .expect(400);
    });
});
