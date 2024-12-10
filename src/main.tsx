import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { TaskProvider } from './context/TaskContext.js'; // Import the TaskProvider
import { Amplify } from "aws-amplify";

import { Buffer } from 'buffer'; // Import buffer





createRoot(document.getElementById('root')).render(
  <StrictMode>
<TaskProvider>
    <App />
  </TaskProvider>
  </StrictMode>,
)

