const express = require("express");
const User = require("../../models/user");
const router = express.Router();
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1 (GET request) - get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 7 (GET request) - get authorized user data
router.get('/me', auth, async (req, res) => {
  res.send(req.user);
});

// 2 (GET request) - get a user by id
router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 3 (POST request) - create a new user
router.post("/", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 4 (PATCH request) - update a user by id
router.patch("/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid update operation!" });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 5. (DELETE request) - delete a user by id
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 6 (POST request) - login a user
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ error: 'Unable to login' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Unable to login' });
    }

    const token = jwt.sign({ _id: user._id.toString() }, 'secrettoken');
    user.tokens = user.tokens.concat({ token });
    await user.save();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// 8 (POST request) - logout the user (remove the current token)
router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});

// 9 (POST request) - logout the user from all devices (remove all tokens)
router.post('/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send({ message: 'Logged out from all devices successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router;
