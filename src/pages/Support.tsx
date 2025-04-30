
import React from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Card } from '@/components/ui/card';

const Support = () => {
  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
      </div>
      
      <Card className="p-6">
        <div className="min-h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Support content goes here</p>
        </div>
      </Card>
    </PageLayout>
  );
};

export default Support;
