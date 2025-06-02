
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { ThemeCustomizer } from './ThemeCustomizer';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="theme-surface shadow-md theme-transition border-b theme-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sheet>
            <SheetTrigger asChild className="block md:hidden">
              <Button variant="ghost" size="icon" className="theme-text-primary">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 sm:w-80 theme-surface">
              <div className="flex flex-col h-full py-6 space-y-6">
                <div className="flex items-center px-4">
                  <img 
                    src="/lovable-uploads/20de38f6-1556-4a07-91e8-ba28d1486d4f.png" 
                    alt="Borewell Services Logo" 
                    className="h-10 w-auto mr-2" 
                  />
                  <Link to="/dashboard" className="text-xl font-bold theme-text-primary">
                    Borewell Services
                  </Link>
                </div>
                <nav className="flex flex-col space-y-4 px-4">
                  <Link to="/dashboard" className="hover:opacity-80 transition py-2 theme-text-secondary">
                    Dashboard
                  </Link>
                  <Link to="/customers" className="hover:opacity-80 transition py-2 theme-text-secondary">
                    Customers
                  </Link>
                  <Link to="/add-customer" className="hover:opacity-80 transition py-2 theme-text-secondary">
                    New Customer
                  </Link>
                  <Link to="/inventory" className="hover:opacity-80 transition py-2 theme-text-secondary">
                    Inventory
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/settings" className="hover:opacity-80 transition py-2 theme-text-secondary">
                      Settings
                    </Link>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/dashboard" className="flex items-center">
            <img 
              src="/lovable-uploads/20de38f6-1556-4a07-91e8-ba28d1486d4f.png" 
              alt="Borewell Services Logo" 
              className="h-10 w-auto mr-2" 
            />
            <span className="text-xl font-bold theme-text-primary">Borewell Services</span>
          </Link>
        </div>

        <nav className="hidden md:flex space-x-6">
          <Link to="/dashboard" className="hover:opacity-80 transition theme-text-secondary">
            Home
          </Link>
          <Link to="/customers" className="hover:opacity-80 transition theme-text-secondary">
            Customers
          </Link>
          <Link to="/add-customer" className="hover:opacity-80 transition py-0 my-0 mx-0 px-[19px] theme-text-secondary">
            Shop Now
          </Link>
          <Link to="/inventory" className="hover:opacity-80 transition theme-text-secondary">
            Inventory
          </Link>
          {user?.role === 'admin' && (
            <Link to="/settings" className="hover:opacity-80 transition theme-text-secondary">
              Settings
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeCustomizer />
          <ThemeToggle />
          <span className="hidden md:inline theme-text-primary font-medium">
            {user?.username} ({user?.role})
          </span>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="theme-primary text-white font-bold hover:opacity-90 transition-all theme-transition"
          >
            Log out 📴
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
