
import React from 'react';
import { NotificationBanner } from '@/components/dashboard/NotificationBanner';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { SuccessRate } from '@/components/dashboard/SuccessRate';
import { CourierDistribution } from '@/components/dashboard/CourierDistribution';
import { TopCities } from '@/components/dashboard/TopCities';
import { CODShipments } from '@/components/dashboard/CODShipments';
import { ReturnedReasons } from '@/components/dashboard/ReturnedReasons';
import { Card } from '@/components/ui/card';
import ShippingCompanySuccess from '@/components/dashboard/ShippingCompanySuccess';
import { PageLayout } from '@/components/PageLayout';

const Index = () => {
  return (
    <PageLayout>
      <NotificationBanner />
      
      <div className="mb-4">
        <h2 className="section-heading">Overview of Shipments</h2>
      </div>
      
      <MetricsCards />
      
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none overflow-hidden relative">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-3/4 p-6">
              <h2 className="text-xl font-bold uppercase mb-1">Same-Day Delivery</h2>
              <p className="mb-4 text-blue-100">Get your orders delivered within hours, guaranteed shipping speed</p>
              
              <div className="flex space-x-4 mt-4">
                <button className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium">
                  Enable Now
                </button>
                <button className="border border-white text-white px-4 py-2 rounded-md font-medium">
                  Learn more
                </button>
              </div>
            </div>
            <div className="md:w-1/4 flex items-center justify-center py-4">
              <img 
                src="/lovable-uploads/9a486a82-ce61-4beb-8017-e0d55573ba2f.png"
                alt="Delivery Person"
                className="h-48 object-contain"
              />
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col">
          <div className="mb-4">
            <h2 className="section-heading">Success Rate Analysis</h2>
          </div>
          <SuccessRate />
        </div>
        <ShippingCompanySuccess />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <CourierDistribution />
        <TopCities />
      </div>
      
      <div className="mb-4">
        <h2 className="section-heading">Overview of Finance</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <CODShipments />
        <ReturnedReasons />
      </div>
    </PageLayout>
  );
};

export default Index;
