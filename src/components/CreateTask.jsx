import React, { useState } from 'react';
import { useTasks } from './TaskContext';
const BASE_URL = 'https://task-manager-backend-8y3n.onrender.com'; // Base URL for the API

const CreateTask = ({ onTaskCreated }) => {
  const { fetchTasks } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleCreate = async () => {
    if (!title || !description || !dueDate) return alert('Please fill all fields');

    try {
      const response = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, dueDate }),
      });

      if (!response.ok) throw new Error('Failed to create task');

      await fetchTasks();

      setTitle('');
      setDescription('');
      setDueDate('');

      if (onTaskCreated) onTaskCreated(); // Close modal or trigger parent behavior
    } catch (error) {
      console.error(error);
      alert('Error creating task');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Create New Task</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="mt-4 text-center">
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default CreateTask;
