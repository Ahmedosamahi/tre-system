import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import PeriodDropdown, { defaultPeriods } from './PeriodDropdown';

const courierDataByPeriod = {
  '30d': [
    { name: 'FedEx', delivered: 50, returned: 35 },
    { name: 'Aramex', delivered: 40, returned: 26 },
    { name: 'Bosta', delivered: 45, returned: 22 },
    { name: 'DHL', delivered: 55, returned: 27 },
    { name: 'PDC', delivered: 30, returned: 15 }
  ],
  'week': [
    { name: 'FedEx', delivered: 30, returned: 20 },
    { name: 'Aramex', delivered: 25, returned: 15 },
    { name: 'Bosta', delivered: 28, returned: 12 },
    { name: 'DHL', delivered: 35, returned: 17 },
    { name: 'PDC', delivered: 20, returned: 8 }
  ],
  'day': [
    { name: 'FedEx', delivered: 8, returned: 4 },
    { name: 'Aramex', delivered: 6, returned: 2 },
    { name: 'Bosta', delivered: 7, returned: 3 },
    { name: 'DHL', delivered: 10, returned: 5 },
    { name: 'PDC', delivered: 5, returned: 2 }
  ],
  'year': [
    { name: 'FedEx', delivered: 220, returned: 140 },
    { name: 'Aramex', delivered: 180, returned: 95 },
    { name: 'Bosta', delivered: 200, returned: 110 },
    { name: 'DHL', delivered: 240, returned: 120 },
    { name: 'PDC', delivered: 150, returned: 70 }
  ],
  '3m': [
    { name: 'FedEx', delivered: 140, returned: 90 },
    { name: 'Aramex', delivered: 120, returned: 65 },
    { name: 'Bosta', delivered: 130, returned: 60 },
    { name: 'DHL', delivered: 150, returned: 75 },
    { name: 'PDC', delivered: 100, returned: 45 }
  ]
};

export const CourierDistribution = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const courierData = courierDataByPeriod[selectedPeriod];

  return (
    <Card cardTitle="Distribution of Couriers" action={
      <PeriodDropdown 
        periods={defaultPeriods}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />
    } className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-500">{defaultPeriods.find(p => p.key === selectedPeriod)?.label.toUpperCase()}</div>
      </div>
      
      <div className="h-64 flex items-end justify-between space-x-8">
        {courierData.map((courier) => (
          <div key={courier.name} className="flex flex-col items-center space-y-2 relative group">
            <div className="flex flex-col items-center space-y-2">
              <div 
                className="w-10 bg-blue-500 rounded-t-md transition-all duration-200 group-hover:bg-blue-600" 
                style={{ height: `${courier.delivered * 2}px` }}
              >
                <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {courier.delivered}
                </div>
              </div>
              <div 
                className="w-10 bg-cyan-400 rounded-b-md transition-all duration-200 group-hover:bg-cyan-500" 
                style={{ height: `${courier.returned * 2}px` }}
              >
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {courier.returned}
                </div>
              </div>
            </div>
            <div className="text-xs font-medium mt-2">{courier.name}</div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-center mt-6 space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-xs text-gray-600">Delivered</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-cyan-400 rounded-full mr-2"></div>
          <span className="text-xs text-gray-600">Returned</span>
        </div>
      </div>
    </Card>
  );
};

export default CourierDistribution;
