const express = require("express");
const Task = require("../../models/task");
const auth = require("../middleware/auth");
const router = express.Router();

// Get all tasks for the current user
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a task by id for the current user
router.get("/:id", auth, async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findOne({ _id: taskId, user: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create a new task for the current user
router.post("/", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    user: req.user._id
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update a task by id for the current user
router.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid update operation!" });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a task by id for the current user
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
