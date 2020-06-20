const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ dest: "uploads" });

const router = new express.Router();

router.get("/", auth, async (req, res) => {
    const users = await User.find({});
    res.send(users);
});

router.get("/me", auth, async (req, res) => {
    await req.user.populate("tasks").execPopulate();
    res.send(req.user);
});

router.get("/:id", async (req, res) => {
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

router.patch("/:id", async (req, res) => {
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
        res.status(400).send(error);
    }
});

router.delete("/:id", async (req, res) => {
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

router.post("/me/avatar", upload.single("avatar"), async (req, res) => {
    res.send("success");
});

module.exports = router;
