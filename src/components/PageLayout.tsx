
import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Check if sidebar is collapsed from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setSidebarCollapsed(savedState === 'true');
    }
    
    // Listen for sidebar state changes
    const handleSidebarChange = (event: CustomEvent<{collapsed: boolean}>) => {
      setSidebarCollapsed(event.detail.collapsed);
    };
    
    window.addEventListener('sidebar-state-changed', handleSidebarChange as EventListener);
    
    return () => {
      window.removeEventListener('sidebar-state-changed', handleSidebarChange as EventListener);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div 
        className="flex-1 transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarCollapsed ? '5rem' : '16rem' }}
      >
        <Header />
        <main className="px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
