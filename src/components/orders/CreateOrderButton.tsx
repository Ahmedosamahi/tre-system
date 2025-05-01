
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Truck } from 'lucide-react';
import { useCreateOrderModals } from '@/hooks/useCreateOrderModals';

export const CreateOrderButton = () => {
  const { 
    openSingleOrderModal, 
    openBulkOrderModal, 
    openPickupRequestModal 
  } = useCreateOrderModals();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-brand text-white hover:bg-brand-dark transition-all">
          <span className="flex items-center">
            <span className="mr-2">
              <svg width="16" height="16" className="inline align-middle" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
              </svg>
            </span>
            Create Order
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 animate-in fade-in-50 slide-in-from-top-5">
        <DropdownMenuItem onClick={openSingleOrderModal} className="cursor-pointer py-3 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Single Order</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openBulkOrderModal} className="cursor-pointer py-3 flex items-center gap-2">
          <Upload className="h-4 w-4" />
          <span>Bulk Order</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openPickupRequestModal} className="cursor-pointer py-3 flex items-center gap-2">
          <Truck className="h-4 w-4" />
          <span>Pickup Request</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
