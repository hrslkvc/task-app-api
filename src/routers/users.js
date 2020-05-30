const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require('multer');
const upload = multer({dest: 'uploads'});

const router = new express.Router();

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );

        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post("/users/logout-all", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});


router.post("/users", async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/users", auth, async (req, res) => {
    const users = await User.find({});
    res.send(users);
});

router.get("/users/me", auth, async (req, res) => {
    await req.user.populate('tasks').execPopulate();
    console.log(req.user);
    res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send();
        }
        return res.send(user);
    } catch (error) {
        return res.send(error);
    }
});

router.patch("/users/:id", async (req, res) => {
    const allowedUpdates = ["name", "password"];
    const updates = Object.keys(req.body);

    const operationValid = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!operationValid) {
        return res.status(402).send("Not allowed");
    }

    try {
        const user = await User.findById(req.params.id);
        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save();

        if (!user) {
            return res.status(404).send("No user found");
        }

        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

router.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.send(user);
    } catch (error) {
        res.status(400).send();
    }
});

router.post("/users/me/avatar", upload.single('avatar'), async (req, res) => {
    console.log(req.file);
    res.send('success');
});

module.exports = router;
