import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTasks } from './TaskContext';
const BASE_URL = "https://task-manager-backend-8y3n.onrender.com"

const TaskImporter = () => {
  const { fetchTasks } = useTasks();
  const [sheetUrl, setSheetUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!sheetUrl) {
      toast.error('Please enter a Google Sheets URL');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/import`, { url: sheetUrl });
      toast.success(response.data.message || 'Tasks imported successfully');
      fetchTasks();
      setSheetUrl('');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to import tasks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 max-w-4xl mx-auto border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">📥 Import Tasks from Google Sheet</h2>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          className="border border-gray-300 p-3 flex-grow rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition text-gray-800"
          placeholder="Enter public Google Sheets URL"
          value={sheetUrl}
          onChange={(e) => setSheetUrl(e.target.value)}
        />
        <button
          onClick={handleImport}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          disabled={loading}
        >
          {loading ? 'Importing...' : 'Import Tasks'}
        </button>
      </div>
    </div>
  );
};

export default TaskImporter;
