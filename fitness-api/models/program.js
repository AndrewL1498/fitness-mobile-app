const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  day: Number,
  title: String,
  isRest: Boolean,
});

const weekSchema = new mongoose.Schema({
  week: Number,
  days: [daySchema],
});

const programSchema = new mongoose.Schema({
  _id: String,
  title: String,
  category: String,
  description: String,
  duration: String,
  frequency: String,
  time: String,
  image: String,
  weeks: [weekSchema],
});

module.exports = mongoose.model('Program', programSchema);