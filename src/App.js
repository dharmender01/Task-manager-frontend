import React from 'react';
import TaskImporter from './components/TaskImporter';
import TaskList from './components/TaskList';
import { TaskProvider } from './components/TaskContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <TaskProvider>
      <div className="App">
        <div className="container mx-auto p-6">
          <TaskImporter />
          <TaskList />
        </div>
        <ToastContainer />
      </div>
    </TaskProvider>
  );
}

export default App;
