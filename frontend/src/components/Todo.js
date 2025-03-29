import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Todo.css';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://todo-s0tv.onrender.com/api/todo'; // Ensure correct API base URL

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem('authData'));
        if (!authData || !authData.token) {
          throw new Error('User not authenticated');
        }

        const res = await axios.get(API_BASE_URL, {
          headers: { Authorization: `Bearer ${authData.token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error('Error fetching tasks:', err.response?.data?.message || err.message);
        alert('Failed to fetch tasks. Please try again.');
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData'));
      if (!authData || !authData.token) {
        throw new Error('User not authenticated');
      }

      const res = await axios.post(
        API_BASE_URL,
        { task: newTask },
        { headers: { Authorization: `Bearer ${authData.token}` } }
      );

      setNewTask('');
      setTasks((prevTasks) => [...prevTasks, res.data.todo]);
    } catch (err) {
      console.error('Error adding task:', err.response?.data?.message || err.message);
      alert('Failed to add task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData'));
      if (!authData || !authData.token) {
        throw new Error('User not authenticated');
      }

      await axios.delete(`${API_BASE_URL}/${taskId}`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      });

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err.response?.data?.message || err.message);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authData');
    navigate('/');
  };

  return (
    <div className="todo-app">
      <header>
        <h1>My Todo List</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="input-section">
        <input
          className="task-input"
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button className="add-btn" onClick={handleAddTask}>Add Task</button>
      </div>

      <div className="list-section">
        <h2>Tasks</h2>
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              {task.task}
              <button className="delete-btn" onClick={() => handleDeleteTask(task._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
