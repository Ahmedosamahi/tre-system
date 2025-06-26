
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Order } from '@/types/Order';

interface PaymentDetailsSectionProps {
  order: Order;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const PaymentDetailsSection: React.FC<PaymentDetailsSectionProps> = ({
  order,
  onUpdateOrder
}) => {
  const handlePaymentStatusChange = (newStatus: string) => {
    const updatedOrder = {
      ...order,
      paymentStatus: newStatus as Order['paymentStatus']
    };
    onUpdateOrder(updatedOrder);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Payment Details</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Payment Method</label>
          <p className="text-sm">{order.paymentMethod}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Payment Status</label>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={getPaymentStatusColor(order.paymentStatus)} className="capitalize">
              {order.paymentStatus}
            </Badge>
            <Select value={order.paymentStatus} onValueChange={handlePaymentStatusChange}>
              <SelectTrigger className="w-24 h-6 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Value of Goods</label>
          <p className="text-sm">{order.valueOfGoods} EGP</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">COD Amount</label>
          <p className="text-sm">{order.codAmount} EGP</p>
        </div>
      </div>
    </div>
  );
};
