const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register Page
router.get("/register", (req, res) => {
  res.render("register", { message: null });
});

// Register User
router.post("/users/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  req.session.userId = user._id;
  res.redirect("/dashboard");
});

// Dashboard
router.get("/dashboard", async (req, res) => {
  const user = await User.findById(req.session.userId).populate("campaigns");
  res.render("dashboard", { user });
});

module.exports = router;
