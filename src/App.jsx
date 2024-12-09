import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Layout from './components/Layout';
import CompletedTasks from './pages/CompletedTasks';
import AddTasks from './pages/AddTasks';
import InProcessTasks from './pages/InProcessTasks';

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        {/* Verification Route */}
        
        {/* Main Application Routes with Layout */}
        <Route path="/dashboard" element={<Layout />}>
          <Route path="addtasks" index element={<AddTasks />} />
          <Route path="completed" element={<CompletedTasks />} />
          <Route path="inprocess" element={<InProcessTasks />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
