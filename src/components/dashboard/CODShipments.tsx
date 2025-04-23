import React from 'react';
import { Card } from '@/components/ui/card';
import { FinancialMetric } from '@/types';
import { ChevronDown, Box, TruckIcon, XCircle } from 'lucide-react';

const financialMetrics: FinancialMetric[] = [
  {
    title: 'Delivered',
    amount: '$40,000',
    change: '+80%',
    type: 'positive',
    icon: <Box className="h-6 w-6 text-green-600" />
  },
  {
    title: 'In Progress',
    amount: '$8,000',
    change: '+16%',
    type: 'positive',
    icon: <TruckIcon className="h-6 w-6 text-blue-600" />
  },
  {
    title: 'Rejected',
    amount: '$2,000',
    change: '+4%',
    type: 'negative',
    icon: <XCircle className="h-6 w-6 text-red-600" />
  }
];

export const CODShipments = () => {
  return (
    <Card title="COD Shipments" action={<ChevronDown size={16} className="text-gray-400" />} className="h-full">
      <div className="text-sm text-gray-500 mb-4">LAST 30 DAYS</div>
      
      <div className="space-y-4">
        {financialMetrics.map((metric, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg flex justify-between items-center ${
              index === 0 ? 'bg-green-50' : 
              index === 1 ? 'bg-blue-50' : 
              'bg-red-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              {metric.icon}
              <div>
                <p className="text-sm font-medium text-gray-700">{metric.title}</p>
                <p className="text-lg font-bold">{metric.amount}</p>
              </div>
            </div>
            <div className={`text-sm font-medium ${
              metric.type === 'positive' ? 'text-green-600' : 
              metric.type === 'negative' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {metric.change}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CODShipments;
