
import React from 'react';
import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
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
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdate: (updatedOrder: Order) => void;
}

export const OrderDetailsSidebar: React.FC<OrderDetailsSidebarProps> = ({
  order,
  isOpen,
  onClose,
  onOrderUpdate,
}) => {
  if (!order) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg lg:max-w-xl overflow-y-auto">
        <SheetHeader className="border-b pb-4 mb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold">
              Order Details - {order.id}
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          <OrderSummarySection order={order} onOrderUpdate={onOrderUpdate} />
          <CustomerInfoSection order={order} onOrderUpdate={onOrderUpdate} />
          <OrderItemsSection order={order} onOrderUpdate={onOrderUpdate} />
          <OrderDetailsSection order={order} onOrderUpdate={onOrderUpdate} />
          <PaymentDetailsSection order={order} onOrderUpdate={onOrderUpdate} />
          <StatusHistorySection order={order} />
          <CommentsSection order={order} onOrderUpdate={onOrderUpdate} />
          <TagsSection order={order} onOrderUpdate={onOrderUpdate} />
          <ActionsSection order={order} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
