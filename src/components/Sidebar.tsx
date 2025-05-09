
import React, { useState, useEffect } from 'react';
import { NavItem } from '@/types';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Warehouse, 
  Users, 
  Truck, 
  DollarSign,
  BarChart,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { title: 'Orders', href: '/orders', icon: 'ShoppingCart' },
  { title: 'Warehouse', href: '/warehouse', icon: 'Warehouse' },
  { title: 'Customers', href: '/customers', icon: 'Users' },
  { title: 'Couriers', href: '/couriers', icon: 'Truck' },
  { title: 'Financial', href: '/financial', icon: 'DollarSign' },
  { title: 'Reports', href: '/reports', icon: 'BarChart' },
  { title: 'CRM Customer Service', href: '/crm-customer-service', icon: 'MessageSquare' },
  { title: 'Settings', href: '/settings', icon: 'Settings' },
  { title: 'Help & Support', href: '/support', icon: 'HelpCircle' },
];

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [activePath, setActivePath] = React.useState('/');
  const [collapsed, setCollapsed] = React.useState(false);
  
  // Check for saved sidebar state in localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setCollapsed(savedState === 'true');
    }
    
    setActivePath(window.location.pathname);
  }, []);

  // Save sidebar state when it changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
    
    // Dispatch an event so other components can react to sidebar changes
    const event = new CustomEvent('sidebar-state-changed', { detail: { collapsed } });
    window.dispatchEvent(event);
  }, [collapsed]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutDashboard': return <LayoutDashboard size={24} />;
      case 'ShoppingCart': return <ShoppingCart size={24} />;
      case 'Warehouse': return <Warehouse size={24} />;
      case 'Users': return <Users size={24} />;
      case 'Truck': return <Truck size={24} />;
      case 'DollarSign': return <DollarSign size={24} />;
      case 'BarChart': return <BarChart size={24} />;
      case 'Settings': return <Settings size={24} />;
      case 'HelpCircle': return <HelpCircle size={24} />;
      default: return <LayoutDashboard size={24} />;
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside 
      className={cn(
        'bg-white border-r border-gray-200 h-screen fixed transition-all duration-300 ease-in-out z-20',
        collapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      <div className={cn("p-6", collapsed && "p-4")}>
        <div className={cn("flex items-center mb-8", collapsed && "justify-center")}>
          <h1 className={cn("text-3xl font-bold text-brand", collapsed && "text-2xl")}>
            {collapsed ? 'T' : 'tredo'}
          </h1>
        </div>
        
        <TooltipProvider>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activePath === item.href;
              return (
                <Tooltip key={item.href} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors',
                        collapsed ? 'justify-center' : '',
                        isActive 
                          ? 'bg-brand-light bg-opacity-10 text-brand-light' 
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                      onClick={() => setActivePath(item.href)}
                    >
                      <span className={cn('mr-3', collapsed ? 'mr-0' : '', isActive ? 'text-brand-light' : 'text-gray-500')}>
                        {getIcon(item.icon)}
                      </span>
                      {!collapsed && item.title}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      {item.title}
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>
        </TooltipProvider>
      </div>
      
      {/* Sidebar toggle button */}
      <button 
        onClick={toggleSidebar}
        className={cn(
          "absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-all",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light"
        )}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
};

export default Sidebar;
