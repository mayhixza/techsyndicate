const { Router } = require("express");
const jwt = require("jsonwebtoken");
const Detour = require("../models/Detour");
const User = require("../models/User");
const router = Router();

// Routes
router.get("/", (req, res) => {
  res.render("tIndex");
});
// Make a post route here for "/" and forward to /detours

router.get("/detours", (req, res) => {
  res.render("detours");
});

router.get("/rewards", (req, res) => {
  res.render("rewards");
});

router.get("/started", (req, res) => {
  res.render("started");
});

// Middleware

module.exports = router;
