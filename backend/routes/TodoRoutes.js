const express = require('express');
const Todo = require('../models/todo');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET_KEY = '8882345228';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Missing or malformed token');
    return res.status(403).json({ message: 'Access Denied: Token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(403).json({ message: 'Invalid Token', error: err.message });
    }
    req.userId = user.userId;
    next();
  });
};


router.post('/todo', verifyToken, async (req, res) => {
  const { task } = req.body;
  try {
    const newTodo = new Todo({
      task,
      userId: req.userId,
    });
    await newTodo.save();
    res.status(201).json({ message: 'Task Created', todo: newTodo });
  } catch (err) {
    res.status(500).json({ message: 'Error creating task' });
  }
});

router.get('/todo', verifyToken, async (req, res) => {
  try {
    const tasks = await Todo.find({ userId: req.userId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

router.delete('/todo/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Todo.findOne({ _id: id, userId: req.userId });
    if (!task) {
      console.error('Task not found or unauthorized for deletion:', { id, userId: req.userId });
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    await Todo.deleteOne({ _id: id });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err.message);
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
});



module.exports = router;
