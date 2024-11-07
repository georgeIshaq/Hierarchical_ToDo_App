// frontend/src/components/common/Navbar.jsx

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 shadow">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div>
          <Link to="/" className="text-white text-xl font-bold">
            TodoApp
          </Link>
        </div>
        <div>
          {user ? (
            <button
              onClick={handleLogout}
              className="text-white bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              Logout
            </button>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <Link
                  to="/login"
                  className="text-white bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium transition duration-200 mr-2"
                >
                  Login
                </Link>
              )}
              {location.pathname !== '/register' && (
                <Link
                  to="/register"
                  className="text-indigo-600 bg-white hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Register
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;