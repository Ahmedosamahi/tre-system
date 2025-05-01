
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

  return (
    <>
      {isSingleOrderOpen && (
        <SingleOrderModal isOpen={isSingleOrderOpen} onClose={closeSingleOrderModal} />
      )}
      {isBulkOrderOpen && (
        <BulkOrderModal isOpen={isBulkOrderOpen} onClose={closeBulkOrderModal} />
      )}
      {isPickupRequestOpen && (
        <PickupRequestModal isOpen={isPickupRequestOpen} onClose={closePickupRequestModal} />
      )}
    </>
  );
};
