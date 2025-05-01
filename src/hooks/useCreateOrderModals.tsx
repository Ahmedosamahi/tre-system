
import { useState } from 'react';

export const useCreateOrderModals = () => {
  const [isSingleOrderOpen, setIsSingleOrderOpen] = useState(false);
  const [isBulkOrderOpen, setIsBulkOrderOpen] = useState(false);
  const [isPickupRequestOpen, setIsPickupRequestOpen] = useState(false);
  
  const openSingleOrderModal = () => {
    setIsSingleOrderOpen(true);
    // Close other modals if open
    setIsBulkOrderOpen(false);
    setIsPickupRequestOpen(false);
  };
  
  const closeSingleOrderModal = () => {
    setIsSingleOrderOpen(false);
  };
  
  const openBulkOrderModal = () => {
    setIsBulkOrderOpen(true);
    // Close other modals if open
    setIsSingleOrderOpen(false);
    setIsPickupRequestOpen(false);
  };
  
  const closeBulkOrderModal = () => {
    setIsBulkOrderOpen(false);
  };
  
  const openPickupRequestModal = () => {
    setIsPickupRequestOpen(true);
    // Close other modals if open
    setIsSingleOrderOpen(false);
    setIsBulkOrderOpen(false);
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
