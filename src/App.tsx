import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import CompletedTasks from "./pages/CompletedTasks";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Layout />}>
              <Route path="pending" element={<Home />} />
              <Route path="completed" element={<CompletedTasks />} />
            </Route>
          </Routes>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
