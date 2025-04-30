import React from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Card } from '@/components/ui/card';

const Orders = () => {
  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <div className="flex gap-4">
          {/* Order actions would go here */}
        </div>
      </div>
      
      <Card className="p-6">
        <div className="min-h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Orders content goes here</p>
        </div>
      </Card>
    </PageLayout>
  );
};

export default Orders;
