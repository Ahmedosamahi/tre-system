
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Order } from '@/types/Order';

interface OrderSummarySectionProps {
  order: Order;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const OrderSummarySection: React.FC<OrderSummarySectionProps> = ({
  order,
  onUpdateOrder
}) => {
  const handleStatusChange = (newStatus: string) => {
    const updatedOrder = {
      ...order,
      status: newStatus as Order['status'],
      lastUpdated: new Date().toISOString()
    };
    onUpdateOrder(updatedOrder);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'dispatched': return 'default';
      case 'delivered': return 'default';
      case 'returned': return 'destructive';
      case 'canceled': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Order Summary</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Order ID</label>
          <p className="text-sm font-mono">{order.orderNumber}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-600">Status</label>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={getStatusColor(order.status)} className="capitalize">
              {order.status}
            </Badge>
            <Select value={order.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-24 h-6 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="dispatched">Dispatched</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-600">Created Date</label>
          <p className="text-sm">{new Date(order.createdDate).toLocaleDateString()}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-600">Last Updated</label>
          <p className="text-sm">{new Date(order.lastUpdated).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
