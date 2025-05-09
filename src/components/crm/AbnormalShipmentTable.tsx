
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, MessageSquare } from 'lucide-react';

interface Shipment {
  id: string;
  awbNumber: string;
  referenceNumber: string;
  abnormalTime: string;
  customerName: string;
  phone: string;
  mainReason: string;
  subReason: string;
  courierNote: string;
  isReplied: boolean;
}

interface AbnormalShipmentTableProps {
  shipments: Shipment[];
  onView: (id: string) => void;
  onReply: (id: string) => void;
}

export const AbnormalShipmentTable: React.FC<AbnormalShipmentTableProps> = ({ 
  shipments, 
  onView,
  onReply
}) => {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  
  const toggleSelectAll = () => {
    if (Object.keys(selectedRows).length === shipments.length) {
      setSelectedRows({});
    } else {
      const allSelected = shipments.reduce((acc, shipment) => {
        acc[shipment.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setSelectedRows(allSelected);
    }
  };
  
  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const isAllSelected = shipments.length > 0 && Object.keys(selectedRows).length === shipments.length;
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={isAllSelected}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>AWB Number</TableHead>
            <TableHead>Reference Number</TableHead>
            <TableHead>Abnormal Time</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Main Reason</TableHead>
            <TableHead>Sub Reason</TableHead>
            <TableHead className="max-w-xs">Courier Note</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.map((shipment) => (
            <TableRow key={shipment.id}>
              <TableCell>
                <Checkbox 
                  checked={!!selectedRows[shipment.id]}
                  onCheckedChange={() => toggleSelectRow(shipment.id)}
                />
              </TableCell>
              <TableCell>{shipment.awbNumber}</TableCell>
              <TableCell>{shipment.referenceNumber}</TableCell>
              <TableCell>{shipment.abnormalTime}</TableCell>
              <TableCell>{shipment.customerName}</TableCell>
              <TableCell>{shipment.phone}</TableCell>
              <TableCell>{shipment.mainReason}</TableCell>
              <TableCell>{shipment.subReason}</TableCell>
              <TableCell className="max-w-xs">
                <p className="truncate" title={shipment.courierNote}>
                  {shipment.courierNote}
                </p>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onView(shipment.id)}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  View
                </Button>
                {!shipment.isReplied && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-primary border-primary hover:bg-primary/10"
                    onClick={() => onReply(shipment.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          
          {shipments.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                No shipments found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
