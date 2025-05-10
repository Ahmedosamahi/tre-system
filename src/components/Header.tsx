
import React, { useState } from 'react';
import { Globe, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBox } from './ui/SearchBox';
import { CreateOrderButton } from './orders/CreateOrderButton';
import { useLocation } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const location = useLocation();
  
  // Function to get the page title based on the current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    switch(path) {
      case '/':
      case '/dashboard':
        return 'Dashboard';
      case '/orders':
        return 'Orders';
      case '/warehouse':
        return 'Warehouse';
      case '/customers':
        return 'Customers';
      case '/couriers':
        return 'Couriers';
      case '/financial':
        return 'Financial';
      case '/reports':
        return 'Reports';
      case '/settings':
        return 'Settings';
      case '/support':
        return 'Help & Support';
      case '/crm-customer-service':
        return 'CRM Customer Service (Abnormal)';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className={`bg-white py-4 px-6 border-b border-gray-200 ${className}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
        
        <div className="flex items-center space-x-4 flex-1 justify-center max-w-2xl mx-auto">
          <div className="w-full max-w-md">
            <SearchBox placeholder="AWBs, Order ID..." />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Change Language</span>
          </Button>
          
          <Button className="bg-brand text-white hover:bg-brand-dark">
            <span className="flex items-center"><Wallet className="mr-2 h-5 w-5" />$1199.00</span>
          </Button>
          
          <CreateOrderButton />
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <span className="sr-only">Notifications</span>
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22a2 2 0 1 0 4 0" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="h-10 w-10 rounded-full overflow-hidden cursor-pointer">
                  <Avatar>
                    <AvatarImage 
                      src="/lovable-uploads/43d72cbc-bb29-42a7-933a-b020049d73b2.png"
                      alt="User Profile"
                    />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer">
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
