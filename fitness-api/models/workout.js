const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: String,
  reps: String,
  videoUrl: String,
});

const sectionSchema = new mongoose.Schema({
  title: String,
  sets: String,
  exercises: [exerciseSchema],
});

const workoutSchema = new mongoose.Schema({
  _id: String,
  programId: String,
  title: String,
  subtitle: String,
  sections: [sectionSchema],
});

module.exports = mongoose.model('Workout', workoutSchema);