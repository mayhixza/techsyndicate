const { Router } = require("express");
const jwt = require("jsonwebtoken");
const Detour = require("../models/Detour");
const User = require("../models/User");
const router = Router();

// Routes
router.get("/", (req, res) => {
  res.render("traveller/tIndex");
});
// Make a post route here for "/" and forward to /detours

router.get("/detours", (req, res) => {
  res.render("traveller/detours");
});

router.get("/rewards", (req, res) => {
  res.render("traveller/rewards");
});

router.get("/started", (req, res) => {
  res.render("traveller/started");
});

router.get("/welcome", (req, res) => {
  res.render("traveller/welcome");
});

router.get("/setup-detour", (req, res) => {
  res.render("business/setup-detour");
});

// Middleware

module.exports = router;
