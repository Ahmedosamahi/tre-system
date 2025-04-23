
import React from 'react';
import { Card } from '@/components/ui/Card';
import { CourierData } from '@/types';
import { ChevronDown } from 'lucide-react';

const courierData: CourierData[] = [
  { name: 'FedEx', delivered: 50, returned: 35 },
  { name: 'Aramex', delivered: 40, returned: 26 },
  { name: 'Bosta', delivered: 45, returned: 22 },
  { name: 'DHL', delivered: 55, returned: 27 },
  { name: 'PDC', delivered: 30, returned: 15 }
];

export const CourierDistribution = () => {
  return (
    <Card title="Distribution of Couriers" action={<ChevronDown size={16} className="text-gray-400" />} className="h-full">
      <div className="text-sm text-gray-500 mb-4">LAST 30 DAYS</div>
      
      <div className="h-64 flex items-end justify-between space-x-8">
        {courierData.map((courier) => (
          <div key={courier.name} className="flex flex-col items-center space-y-2">
            <div className="flex flex-col items-center space-y-2">
              <div 
                className="w-10 bg-blue-500 rounded-sm" 
                style={{ height: `${courier.delivered * 2}px` }}
              ></div>
              <div 
                className="w-10 bg-cyan-400 rounded-sm" 
                style={{ height: `${courier.returned * 2}px` }}
              ></div>
            </div>
            <div className="text-xs font-medium mt-2">{courier.name}</div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-center mt-4 space-x-4">
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
