const express = require('express');
const router = express.Router();
const Program = require('../models/Program');

// Get all programs
router.get('/', async (req, res) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one program by id
router.get('/:id', async (req, res) => {
  try {
    const program = await Program.findOne({ _id: req.params.id });
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json(program);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a program
router.post('/', async (req, res) => {
  const program = new Program(req.body);
  try {
    const newProgram = await program.save();
    res.status(201).json(newProgram);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a program
router.patch('/:id', async (req, res) => {
  try {
    const program = await Program.findOne({ _id: req.params.id });
    if (!program) return res.status(404).json({ message: 'Program not found' });
    Object.assign(program, req.body);
    const updatedProgram = await program.save();
    res.json(updatedProgram);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a program
router.delete('/:id', async (req, res) => {
  try {
    const program = await Program.findOne({ _id: req.params.id });
    if (!program) return res.status(404).json({ message: 'Program not found' });
    await program.deleteOne();
    res.json({ message: 'Program deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;