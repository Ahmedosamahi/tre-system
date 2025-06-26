
import React from 'react';
import { Printer, Edit, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types/Order';

interface ActionsSectionProps {
  order: Order;
}

export const ActionsSection: React.FC<ActionsSectionProps> = ({
  order,
}) => {
  const hasCourier = order.courier && order.courier !== '-';
  
  const handleEditOrder = () => {
    console.log('Edit order:', order.id);
  };

  const handlePrintAWB = () => {
    console.log('Print AWB for order:', order.id);
  };

  const handlePrintInvoice = () => {
    console.log('Print invoice for order:', order.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" className="w-full justify-start" onClick={handleEditOrder}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Order
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={handlePrintAWB}
          disabled={!hasCourier}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print AWB
          {!hasCourier && <span className="ml-auto text-xs text-gray-400">(No courier assigned)</span>}
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={handlePrintInvoice}>
          <FileText className="h-4 w-4 mr-2" />
          Print Invoice
        </Button>
      </CardContent>
    </Card>
  );
};
