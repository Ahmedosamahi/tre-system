
import React from 'react';
import { useCreateOrderModals } from '@/hooks/useCreateOrderModals';
import { SingleOrderModal } from './SingleOrderModal';
import { BulkOrderModal } from './BulkOrderModal';
import { PickupRequestModal } from './PickupRequestModal';

export const OrderModalsProvider = () => {
  const {
    isSingleOrderOpen,
    closeSingleOrderModal,
    isBulkOrderOpen,
    closeBulkOrderModal,
    isPickupRequestOpen,
    closePickupRequestModal
  } = useCreateOrderModals();

  // Log modal states outside of the JSX to avoid TypeScript errors
  console.log("Modal states:", { isSingleOrderOpen, isBulkOrderOpen, isPickupRequestOpen });

  // Important: We always render the modal components but control their open state
  // This ensures proper mounting/unmounting of internal Radix UI components
  return (
    <>
      <SingleOrderModal 
        isOpen={isSingleOrderOpen} 
        onClose={closeSingleOrderModal} 
      />
      
      <BulkOrderModal 
        isOpen={isBulkOrderOpen} 
        onClose={closeBulkOrderModal} 
      />
      
      <PickupRequestModal 
        isOpen={isPickupRequestOpen} 
        onClose={closePickupRequestModal} 
      />
    </>
  );
};
