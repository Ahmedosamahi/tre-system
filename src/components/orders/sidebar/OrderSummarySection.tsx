
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types/Order';

interface OrderSummarySectionProps {
  order: Order;
  onOrderUpdate: (updatedOrder: Order) => void;
}

export const OrderSummarySection: React.FC<OrderSummarySectionProps> = ({
  order,
  onOrderUpdate,
}) => {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'outline';
      case 'confirmed': return 'secondary';
      case 'dispatched': return 'default';
      case 'delivered': return 'default';
      case 'returned': return 'destructive';
      case 'canceled': return 'destructive';
      default: return 'outline';
    }
  };

  const getAvailableStatusTransitions = (currentStatus: string) => {
    switch (currentStatus.toLowerCase()) {
      case 'pending':
        return ['Confirmed', 'Canceled'];
      case 'confirmed':
        return ['Dispatched', 'Canceled'];
      case 'dispatched':
        return ['Delivered', 'Returned'];
      default:
        return [];
    }
  };

  const handleStatusChange = (newStatus: string) => {
    const updatedOrder = { ...order, status: newStatus };
    onOrderUpdate(updatedOrder);
  };

  const availableStatuses = getAvailableStatusTransitions(order.status);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Order ID</label>
            <p className="font-mono text-sm mt-1">{order.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <div className="mt-1">
              {availableStatuses.length > 0 ? (
                <Select value={order.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={order.status}>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </SelectItem>
                    {availableStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        <Badge variant={getStatusVariant(status)}>
                          {status}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Created Date</label>
            <p className="text-sm mt-1">{order.createdAt}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Last Updated</label>
            <p className="text-sm mt-1">{order.updatedAt}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
