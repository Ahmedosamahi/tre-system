
import { useState, useContext, createContext } from 'react';

interface CreateOrderModalsContextType {
  isSingleOrderOpen: boolean;
  openSingleOrderModal: () => void;
  closeSingleOrderModal: () => void;
  isBulkOrderOpen: boolean;
  openBulkOrderModal: () => void;
  closeBulkOrderModal: () => void;
  isPickupRequestOpen: boolean;
  openPickupRequestModal: () => void;
  closePickupRequestModal: () => void;
}

const CreateOrderModalsContext = createContext<CreateOrderModalsContextType | undefined>(undefined);

export const CreateOrderModalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  
  const value = {
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
  
  return (
    <CreateOrderModalsContext.Provider value={value}>
      {children}
    </CreateOrderModalsContext.Provider>
  );
};

export const useCreateOrderModals = (): CreateOrderModalsContextType => {
  const context = useContext(CreateOrderModalsContext);
  
  if (context === undefined) {
    // If we're not in a provider, create a standalone version of the hook
    // This ensures backwards compatibility with the previous implementation
    const [isSingleOrderOpen, setIsSingleOrderOpen] = useState(false);
    const [isBulkOrderOpen, setIsBulkOrderOpen] = useState(false);
    const [isPickupRequestOpen, setIsPickupRequestOpen] = useState(false);
    
    const openSingleOrderModal = () => {
      console.log("Opening single order modal (standalone)");
      setIsSingleOrderOpen(true);
      setIsBulkOrderOpen(false);
      setIsPickupRequestOpen(false);
    };
    
    const closeSingleOrderModal = () => {
      console.log("Closing single order modal (standalone)");
      setIsSingleOrderOpen(false);
    };
    
    const openBulkOrderModal = () => {
      console.log("Opening bulk order modal (standalone)");
      setIsBulkOrderOpen(true);
      setIsSingleOrderOpen(false);
      setIsPickupRequestOpen(false);
    };
    
    const closeBulkOrderModal = () => {
      console.log("Closing bulk order modal (standalone)");
      setIsBulkOrderOpen(false);
    };
    
    const openPickupRequestModal = () => {
      console.log("Opening pickup request modal (standalone)");
      setIsPickupRequestOpen(true);
      setIsSingleOrderOpen(false);
      setIsBulkOrderOpen(false);
    };
    
    const closePickupRequestModal = () => {
      console.log("Closing pickup request modal (standalone)");
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
  }
  
  return context;
};
