
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { FinancialMetric } from '@/types';
import { Box, TruckIcon, XCircle } from 'lucide-react';
import PeriodDropdown, { defaultPeriods } from './PeriodDropdown';

// Add data for different periods
const financialMetricsByPeriod: Record<string, FinancialMetric[]> = {
  '30d': [
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
  ],
  'week': [
    {
      title: 'Delivered',
      amount: '$12,000',
      change: '+70%',
      type: 'positive',
      icon: <Box className="h-6 w-6 text-green-600" />
    },
    {
      title: 'In Progress',
      amount: '$4,000',
      change: '+23%',
      type: 'positive',
      icon: <TruckIcon className="h-6 w-6 text-blue-600" />
    },
    {
      title: 'Rejected',
      amount: '$1,200',
      change: '+7%',
      type: 'negative',
      icon: <XCircle className="h-6 w-6 text-red-600" />
    }
  ],
  'day': [
    {
      title: 'Delivered',
      amount: '$2,000',
      change: '+75%',
      type: 'positive',
      icon: <Box className="h-6 w-6 text-green-600" />
    },
    {
      title: 'In Progress',
      amount: '$500',
      change: '+19%',
      type: 'positive',
      icon: <TruckIcon className="h-6 w-6 text-blue-600" />
    },
    {
      title: 'Rejected',
      amount: '$150',
      change: '+6%',
      type: 'negative',
      icon: <XCircle className="h-6 w-6 text-red-600" />
    }
  ],
  'year': [
    {
      title: 'Delivered',
      amount: '$480,000',
      change: '+81%',
      type: 'positive',
      icon: <Box className="h-6 w-6 text-green-600" />
    },
    {
      title: 'In Progress',
      amount: '$86,000',
      change: '+15%',
      type: 'positive',
      icon: <TruckIcon className="h-6 w-6 text-blue-600" />
    },
    {
      title: 'Rejected',
      amount: '$24,000',
      change: '+4%',
      type: 'negative',
      icon: <XCircle className="h-6 w-6 text-red-600" />
    }
  ],
  '3m': [
    {
      title: 'Delivered',
      amount: '$120,000',
      change: '+78%',
      type: 'positive',
      icon: <Box className="h-6 w-6 text-green-600" />
    },
    {
      title: 'In Progress',
      amount: '$25,000',
      change: '+16%',
      type: 'positive',
      icon: <TruckIcon className="h-6 w-6 text-blue-600" />
    },
    {
      title: 'Rejected',
      amount: '$9,000',
      change: '+6%',
      type: 'negative',
      icon: <XCircle className="h-6 w-6 text-red-600" />
    }
  ]
};

export const CODShipments = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const financialMetrics = financialMetricsByPeriod[selectedPeriod];
  
  return (
    <Card cardTitle="COD Shipments" action={
      <PeriodDropdown
        periods={defaultPeriods}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />
    } className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-500">{defaultPeriods.find(p => p.key === selectedPeriod)?.label.toUpperCase()}</div>
      </div>
      
      <div className="space-y-4">
        {financialMetrics.map((metric, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg flex justify-between items-center transition-all duration-200 ${
              metric.title === 'Delivered' ? 'bg-green-50 hover:bg-green-100' : 
              metric.title === 'In Progress' ? 'bg-blue-50 hover:bg-blue-100' : 
              'bg-red-50 hover:bg-red-100'
            } shadow-sm`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                metric.title === 'Delivered' ? 'bg-green-100' : 
                metric.title === 'In Progress' ? 'bg-blue-100' : 
                'bg-red-100'
              }`}>
                {metric.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{metric.title}</p>
                <p className="text-lg font-bold">{metric.amount}</p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-sm font-medium ${
              metric.type === 'positive' ? 'bg-green-100 text-green-800' : 
              'bg-red-100 text-red-800'
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
