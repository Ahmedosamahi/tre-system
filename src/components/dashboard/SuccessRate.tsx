
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import PeriodDropdown, { defaultPeriods } from './PeriodDropdown';

const dataByPeriod: Record<string, { percent: number }> = {
  '30d': { percent: 88 },
  'week': { percent: 90 },
  'day': { percent: 87 },
  'year': { percent: 85 },
  '3m': { percent: 89 }
};

export const SuccessRate = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  return (
    <Card cardTitle="Success Rate" action={
      <PeriodDropdown
        periods={defaultPeriods}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />
    } className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-500">{defaultPeriods.find(p => p.key === selectedPeriod)?.label.toUpperCase()}</div>
      </div>
      
      <div className="flex flex-col items-center justify-center h-64">
        <div className="relative h-40 w-40">
          <svg className="h-full w-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#e6e6e6" strokeWidth="4"></circle>
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeDasharray={`${dataByPeriod[selectedPeriod].percent} ${100 - dataByPeriod[selectedPeriod].percent}`}
              strokeDashoffset="0"
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
            ></circle>
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-4xl font-bold">{dataByPeriod[selectedPeriod].percent}%</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SuccessRate;
