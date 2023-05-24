import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css"

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async () => {
    if (newTaskTitle.trim() === '') return;

    try {
      const response = await axios.post('http://localhost:3001/api/tasks', { title: newTaskTitle });
      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleTaskCompletion = async (id) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/tasks/${id}/complete`);
      const updatedTasks = tasks.map((task) =>
        task._id === id ? { ...task, completed: response.data.completed } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'default') return 0;
    if (sort === 'titleAsc') return a.title.localeCompare(b.title);
    if (sort === 'titleDesc') return b.title.localeCompare(a.title);
    return 0;
  });

  return (
    <div className='container'>
      <h1>To-Do List</h1>
      <div className='task-input'>
        <input className='task-input'
          type="text"
          placeholder="New Task"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button className='add-btn' onClick={createTask}>Add Task</button>
      </div>
      <div className='filter-sort'>
        <label >
          Filter:
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="active">Active</option>
          </select>
        </label>
        <label className='filter-sort'>
          Sort:
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Default</option>
            <option value="titleAsc">Title (A-Z)</option>
            <option value="titleDesc">Title (Z-A)</option>
          </select>
        </label>
      </div>
      <ul className='task-list'>
        {sortedTasks.map((task) => (
          <li className='task-item' key={task._id}>
            <span className={task.completed ? 'completed' : ''}>{task.title}</span>
            <div className='btn'>
              <button  onClick={() => toggleTaskCompletion(task._id)}>
                {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button  onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
