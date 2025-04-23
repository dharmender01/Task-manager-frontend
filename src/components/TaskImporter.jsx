// import React, { useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useTasks } from './TaskContext';
// // const BASE_URL = "https://task-manager-backend-8y3n.onrender.com"
// const BASE_URL = 'http://localhost:5000'; // Base URL for the API

// const TaskImporter = () => {
//   const { fetchTasks } = useTasks();
//   const [sheetUrl, setSheetUrl] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleImport = async () => {
//     if (!sheetUrl) {
//       toast.error('Please enter a Google Sheets URL');
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.post(`${BASE_URL}/import`, { url: sheetUrl });
//       toast.success(response.data.message || 'Tasks imported successfully');
//       fetchTasks();
//       setSheetUrl('');
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.error || 'Failed to import tasks');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 max-w-4xl mx-auto border border-gray-100">
//       <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">📥 Import Tasks from Google Sheet</h2>
//       <div className="flex flex-col sm:flex-row gap-4 items-center">
//         <input
//           type="text"
//           className="border border-gray-300 p-3 flex-grow rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition text-gray-800"
//           placeholder="Enter public Google Sheets URL"
//           value={sheetUrl}
//           onChange={(e) => setSheetUrl(e.target.value)}
//         />
//         <button
//           onClick={handleImport}
//           className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
//           disabled={loading}
//         >
//           {loading ? 'Importing...' : 'Import Tasks'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TaskImporter;

import React, { useState, Fragment } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTasks } from './TaskContext';
import CreateTask from './CreateTask';
import { Dialog, Transition } from '@headlessui/react';

// const BASE_URL = 'http://localhost:5000';
const BASE_URL = "https://task-manager-backend-8y3n.onrender.com"

const TaskImporter = () => {
  const { fetchTasks } = useTasks();
  const [sheetUrl, setSheetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <>
      <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 max-w-4xl mx-auto border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          📥 Import Tasks from Google Sheet
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            type="text"
            className="border border-gray-300 p-3 flex-grow rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition text-gray-800"
            placeholder="Enter public Google Sheets URL"
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleImport}
              className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
              disabled={loading}
            >
              {loading ? 'Importing...' : 'Import Tasks'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              ➕ Create Task
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Create Task */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-4"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-gray-900 mb-4"
                  >
                    Create New Task
                  </Dialog.Title>
                  <CreateTask onTaskCreated={() => setIsModalOpen(false)} />
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="mt-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default TaskImporter;
