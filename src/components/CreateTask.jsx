import React, { useState } from 'react';
import { useTasks } from './TaskContext';
// const BASE_URL = 'https://task-manager-backend-8y3n.onrender.com';
const BASE_URL = 'http://localhost:5000';

const CreateTask = ({ onTaskCreated }) => {
  const { fetchTasks } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    let errors = [];
  
    if (!title) errors.push('Title');
    if (!description) errors.push('Description');
    if (!dueDate) errors.push('Due Date');
  
    const currentDate = new Date().toISOString().split('T')[0];
  
    if (dueDate && dueDate < currentDate) {
      errors.push('Due Date must be today or in the future');
    }
  
    if (errors.length > 0) {
      setError(`Please correct the following: ${errors.join(', ')}`);
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, dueDate }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        if (data.error && data.error.includes('duplicate key')) {
          setError('Task title must be unique. Please choose a different title.');
        } else {
          setError(data.error || 'Failed to create task');
        }
        return;
      }
  
      await fetchTasks();
      setTitle('');
      setDescription('');
      setDueDate('');
      setError('');
  
      if (onTaskCreated) onTaskCreated();
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };
  
  const today = new Date().toISOString().split('T')[0]; // today's date for min attribute

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Create New Task</h2>

      {/* Show errors if any */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

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
          min={today} // restrict past dates
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
