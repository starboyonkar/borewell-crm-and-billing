
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

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
        <div className="flex items-center space-x-2">
          <Sheet>
            <SheetTrigger asChild className="block md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 sm:w-80">
              <div className="flex flex-col h-full py-6 space-y-6">
                <Link to="/dashboard" className="text-xl font-bold px-4">
                  Borewell Services
                </Link>
                <nav className="flex flex-col space-y-4 px-4">
                  <Link to="/dashboard" className="hover:text-blue-200 transition py-2">
                    Dashboard
                  </Link>
                  <Link to="/customers" className="hover:text-blue-200 transition py-2">
                    Customers
                  </Link>
                  <Link to="/add-customer" className="hover:text-blue-200 transition py-2">
                    New Customer
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/settings" className="hover:text-blue-200 transition py-2">
                      Settings
                    </Link>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/dashboard" className="text-xl font-bold">
            Borewell Services
          </Link>
        </div>

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
          <ThemeToggle />
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
