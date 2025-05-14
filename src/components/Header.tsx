
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-borewell-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">
          Borewell Services
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link to="/dashboard" className="hover:text-blue-200 transition">
            Dashboard
          </Link>
          <Link to="/customers" className="hover:text-blue-200 transition">
            Customers
          </Link>
          <Link to="/add-customer" className="hover:text-blue-200 transition">
            New Customer
          </Link>
          {user?.role === 'admin' && (
            <Link to="/settings" className="hover:text-blue-200 transition">
              Settings
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <span className="hidden md:inline">
            {user?.username} ({user?.role})
          </span>
          <Button variant="outline" onClick={handleLogout} className="text-white border-white hover:bg-borewell-600">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
