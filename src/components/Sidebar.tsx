import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for toggling the mobile menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the mobile menu
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-blue-900 text-white p-4 z-20 shadow-md ">
        <div className="flex items-center justify-between">
          {/* Logo or Brand */}
          <h2 className="text-2xl font-bold">Task Manager</h2>

          {/* Hamburger Menu for mobile view */}
          <button
            className="sm:hidden bg-blue-900 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          {/* Navbar Links for Desktop */}
          <div className="hidden sm:flex space-x-4">
            <NavLink
              to="/dashboard/addtasks"
              className={({ isActive }) =>
                isActive
                  ? "px-4 py-2 text-white rounded bg-blue-800"
                  : "px-4 py-2 text-white rounded hover:bg-blue-800"
              }
            >
              Add Task
            </NavLink>
            <NavLink
              to="/dashboard/pending"
              className={({ isActive }) =>
                isActive
                  ? "px-4 py-2 text-white rounded bg-blue-800"
                  : "px-4 py-2 text-white rounded hover:bg-blue-800"
              }
            >
              Pending Tasks
            </NavLink>
            <NavLink
              to="/dashboard/inprocess"
              className={({ isActive }) =>
                isActive
                  ? "px-4 py-2 text-white rounded bg-blue-800"
                  : "px-4 py-2 text-white rounded hover:bg-blue-800"
              }
            >
              In-Progress Tasks
            </NavLink>
            <NavLink
              to="/dashboard/completed"
              className={({ isActive }) =>
                isActive
                  ? "px-4 py-2 text-white rounded bg-blue-800"
                  : "px-4 py-2 text-white rounded hover:bg-blue-800"
              }
            >
              Completed Tasks
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (Hamburger Menu) */}
      {isMenuOpen && (
        <div className="sm:hidden fixed top-0 left-0 w-full bg-blue-900 text-white p-4 z-20 shadow-md">
          <div className="space-y-4">
            <NavLink
              to="/dashboard/addtasks"
              className="block px-4 py-2 rounded hover:bg-blue-800"
            >
              Add Task
            </NavLink>
            <NavLink
              to="/dashboard/pending"
              className="block px-4 py-2 rounded hover:bg-blue-800"
            >
              Pending Tasks
            </NavLink>
            <NavLink
              to="/dashboard/inprocess"
              className="block px-4 py-2 rounded hover:bg-blue-800"
            >
              In-Progress Tasks
            </NavLink>
            <NavLink
              to="/dashboard/completed"
              className="block px-4 py-2 rounded hover:bg-blue-800"
            >
              Completed Tasks
            </NavLink>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
