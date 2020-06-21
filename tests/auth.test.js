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

// Registration tests
describe("User registration", () => {
    test("Register success", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                email: "user1@example.com",
                name: "example1",
                password: "1234567",
            })
            .expect(201);

        const user = await User.findById(response.body.user._id);
        expect(user).not.toBeNull();
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

// Login tests
describe("User login", () => {
    test("Login success", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "user@example.com",
                password: "1234567",
            })
            .expect(200);

        const user = await User.findById(response.body.user._id);
        expect(response.body.token).toBe(user.tokens[0].token);
    });

    test("Login wrong password", async () => {
        await request(app)
            .post("/auth/login")
            .send({
                email: "user@example.com",
                password: "!1234567",
            })
            .expect(400);
    });

    test("Login wrong email", async () => {
        await request(app)
            .post("/auth/login")
            .send({
                email: "!user@example.com",
                password: "1234567",
            })
            .expect(400);
    });
});
