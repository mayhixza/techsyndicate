const mongoose = require("mongoose");
const bcrypt = require("./node_modules/bcrypt");

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
  pickFlat: {
    type: String,
  },
  dropFlat: {
    type: String,
  },
  distance: {
    type: Number,
    required: true,
  },
  reward: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  taken: {
    type: Boolean,
    required: true,
  },
  pickAddress: String,
  dropAddress: String,
  assignedTo: String,
  picked: Boolean,
  dropped: Boolean,
});

const Detour = mongoose.model("detour", detourSchema);

module.exports = Detour;
