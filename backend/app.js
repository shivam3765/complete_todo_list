// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Task = require('./models/task');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost/todo', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
});

app.get('/', (req, res) => {
    res.send("this is home page");
})

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task({ title: req.body.title });
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// ...

app.get('/api/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      res.json(task);
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.put('/api/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const updatedTask = await Task.findByIdAndUpdate(id, { title }, { new: true });
      res.json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.put('/api/tasks/:id/complete', async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      task.completed = !task.completed;
      const updatedTask = await task.save();
      res.json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
