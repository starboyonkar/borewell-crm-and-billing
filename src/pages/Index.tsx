
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';

const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);

  return <Dashboard />;
};

export default Index;
