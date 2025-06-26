
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Order } from '@/types/Order';

interface OrderItemsSectionProps {
  order: Order;
  onOrderUpdate: (updatedOrder: Order) => void;
}

export const OrderItemsSection: React.FC<OrderItemsSectionProps> = ({
  order,
}) => {
  const mockItems = [
    { sku: 'SKU001', description: "Men's T-Shirt", quantity: 1 },
    { sku: 'SKU002', description: "Women's Scarf", quantity: 1 },
  ];

  const totalQuantity = mockItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Qty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
              </TableRow>
            ))}
            <TableRow className="font-medium">
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right">{totalQuantity}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
