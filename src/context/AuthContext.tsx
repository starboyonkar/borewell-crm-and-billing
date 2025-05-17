
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

// Define a proper type for users that includes all possible roles
type UserRecord = {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user' | 'customer';
  fullName?: string;
  email?: string;
};

// Mock user database with default admin and user accounts
const USERS: UserRecord[] = [
  { id: '1', username: 'admin', password: 'admin123', role: 'admin' },
  { id: '2', username: 'user', password: 'user123', role: 'user' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<UserRecord[]>(USERS);

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
        setUsers([...USERS, ...parsedUsers.filter((u: UserRecord) => u.role === 'customer')]);
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
    // For regular admin/user login or customer login
    const user = users.find(
      (u) => u.username === username && u.password === password && u.role === role
    );

    if (user) {
      // Using a proper object destructuring without rest spread
      const userInfo: User = {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        email: user.email
      };
      
      setUser(userInfo);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userInfo));
      toast.success('Login successful!');
      return true;
    } else {
      toast.error(role === 'customer' ? 'Invalid email or password' : 'Invalid username or password');
      return false;
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
    const newCustomer: UserRecord = {
      id: Date.now().toString(),
      username: email,
      password,
      role: 'customer',
      fullName,
      email
    };

    // Update users array
    const updatedUsers = [...users, newCustomer];
    setUsers(updatedUsers);
    
    // Save to localStorage - properly type the customer
    const customerInfo: User = {
      id: newCustomer.id,
      username: newCustomer.username,
      role: newCustomer.role,
      fullName: newCustomer.fullName,
      email: newCustomer.email
    };
    
    localStorage.setItem('users', JSON.stringify(updatedUsers.filter(u => u.role === 'customer')));
    
    // Auto-login the new customer
    setUser(customerInfo);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(customerInfo));
    
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
      logout: () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        toast.info('You have been logged out');
      }, 
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
