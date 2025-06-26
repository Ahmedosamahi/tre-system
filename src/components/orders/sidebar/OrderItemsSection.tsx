
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Order } from '@/types/Order';

interface OrderItemsSectionProps {
  order: Order;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const OrderItemsSection: React.FC<OrderItemsSectionProps> = ({
  order,
  onUpdateOrder
}) => {
  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="text-lg font-medium">Order Items</h3>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Item
        </Button>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">SKU</TableHead>
              <TableHead className="text-xs">Description</TableHead>
              <TableHead className="text-xs w-20">Qty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-xs font-mono">{item.sku}</TableCell>
                <TableCell className="text-xs">{item.description}</TableCell>
                <TableCell className="text-xs">{item.quantity}</TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-2 font-medium">
              <TableCell className="text-xs" colSpan={2}>Total</TableCell>
              <TableCell className="text-xs">{totalQuantity}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
