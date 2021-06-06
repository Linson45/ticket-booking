const mongoose = require("mongoose");
const validator = require("validator");

const showSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  time: {
    type: Date,
    required: true,
  },
  genre: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  ticketsRemaining: {
    type: Number,
    required: true,
    default: 15,
  },
});

showSchema.pre("findOneAndUpdate", function (next) {
  this.options.runValidators = true;
  next();
});

const Show = mongoose.model("show", showSchema);

module.exports = Show;
