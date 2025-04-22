import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
const BASE_URL = 'https://task-manager-backend-8y3n.onrender.com'; // Base URL for the API

// Create the context
const TaskContext = createContext();

// Custom hook to access TaskContext
export const useTasks = () => useContext(TaskContext);

// TaskProvider to wrap the application and provide the task state
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]); // To hold the list of tasks
  const [loading, setLoading] = useState(true); // To manage loading state

  // Function to fetch tasks from the server
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/tasks`); // API endpoint to fetch tasks
      setTasks(response.data); // Set tasks in the state
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch tasks'); // Display error toast if fetching fails
    } finally {
      setLoading(false);
    }
  };

  // Function to update a specific task (for completion and reopening)
  const updateTask = async (id, updatedFields) => {
    try {
      const response = await axios.put(`${BASE_URL}/tasks/${id}`, updatedFields);
      const updatedTask = response.data;

      // Update only that task in the state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, ...updatedTask } : task
        )
      );

      toast.success(updatedTask.completed ? 'Task marked as completed' : 'Task reopened');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update task');
    }
  };

  // Function to edit a task
  const editTask = async (id, updatedFields) => {
    try {
      const response = await axios.put(`${BASE_URL}/tasks/${id}`, updatedFields);
      const updatedTask = response.data;

      // Update only that task in the state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, ...updatedTask } : task
        )
      );

      toast.success('Task updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update task');
    }
  };

  // Function to delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/tasks/${id}`); // Send delete request to the API

      // Remove the deleted task from the state
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));

      toast.success('Task deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete task');
    }
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks when the app starts
  }, []); // Empty dependency array means it runs once on mount

  return (
    <TaskContext.Provider value={{ tasks, setTasks, fetchTasks, loading, updateTask, editTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};
