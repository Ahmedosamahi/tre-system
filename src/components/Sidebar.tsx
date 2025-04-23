
import React from 'react';
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
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { title: 'Orders', href: '/orders', icon: 'ShoppingCart' },
  { title: 'Warehouse', href: '/warehouse', icon: 'Warehouse' },
  { title: 'Customers', href: '/customers', icon: 'Users' },
  { title: 'Couriers', href: '/couriers', icon: 'Truck' },
  { title: 'Financial', href: '/financial', icon: 'DollarSign' },
  { title: 'Reports', href: '/reports', icon: 'BarChart' },
  { title: 'Settings', href: '/settings', icon: 'Settings' },
  { title: 'Help & Support', href: '/support', icon: 'HelpCircle' },
];

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [activePath, setActivePath] = React.useState('/');
  
  React.useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

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

  return (
    <aside className={cn('w-64 bg-white border-r border-gray-200 h-screen fixed', className)}>
      <div className="p-6">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold text-brand">tredo</h1>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activePath === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors',
                  isActive 
                    ? 'bg-brand-light bg-opacity-10 text-brand-light' 
                    : 'text-gray-700 hover:bg-gray-100'
                )}
                onClick={() => setActivePath(item.href)}
              >
                <span className={cn('mr-3', isActive ? 'text-brand-light' : 'text-gray-500')}>
                  {getIcon(item.icon)}
                </span>
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
