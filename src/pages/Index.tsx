import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { NotificationBanner } from '@/components/dashboard/NotificationBanner';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { SuccessRate } from '@/components/dashboard/SuccessRate';
import { CourierDistribution } from '@/components/dashboard/CourierDistribution';
import { TopCities } from '@/components/dashboard/TopCities';
import { CODShipments } from '@/components/dashboard/CODShipments';
import { ReturnedReasons } from '@/components/dashboard/ReturnedReasons';
import { Card } from '@/components/ui/Card';

const Index = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <Header />
        
        <main className="px-6 py-6">
          <NotificationBanner />
          
          <div className="mb-4">
            <h2 className="section-heading">Overview of Shipments</h2>
          </div>
          
          <MetricsCards />
          
          <div className="mb-6">
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
                    src="https://images.unsplash.com/photo-1580674285058-2aab098a78bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
                    alt="Delivery Person"
                    className="h-40 object-contain"
                  />
                </div>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <SuccessRate />
            <div>
              <h2 className="section-heading">Shipping Company Success</h2>
              <ShippingCompanySuccess />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <CourierDistribution />
            <TopCities />
          </div>
          
          <div className="mb-4">
            <h2 className="section-heading">Overview of Finance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <CODShipments />
            <ReturnedReasons />
          </div>
        </main>
      </div>
    </div>
  );
};

import ShippingCompanySuccess from '@/components/dashboard/ShippingCompanySuccess';
export default Index;
