const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/", auth, async (req, res) => {
    try {
        const task = new Task({ ...req.body, author: req.user._id });
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send();
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const tasks = await Task.find({author: req.user._id});
        res.send(tasks);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            author: req.user._id,
        });

        if (!task) {
            return res.status(404).send();
        }
        return res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.patch("/:id", auth, async (req, res) => {
    const allowedUpdates = ["completed", "description"];
    const updates = Object.keys(req.body);

    const operationValid = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!operationValid) {
        return res.status(402).send("Not allowed");
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            author: req.user._id,
        });

        if (!task) {
            return res.status(404).send("No task found");
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.status(200).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, author: req.user.id});
        
        if (!task) {
            return res.status(404).send("Task not found");
        }

        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
