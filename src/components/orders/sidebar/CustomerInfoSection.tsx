
import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Order } from '@/types/Order';

interface CustomerInfoSectionProps {
  order: Order;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({
  order,
  onUpdateOrder
}) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress
  });

  const handleEdit = (field: string) => {
    setIsEditing(field);
  };

  const handleSave = (field: string) => {
    const updatedOrder = {
      ...order,
      [field]: editValues[field as keyof typeof editValues]
    };
    onUpdateOrder(updatedOrder);
    setIsEditing(null);
  };

  const handleCancel = () => {
    setEditValues({
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress
    });
    setIsEditing(null);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Customer Information</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-600">Name</label>
            {isEditing === 'customerName' ? (
              <div className="flex gap-2 mt-1">
                <Input
                  value={editValues.customerName}
                  onChange={(e) => setEditValues({ ...editValues, customerName: e.target.value })}
                  className="h-8"
                />
                <Button size="sm" onClick={() => handleSave('customerName')}>Save</Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
              </div>
            ) : (
              <p className="text-sm">{order.customerName}</p>
            )}
          </div>
          {isEditing !== 'customerName' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleEdit('customerName')}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-600">Phone</label>
            {isEditing === 'customerPhone' ? (
              <div className="flex gap-2 mt-1">
                <Input
                  value={editValues.customerPhone}
                  onChange={(e) => setEditValues({ ...editValues, customerPhone: e.target.value })}
                  className="h-8"
                />
                <Button size="sm" onClick={() => handleSave('customerPhone')}>Save</Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
              </div>
            ) : (
              <p className="text-sm">{order.customerPhone}</p>
            )}
          </div>
          {isEditing !== 'customerPhone' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleEdit('customerPhone')}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-600">Address</label>
            {isEditing === 'customerAddress' ? (
              <div className="flex gap-2 mt-1">
                <Input
                  value={editValues.customerAddress}
                  onChange={(e) => setEditValues({ ...editValues, customerAddress: e.target.value })}
                  className="h-8"
                />
                <Button size="sm" onClick={() => handleSave('customerAddress')}>Save</Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
              </div>
            ) : (
              <p className="text-sm">{order.customerAddress}</p>
            )}
          </div>
          {isEditing !== 'customerAddress' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 mt-1"
              onClick={() => handleEdit('customerAddress')}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
