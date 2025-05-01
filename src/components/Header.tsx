
import React from 'react';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBox } from './ui/SearchBox';
import { CreateOrderButton } from './orders/CreateOrderButton';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={`bg-white py-4 px-6 border-b border-gray-200 ${className}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        
        <div className="flex items-center space-x-4 flex-1 justify-center max-w-2xl mx-auto">
          <div className="w-full max-w-md">
            <SearchBox placeholder="AWBs, Order ID..." />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
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
            
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <img 
                  src="/lovable-uploads/43d72cbc-bb29-42a7-933a-b020049d73b2.png"
                  alt="User Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
