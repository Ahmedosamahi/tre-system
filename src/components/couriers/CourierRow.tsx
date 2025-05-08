
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

interface CourierRowProps {
  courier: {
    id: number;
    name: string;
    logo: string;
    comingSoon?: boolean;
  };
}

export const CourierRow: React.FC<CourierRowProps> = ({ courier }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b">
      <div className="flex items-center gap-4">
        {courier.logo ? (
          <Avatar className="h-12 w-12">
            <AvatarImage src={courier.logo} alt={courier.name} />
            <AvatarFallback>{courier.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="h-12 w-12">
            <AvatarFallback>{courier.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
        )}
        <span className="font-medium text-lg">{courier.name}</span>
      </div>
      
      <div className="flex items-center gap-3">
        {courier.comingSoon ? (
          <span className="text-orange-500 font-medium">Coming soon</span>
        ) : (
          <>
            <Button variant="outline" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Request material</span>
            </Button>
            <Button variant="outline">Manage</Button>
          </>
        )}
      </div>
    </div>
  );
};
