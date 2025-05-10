
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import PeriodDropdown, { defaultPeriods } from './PeriodDropdown';

interface ReturnTimeItem {
  range: string;
  count: number;
  percentage: number;
  color: string;
}

const returnTimeByPeriod: Record<string, ReturnTimeItem[]> = {
  '30d': [
    { range: '1 Day', count: 75, percentage: 45, color: '#10B981' },
    { range: '2 Days', count: 50, percentage: 30, color: '#3B82F6' },
    { range: '3 Days', count: 30, percentage: 18, color: '#F59E0B' },
    { range: '4+ Days', count: 12, percentage: 7, color: '#EF4444' }
  ],
  'week': [
    { range: '1 Day', count: 20, percentage: 48, color: '#10B981' },
    { range: '2 Days', count: 12, percentage: 29, color: '#3B82F6' },
    { range: '3 Days', count: 7, percentage: 17, color: '#F59E0B' },
    { range: '4+ Days', count: 3, percentage: 6, color: '#EF4444' }
  ],
  'day': [
    { range: '1 Day', count: 3, percentage: 50, color: '#10B981' },
    { range: '2 Days', count: 2, percentage: 33, color: '#3B82F6' },
    { range: '3 Days', count: 1, percentage: 17, color: '#F59E0B' },
    { range: '4+ Days', count: 0, percentage: 0, color: '#EF4444' }
  ],
  'year': [
    { range: '1 Day', count: 850, percentage: 42, color: '#10B981' },
    { range: '2 Days', count: 650, percentage: 32, color: '#3B82F6' },
    { range: '3 Days', count: 360, percentage: 18, color: '#F59E0B' },
    { range: '4+ Days', count: 160, percentage: 8, color: '#EF4444' }
  ],
  '3m': [
    { range: '1 Day', count: 280, percentage: 44, color: '#10B981' },
    { range: '2 Days', count: 190, percentage: 30, color: '#3B82F6' },
    { range: '3 Days', count: 120, percentage: 19, color: '#F59E0B' },
    { range: '4+ Days', count: 45, percentage: 7, color: '#EF4444' }
  ]
};

export const ReturnTimeCard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const returnTimeData = returnTimeByPeriod[selectedPeriod];
  
  return (
    <Card 
      cardTitle="Return Time"
      action={
        <PeriodDropdown
          periods={defaultPeriods}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      }
    >
      <div className="space-y-4 my-2">
        {returnTimeData.map((item) => (
          <div key={item.range} className="space-y-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{item.range}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500">{item.count} shipments</span>
                <span className="text-xs font-semibold">{item.percentage}%</span>
              </div>
            </div>
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
