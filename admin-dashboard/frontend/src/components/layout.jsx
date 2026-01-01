import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './header';

export default function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('[Layout] Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin', { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onLogout={handleLogout} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}