import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-blue-900 text-white fixed top-0 left-0 p-4 border-r border-gray-300">
      <h2 className="text-2xl font-bold mb-6">Task Manager</h2>
      <nav>
        <ul className="space-y-4">
          
          <li>
            <NavLink
              to="/dashboard/addtasks"
              className={({ isActive }) =>
                isActive
                  ? "block px-4 py-2 rounded bg-blue-800"
                  : "block px-4 py-2 rounded hover:bg-blue-800"
              }
            >
              Add Task
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/completed"
              className={({ isActive }) =>
                isActive
                  ? "block px-4 py-2 rounded bg-blue-800"
                  : "block px-4 py-2 rounded hover:bg-blue-800"
              }
            >
              Completed Tasks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/inprocess"
              className={({ isActive }) =>
                isActive
                  ? "block px-4 py-2 rounded bg-blue-800"
                  : "block px-4 py-2 rounded hover:bg-blue-800"
              }
            >
              In-Process Tasks
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
