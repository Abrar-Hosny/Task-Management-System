import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TaskProvider } from './context/TaskContext'; // Import the TaskProvider


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <TaskProvider>
    <App />
  </TaskProvider>
  </StrictMode>,
)
