
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

  console.log("Modal states:", { isSingleOrderOpen, isBulkOrderOpen, isPickupRequestOpen });

  return (
    <div className="order-modals-container">
      <SingleOrderModal isOpen={isSingleOrderOpen} onClose={closeSingleOrderModal} />
      <BulkOrderModal isOpen={isBulkOrderOpen} onClose={closeBulkOrderModal} />
      <PickupRequestModal isOpen={isPickupRequestOpen} onClose={closePickupRequestModal} />
    </div>
  );
};
