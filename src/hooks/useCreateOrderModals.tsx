
import { useState } from 'react';

export const useCreateOrderModals = () => {
  const [isSingleOrderOpen, setIsSingleOrderOpen] = useState(false);
  const [isBulkOrderOpen, setIsBulkOrderOpen] = useState(false);
  const [isPickupRequestOpen, setIsPickupRequestOpen] = useState(false);
  
  const openSingleOrderModal = () => {
    setIsSingleOrderOpen(true);
  };
  
  const closeSingleOrderModal = () => {
    setIsSingleOrderOpen(false);
  };
  
  const openBulkOrderModal = () => {
    setIsBulkOrderOpen(true);
  };
  
  const closeBulkOrderModal = () => {
    setIsBulkOrderOpen(false);
  };
  
  const openPickupRequestModal = () => {
    setIsPickupRequestOpen(true);
  };
  
  const closePickupRequestModal = () => {
    setIsPickupRequestOpen(false);
  };
  
  return {
    isSingleOrderOpen,
    openSingleOrderModal,
    closeSingleOrderModal,
    isBulkOrderOpen,
    openBulkOrderModal,
    closeBulkOrderModal,
    isPickupRequestOpen,
    openPickupRequestModal,
    closePickupRequestModal
  };
};
