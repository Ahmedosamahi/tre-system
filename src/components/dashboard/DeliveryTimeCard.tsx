
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import PeriodDropdown, { defaultPeriods } from './PeriodDropdown';

interface DeliveryTimeItem {
  range: string;
  count: number;
  percentage: number;
  color: string;
}

const deliveryTimeByPeriod: Record<string, DeliveryTimeItem[]> = {
  '30d': [
    { range: '1 Day', count: 250, percentage: 50, color: '#10B981' },
    { range: '2 Days', count: 150, percentage: 30, color: '#3B82F6' },
    { range: '3 Days', count: 75, percentage: 15, color: '#F59E0B' },
    { range: '4+ Days', count: 25, percentage: 5, color: '#EF4444' }
  ],
  'week': [
    { range: '1 Day', count: 85, percentage: 55, color: '#10B981' },
    { range: '2 Days', count: 45, percentage: 29, color: '#3B82F6' },
    { range: '3 Days', count: 18, percentage: 12, color: '#F59E0B' },
    { range: '4+ Days', count: 6, percentage: 4, color: '#EF4444' }
  ],
  'day': [
    { range: '1 Day', count: 12, percentage: 60, color: '#10B981' },
    { range: '2 Days', count: 5, percentage: 25, color: '#3B82F6' },
    { range: '3 Days', count: 2, percentage: 10, color: '#F59E0B' },
    { range: '4+ Days', count: 1, percentage: 5, color: '#EF4444' }
  ],
  'year': [
    { range: '1 Day', count: 3200, percentage: 48, color: '#10B981' },
    { range: '2 Days', count: 1950, percentage: 29, color: '#3B82F6' },
    { range: '3 Days', count: 1100, percentage: 16, color: '#F59E0B' },
    { range: '4+ Days', count: 450, percentage: 7, color: '#EF4444' }
  ],
  '3m': [
    { range: '1 Day', count: 850, percentage: 52, color: '#10B981' },
    { range: '2 Days', count: 450, percentage: 28, color: '#3B82F6' },
    { range: '3 Days', count: 250, percentage: 15, color: '#F59E0B' },
    { range: '4+ Days', count: 75, percentage: 5, color: '#EF4444' }
  ]
};

export const DeliveryTimeCard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const deliveryTimeData = deliveryTimeByPeriod[selectedPeriod];
  
  return (
    <Card 
      cardTitle="Delivery Time"
      action={
        <PeriodDropdown
          periods={defaultPeriods}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      }
    >
      <div className="space-y-4 my-2">
        {deliveryTimeData.map((item) => (
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
