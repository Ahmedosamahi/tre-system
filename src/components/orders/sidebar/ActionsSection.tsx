
import React from 'react';
import { Edit, FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/Order';

interface ActionsSectionProps {
  order: Order;
}

export const ActionsSection: React.FC<ActionsSectionProps> = ({
  order
}) => {
  const handleEditOrder = () => {
    console.log('Edit order:', order.id);
  };

  const handlePrintAWB = () => {
    console.log('Print AWB for order:', order.id);
  };

  const handlePrintInvoice = () => {
    console.log('Print Invoice for order:', order.id);
  };

  const canPrintAWB = Boolean(order.courier && order.awb);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Actions</h3>
      
      <div className="space-y-2">
        <Button
          onClick={handleEditOrder}
          className="w-full justify-start"
          variant="outline"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Order
        </Button>

        <Button
          onClick={handlePrintAWB}
          disabled={!canPrintAWB}
          className="w-full justify-start"
          variant="outline"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print AWB
        </Button>

        <Button
          onClick={handlePrintInvoice}
          className="w-full justify-start"
          variant="outline"
        >
          <FileText className="h-4 w-4 mr-2" />
          Print Invoice
        </Button>
      </div>
    </div>
  );
};
