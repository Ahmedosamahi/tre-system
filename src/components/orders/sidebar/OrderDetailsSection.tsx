
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types/Order';

interface OrderDetailsSectionProps {
  order: Order;
  onOrderUpdate: (updatedOrder: Order) => void;
}

export const OrderDetailsSection: React.FC<OrderDetailsSectionProps> = ({
  order,
}) => {
  const mockDetails = {
    serviceType: 'Delivery',
    weight: '1.5 kg',
    courier: order.courier,
    deliveryAttempts: 0,
    warehouse: 'Cairo Main',
    awb: 'AWB0012345',
    reference: 'REF-001',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Service Type</label>
            <p className="text-sm mt-1">{mockDetails.serviceType}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Weight</label>
            <p className="text-sm mt-1">{mockDetails.weight}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Courier</label>
            <p className="text-sm mt-1">{mockDetails.courier}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Delivery Attempts</label>
            <p className="text-sm mt-1">{mockDetails.deliveryAttempts}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Warehouse</label>
            <p className="text-sm mt-1">{mockDetails.warehouse}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">AWB</label>
            <p className="text-sm mt-1 font-mono">{mockDetails.awb}</p>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Reference</label>
          <p className="text-sm mt-1">{mockDetails.reference}</p>
        </div>
      </CardContent>
    </Card>
  );
};
