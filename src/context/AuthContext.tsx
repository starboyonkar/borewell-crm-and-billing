
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  username: string;
  role: 'admin' | 'user' | 'customer';
  fullName?: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string, role: string, fullName?: string, email?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  registerCustomer: (fullName: string, email: string, password: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database with default admin and user accounts
const USERS = [
  { id: '1', username: 'admin', password: 'admin123', role: 'admin' as const },
  { id: '2', username: 'user', password: 'user123', role: 'user' as const },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState(USERS);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    
    // Load any saved customers
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers);
        setUsers([...USERS, ...parsedUsers.filter((u: User) => u.role === 'customer')]);
      } catch (error) {
        console.error('Error parsing saved users:', error);
      }
    }
  }, []);

  const login = async (
    username: string, 
    password: string, 
    role: string,
    fullName?: string,
    email?: string
  ): Promise<boolean> => {
    // For regular admin/user login
    if (role !== 'customer') {
      const user = users.find(
        (u) => u.username === username && u.password === password && u.role === role
      );

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        toast.success('Login successful!');
        return true;
      } else {
        toast.error('Invalid username or password');
        return false;
      }
    } 
    // For customer login (email-based)
    else {
      const user = users.find(
        (u) => u.username === username && u.password === password && u.role === 'customer'
      );

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        toast.success('Login successful!');
        return true;
      } else {
        toast.error('Invalid email or password');
        return false;
      }
    }
  };

  const registerCustomer = async (fullName: string, email: string, password: string): Promise<boolean> => {
    // Check if email already exists
    const existingUser = users.find(u => u.username === email);
    if (existingUser) {
      toast.error('Email already registered');
      return false;
    }

    // Create new customer account
    const newCustomer = {
      id: Date.now().toString(),
      username: email,
      password,
      role: 'customer' as const,
      fullName,
      email
    };

    // Update users array
    const updatedUsers = [...users, newCustomer];
    setUsers(updatedUsers);
    
    // Save to localStorage
    const { password: _, ...customerWithoutPassword } = newCustomer;
    localStorage.setItem('users', JSON.stringify(updatedUsers.filter(u => u.role === 'customer')));
    
    // Auto-login the new customer
    setUser(customerWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(customerWithoutPassword));
    
    toast.success('Registration successful!');
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      registerCustomer 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
