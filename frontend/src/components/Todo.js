import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Todo.css';
import { useNavigate } from 'react-router-dom';

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

        const res = await axios.get('https://todo-s0tv.onrender.com/api/todo', {
          headers: { Authorization: `Bearer ${authData.token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error(err);
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
        'https://todo-s0tv.onrender.com/api/todo',
        { task: newTask },
        { headers: { Authorization: `Bearer ${authData.token}` } }
      );
  
      setNewTask('');
      setTasks((prevTasks) => [...prevTasks, res.data.todo]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'An error occurred');
    }
  };
  

  const handleDeleteTask = async (taskId) => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData'));
      if (!authData || !authData.token) {
        throw new Error('User not authenticated');
      }
  
      await axios.delete(`https://todo-s0tv.onrender.com/api/todo/${taskId}`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
  
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err.response?.data?.message || err.message);
      alert(err.response?.data?.message || 'An error occurred while deleting the task');
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
