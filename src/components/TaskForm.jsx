import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
const BASE_URL = 'https://task-manager-backend-8y3n.onrender.com'; // Base URL for the API
// const BASE_URL = 'http://localhost:5000'; // Base URL for the API
const TaskForm = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.dueDate) {
      toast.error('All fields are required');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/tasks`, formData);
      toast.success('Task created');
      setFormData({ title: '', description: '', dueDate: '' });
      onTaskCreated(); // Refresh the list
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to create task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-xl font-bold mb-2">Create New Task</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="border p-2 rounded"
          value={formData.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          className="border p-2 rounded"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="date"
          name="dueDate"
          className="border p-2 rounded"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Create Task
      </button>
    </form>
  );
};

export default TaskForm;
