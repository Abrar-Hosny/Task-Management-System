import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TaskProvider } from './context/TaskContext'; // Import the TaskProvider
import { Amplify } from "aws-amplify";

import { Buffer } from 'buffer'; // Import buffer




window.global = window; // Set global to window in the browser environment
global.Buffer = Buffer; // Set Buffer to global in the browser



createRoot(document.getElementById('root')).render(
  <StrictMode>
<TaskProvider>
    <App />
  </TaskProvider>
  </StrictMode>,
)

