
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Header from './Header';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  // If trying to access login while authenticated, redirect to dashboard
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {isAuthenticated && <Header />}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      {isAuthenticated && (
        <footer className="bg-borewell-800 text-white p-4 text-center">
          <p>© {new Date().getFullYear()} Borewell Services & Equipment. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
};

export default Layout;
