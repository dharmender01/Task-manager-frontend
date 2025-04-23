import React, { useState } from 'react';
import { useTasks } from './TaskContext';

const TaskList = () => {
  const { tasks, loading, updateTask, editTask, deleteTask } = useTasks();
  const [editingTask, setEditingTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [deletingTaskId, setDeletingTaskId] = useState(null); // <-- new state

  const handleComplete = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    const updatedFields = {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      completed: !task.completed,
    };

    await updateTask(id, updatedFields);
  };

  const handleEdit = (task) => {
    setEditingTask(task._id);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskDueDate(task.dueDate);
  };

  const handleSaveEdit = async (id) => {
    const updatedFields = {
      title: taskTitle,
      description: taskDescription,
      dueDate: taskDueDate,
    };
    await editTask(id, updatedFields);
    setEditingTask(null);
  };

  const handleDelete = async (id) => {
    setDeletingTaskId(id); // mark this task as deleting

    try {
      await deleteTask(id);
    } catch (error) {
      console.error('Failed to delete task:', error);
      setDeletingTaskId(null); // re-enable button if failed
    }
  };

  if (loading) return <div className="text-center py-4 text-gray-600">Loading tasks...</div>;

  return (
    <div className="overflow-x-auto shadow-md rounded-xl bg-white mt-6">
      <table className="min-w-full text-sm text-left text-gray-800">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 border-b">Title</th>
            <th className="px-4 py-3 border-b w-[35%] text-gray-500">Description</th>
            <th className="px-6 py-3 border-b">Due Date</th>
            <th className="px-6 py-3 border-b">Status</th>
            <th className="px-6 py-3 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 border-b align-top">
                {editingTask === task._id ? (
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  task.title
                )}
              </td>
              <td className="px-4 py-4 border-b align-top text-gray-400">
                {editingTask === task._id ? (
                  <textarea
                    rows="3"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <div className="max-h-24 overflow-y-auto whitespace-pre-line break-words">
                    {task.description}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 border-b align-top">
                {editingTask === task._id ? (
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  new Date(task.dueDate).toLocaleDateString()
                )}
              </td>
              <td className="px-6 py-4 border-b align-top">
                {task.completed ? (
                  <span className="text-emerald-600 font-semibold">Completed</span>
                ) : (
                  <span className="text-red-500 font-semibold">Pending</span>
                )}
              </td>
              <td className="px-6 py-4 border-b align-top">
                <div className="flex justify-center items-center gap-2">
                  {editingTask === task._id ? (
                    <button
                      onClick={() => handleSaveEdit(task._id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(task)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleComplete(task._id)}
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {task.completed ? 'Reopen' : 'Complete'}
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    disabled={deletingTaskId === task._id}
                    className={`px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      deletingTaskId === task._id
                        ? 'bg-rose-300 cursor-not-allowed'
                        : 'bg-rose-500 hover:bg-rose-600'
                    }`}
                  >
                    {deletingTaskId === task._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
