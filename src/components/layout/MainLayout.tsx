import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/context/AuthContext';
import SearchBar from '../SearchBar';

const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background gradient using Dashboardly brand colors */}
      <div className="fixed inset-0 bg-gradient-to-r from-[hsl(275, 41.90%, 44.50%)] via-[hsl(273,90%,20%)] to-[hsl(272,90%,15%)]" />
      
      {/* Content */}
      <div className="relative flex min-h-screen">
        {user && (
          <div className="fixed inset-y-0 left-0">
            <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
          </div>
        )}
        <div className={`flex-1 flex flex-col ${!user ? 'max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8' : ''} ${user ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : ''}`}>
          <Header />
          {user && (
            <div className="sticky top-0 z-10 border-b border-gray-800 bg-[#352060]/80 backdrop-blur">
              <div className="flex h-16 items-center gap-4 px-4">
                <SearchBar />
              </div>
            </div>
          )}
          <main className={`flex-1 ${user ? 'p-6' : 'py-8'}`}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
