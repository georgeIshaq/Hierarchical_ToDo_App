import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          {user && location.pathname !== '/login' && (
            <button onClick={handleLogout} className="text-white">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;