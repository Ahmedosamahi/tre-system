
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import PeriodDropdown, { defaultPeriods } from './PeriodDropdown';
import { Progress } from '@/components/ui/progress';

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
    <Card cardTitle="Returned Reasons By Couriers" action={
      <PeriodDropdown
        periods={defaultPeriods}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />
    }>
      <div className="space-y-5 my-4">
        {reasonData.map(({ reason, percentage, color }) => (
          <div key={reason}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-[15px]">{reason}</span>
              <span className="font-mono text-[15px]">{percentage}%</span>
            </div>
            <Progress 
              value={percentage}
              className="h-2.5 bg-gray-100"
              style={{
                backgroundColor: '#ececff'
              }}
            >
              {/* color override for progress */}
            </Progress>
            <style>{`
              [data-reason="${reason.replace(/\s/g, '-')}-bar"] .bg-primary {
                background-color: ${color} !important;
              }
            `}</style>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ReturnedReasons;
