
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Order } from '@/types/Order';
import { OrderSummarySection } from './sidebar/OrderSummarySection';
import { CustomerInfoSection } from './sidebar/CustomerInfoSection';
import { OrderItemsSection } from './sidebar/OrderItemsSection';
import { OrderDetailsSection } from './sidebar/OrderDetailsSection';
import { PaymentDetailsSection } from './sidebar/PaymentDetailsSection';
import { StatusHistorySection } from './sidebar/StatusHistorySection';
import { CommentsSection } from './sidebar/CommentsSection';
import { TagsSection } from './sidebar/TagsSection';
import { ActionsSection } from './sidebar/ActionsSection';

interface OrderDetailsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const OrderDetailsSidebar: React.FC<OrderDetailsSidebarProps> = ({
  isOpen,
  onClose,
  order,
  onUpdateOrder
}) => {
  if (!order) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[500px] max-w-[90vw] overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between border-b pb-4 mb-6">
          <SheetTitle className="text-xl font-semibold">Order Details</SheetTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <div className="space-y-6">
          <OrderSummarySection order={order} onUpdateOrder={onUpdateOrder} />
          <CustomerInfoSection order={order} onUpdateOrder={onUpdateOrder} />
          <OrderItemsSection order={order} onUpdateOrder={onUpdateOrder} />
          <OrderDetailsSection order={order} onUpdateOrder={onUpdateOrder} />
          <PaymentDetailsSection order={order} onUpdateOrder={onUpdateOrder} />
          <StatusHistorySection order={order} />
          <CommentsSection order={order} onUpdateOrder={onUpdateOrder} />
          <TagsSection order={order} onUpdateOrder={onUpdateOrder} />
          <ActionsSection order={order} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
