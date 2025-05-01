
import { useState } from 'react';

export const useCreateOrderModals = () => {
  const [isSingleOrderOpen, setIsSingleOrderOpen] = useState(false);
  const [isBulkOrderOpen, setIsBulkOrderOpen] = useState(false);
  const [isPickupRequestOpen, setIsPickupRequestOpen] = useState(false);
  
  const openSingleOrderModal = () => {
    console.log("Opening single order modal");
    setIsSingleOrderOpen(true);
    // Close other modals if open
    setIsBulkOrderOpen(false);
    setIsPickupRequestOpen(false);
  };
  
  const closeSingleOrderModal = () => {
    console.log("Closing single order modal");
    setIsSingleOrderOpen(false);
  };
  
  const openBulkOrderModal = () => {
    console.log("Opening bulk order modal");
    setIsBulkOrderOpen(true);
    // Close other modals if open
    setIsSingleOrderOpen(false);
    setIsPickupRequestOpen(false);
  };
  
  const closeBulkOrderModal = () => {
    console.log("Closing bulk order modal");
    setIsBulkOrderOpen(false);
  };
  
  const openPickupRequestModal = () => {
    console.log("Opening pickup request modal");
    setIsPickupRequestOpen(true);
    // Close other modals if open
    setIsSingleOrderOpen(false);
    setIsBulkOrderOpen(false);
  };
  
  const closePickupRequestModal = () => {
    console.log("Closing pickup request modal");
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
