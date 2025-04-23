
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import PeriodDropdown, { defaultPeriods } from './PeriodDropdown';

type ReasonType = {
  reason: string;
  percentage: number;
  color: string;
};

const reasonDataByPeriod: Record<string, ReasonType[]> = {
  '30d': [
    { reason: 'Customer Refused', percentage: 30, color: 'bg-blue-600' },
    { reason: 'Not Answering', percentage: 25, color: 'bg-indigo-500' },
    { reason: 'Customer Unavailable', percentage: 15, color: 'bg-purple-500' },
    { reason: 'Wrong Address', percentage: 12, color: 'bg-pink-500' },
    { reason: 'Package Damaged', percentage: 10, color: 'bg-red-500' },
    { reason: 'Changed Mind', percentage: 8, color: 'bg-orange-500' }
  ],
  'week': [
    { reason: 'Customer Refused', percentage: 32, color: 'bg-blue-600' },
    { reason: 'Not Answering', percentage: 22, color: 'bg-indigo-500' },
    { reason: 'Customer Unavailable', percentage: 18, color: 'bg-purple-500' },
    { reason: 'Wrong Address', percentage: 14, color: 'bg-pink-500' },
    { reason: 'Package Damaged', percentage: 8, color: 'bg-red-500' },
    { reason: 'Changed Mind', percentage: 6, color: 'bg-orange-500' }
  ],
  'day': [
    { reason: 'Customer Refused', percentage: 35, color: 'bg-blue-600' },
    { reason: 'Not Answering', percentage: 20, color: 'bg-indigo-500' },
    { reason: 'Customer Unavailable', percentage: 15, color: 'bg-purple-500' },
    { reason: 'Wrong Address', percentage: 15, color: 'bg-pink-500' },
    { reason: 'Package Damaged', percentage: 5, color: 'bg-red-500' },
    { reason: 'Changed Mind', percentage: 10, color: 'bg-orange-500' }
  ],
  'year': [
    { reason: 'Customer Refused', percentage: 28, color: 'bg-blue-600' },
    { reason: 'Not Answering', percentage: 26, color: 'bg-indigo-500' },
    { reason: 'Customer Unavailable', percentage: 14, color: 'bg-purple-500' },
    { reason: 'Wrong Address', percentage: 12, color: 'bg-pink-500' },
    { reason: 'Package Damaged', percentage: 11, color: 'bg-red-500' },
    { reason: 'Changed Mind', percentage: 9, color: 'bg-orange-500' }
  ],
  '3m': [
    { reason: 'Customer Refused', percentage: 29, color: 'bg-blue-600' },
    { reason: 'Not Answering', percentage: 24, color: 'bg-indigo-500' },
    { reason: 'Customer Unavailable', percentage: 16, color: 'bg-purple-500' },
    { reason: 'Wrong Address', percentage: 13, color: 'bg-pink-500' },
    { reason: 'Package Damaged', percentage: 10, color: 'bg-red-500' },
    { reason: 'Changed Mind', percentage: 8, color: 'bg-orange-500' }
  ]
};

export const ReturnedReasons = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const reasonData = reasonDataByPeriod[selectedPeriod];
  
  return (
    <Card cardTitle="Returned Reasons By Couriers" action={
      <PeriodDropdown
        periods={defaultPeriods}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />
    }>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-500">{defaultPeriods.find(p => p.key === selectedPeriod)?.label.toUpperCase()}</div>
      </div>
      
      <div className="space-y-4">
        {reasonData.map((reason) => (
          <div key={reason.reason} className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">{reason.reason}</span>
              <span className="text-xs font-medium">{reason.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`${reason.color} h-2.5 rounded-full`} 
                style={{ width: `${reason.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-2">
        {reasonData.map((reason) => (
          <div key={reason.reason} className="flex items-center">
            <div className={`w-3 h-3 ${reason.color} rounded-full mr-2`}></div>
            <span className="text-xs text-gray-600 truncate">{reason.reason}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ReturnedReasons;
