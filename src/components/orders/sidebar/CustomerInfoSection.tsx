
import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types/Order';

interface CustomerInfoSectionProps {
  order: Order;
  onOrderUpdate: (updatedOrder: Order) => void;
}

export const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({
  order,
  onOrderUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress,
  });

  const handleSave = () => {
    const updatedOrder = { ...order, ...editData };
    onOrderUpdate(updatedOrder);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Customer Information</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <Input
                value={editData.customerName}
                onChange={(e) => setEditData({ ...editData, customerName: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <Input
                value={editData.customerPhone}
                onChange={(e) => setEditData({ ...editData, customerPhone: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Address</label>
              <Input
                value={editData.customerAddress}
                onChange={(e) => setEditData({ ...editData, customerAddress: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>Save</Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-sm mt-1">{order.customerName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-sm mt-1">{order.customerPhone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Address</label>
              <p className="text-sm mt-1">{order.customerAddress}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
