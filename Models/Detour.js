const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const detourSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  fragile: {
    type: Boolean,
    required: true,
  },
  pickLocation: {
    type: String,
    required: true,
  },
  dropLocation: {
    type: String,
    required: true,
  },
  bizID: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  reward: {
    type: Number,
    required: true,
  },
});

const Detour = mongoose.model("detour", detourSchema);

module.exports = Detour;
