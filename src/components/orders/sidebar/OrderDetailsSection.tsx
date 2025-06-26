
import React from 'react';
import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/Order';

interface OrderDetailsSectionProps {
  order: Order;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const OrderDetailsSection: React.FC<OrderDetailsSectionProps> = ({
  order,
  onUpdateOrder
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Order Details</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-600">Service Type</label>
            <p className="text-sm">{order.serviceType}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Edit2 className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-600">Weight</label>
            <p className="text-sm">{order.weight} kg</p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Edit2 className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-600">Courier</label>
            <p className="text-sm">{order.courier}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Edit2 className="h-3 w-3" />
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Delivery Attempts</label>
          <p className="text-sm">{order.deliveryAttempts}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-600">Warehouse</label>
            <p className="text-sm">{order.warehouse}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Edit2 className="h-3 w-3" />
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">AWB</label>
          <p className="text-sm font-mono">{order.awb}</p>
        </div>

        <div className="flex items-center justify-between col-span-2">
          <div>
            <label className="text-sm font-medium text-gray-600">Reference</label>
            <p className="text-sm">{order.reference}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Edit2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
