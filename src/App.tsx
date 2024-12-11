import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import CompletedTasks from "./pages/CompletedTasks";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Verification Route */}

          {/* Main Application Routes with Layout */}
          <Route path="/home" element={<Layout />}>
            <Route path="pending" element={<Home />} />
            <Route path="completed" element={<CompletedTasks />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
