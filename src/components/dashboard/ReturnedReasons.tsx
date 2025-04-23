
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import PeriodDropdown, { defaultPeriods } from './PeriodDropdown';

const reasonDataByPeriod: Record<string, { reason: string, percentage: number, color: string }[]> = {
  '30d': [
    { reason: 'Customer Refused', percentage: 30, color: '#6366f1' },
    { reason: 'Not Answering', percentage: 25, color: '#818cf8' },
    { reason: 'Customer Unavailable', percentage: 15, color: '#a21caf' },
    { reason: 'Wrong Address', percentage: 12, color: '#f472b6' },
    { reason: 'Package Damaged', percentage: 10, color: '#ef4444' },
    { reason: 'Changed Mind', percentage: 8, color: '#f97316' }
  ],
  'week': [
    { reason: 'Customer Refused', percentage: 32, color: '#6366f1' },
    { reason: 'Not Answering', percentage: 22, color: '#818cf8' },
    { reason: 'Customer Unavailable', percentage: 18, color: '#a21caf' },
    { reason: 'Wrong Address', percentage: 14, color: '#f472b6' },
    { reason: 'Package Damaged', percentage: 8, color: '#ef4444' },
    { reason: 'Changed Mind', percentage: 6, color: '#f97316' }
  ],
  'day': [
    { reason: 'Customer Refused', percentage: 35, color: '#6366f1' },
    { reason: 'Not Answering', percentage: 20, color: '#818cf8' },
    { reason: 'Customer Unavailable', percentage: 15, color: '#a21caf' },
    { reason: 'Wrong Address', percentage: 15, color: '#f472b6' },
    { reason: 'Package Damaged', percentage: 5, color: '#ef4444' },
    { reason: 'Changed Mind', percentage: 10, color: '#f97316' }
  ],
  'year': [
    { reason: 'Customer Refused', percentage: 28, color: '#6366f1' },
    { reason: 'Not Answering', percentage: 26, color: '#818cf8' },
    { reason: 'Customer Unavailable', percentage: 14, color: '#a21caf' },
    { reason: 'Wrong Address', percentage: 12, color: '#f472b6' },
    { reason: 'Package Damaged', percentage: 11, color: '#ef4444' },
    { reason: 'Changed Mind', percentage: 9, color: '#f97316' }
  ],
  '3m': [
    { reason: 'Customer Refused', percentage: 29, color: '#6366f1' },
    { reason: 'Not Answering', percentage: 24, color: '#818cf8' },
    { reason: 'Customer Unavailable', percentage: 16, color: '#a21caf' },
    { reason: 'Wrong Address', percentage: 13, color: '#f472b6' },
    { reason: 'Package Damaged', percentage: 10, color: '#ef4444' },
    { reason: 'Changed Mind', percentage: 8, color: '#f97316' }
  ]
};

export const ReturnedReasons = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const reasonData = reasonDataByPeriod[selectedPeriod];

  return (
    <div>
      <div className="font-bold text-2xl text-gray-900 mb-4">Returned Reasons By Couriers</div>
      <Card action={
        <PeriodDropdown
          periods={defaultPeriods}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      }>
        <div className="space-y-6 my-2">
          {reasonData.map(({ reason, percentage, color }) => (
            <div key={reason} className="flex items-center gap-4">
              {/* Reason with color tag */}
              <div className="min-w-[130px] flex items-center gap-2">
                <span
                  className="inline-block rounded-full w-2.5 h-2.5"
                  style={{ backgroundColor: color }}
                ></span>
                <span className="text-sm font-medium text-gray-800">{reason}</span>
              </div>
              
              {/* Bar background */}
              <div className="relative flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                ></div>
              </div>
              
              {/* Percentage */}
              <div className="ml-4 min-w-[52px] text-right font-mono text-sm font-semibold text-gray-600">
                {percentage}%
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ReturnedReasons;

