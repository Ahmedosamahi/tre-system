
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types/Order';

interface PaymentDetailsSectionProps {
  order: Order;
  onOrderUpdate: (updatedOrder: Order) => void;
}

export const PaymentDetailsSection: React.FC<PaymentDetailsSectionProps> = ({
  order,
}) => {
  const mockPaymentDetails = {
    paymentMethod: 'Cash',
    paymentStatus: 'Pending',
    valueOfGoods: order.total,
    codAmount: order.codAmount,
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'default';
      case 'pending': return 'outline';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Payment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Payment Method</label>
            <p className="text-sm mt-1">{mockPaymentDetails.paymentMethod}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Payment Status</label>
            <div className="mt-1">
              <Badge variant={getPaymentStatusColor(mockPaymentDetails.paymentStatus)}>
                {mockPaymentDetails.paymentStatus}
              </Badge>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Value of Goods</label>
            <p className="text-sm mt-1 font-medium">{mockPaymentDetails.valueOfGoods} EGP</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">COD Amount</label>
            <p className="text-sm mt-1 font-medium">{mockPaymentDetails.codAmount} EGP</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
