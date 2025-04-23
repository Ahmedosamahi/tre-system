
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

const cityDataSets = {
  '30d': [
    { name: 'Cairo', value: 40 },
    { name: 'Giza', value: 30 },
    { name: 'Alex', value: 20 },
    { name: 'Mansoura', value: 12 },
    { name: 'Tanta', value: 11 }
  ],
  'week': [
    { name: 'Cairo', value: 22 },
    { name: 'Giza', value: 18 },
    { name: 'Alex', value: 12 },
    { name: 'Mansoura', value: 9 },
    { name: 'Tanta', value: 8 }
  ],
  'day': [
    { name: 'Cairo', value: 5 },
    { name: 'Giza', value: 4 },
    { name: 'Alex', value: 2 },
    { name: 'Mansoura', value: 2 },
    { name: 'Tanta', value: 3 }
  ],
  'year': [
    { name: 'Cairo', value: 300 },
    { name: 'Giza', value: 230 },
    { name: 'Alex', value: 200 },
    { name: 'Mansoura', value: 120 },
    { name: 'Tanta', value: 110 }
  ],
  '3m': [
    { name: 'Cairo', value: 120 },
    { name: 'Giza', value: 90 },
    { name: 'Alex', value: 82 },
    { name: 'Mansoura', value: 55 },
    { name: 'Tanta', value: 43 }
  ]
};

const periods = [
  { key: '30d', label: 'LAST 30 DAYS' },
  { key: 'week', label: 'Last Week' },
  { key: 'day', label: 'Day' },
  { key: 'year', label: 'Year' },
  { key: '3m', label: '3 Months' }
];

export const TopCities = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0].key);
  const cityData = cityDataSets[selectedPeriod];
  const maxValue = Math.max(...cityData.map(city => city.value));
  
  return (
    <Card 
      cardTitle="Top 5 Cities" 
      action={
        <div className="relative">
          <select
            className="text-xs bg-transparent text-gray-500 pr-5 pl-1 focus:outline-none appearance-none"
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
          >
            {periods.map(period => (
              <option key={period.key} value={period.key}>{period.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      }
      className="h-full"
    >
      <div className="h-64 flex items-end justify-between space-x-6">
        {cityData.map((city) => (
          <div key={city.name} className="flex flex-col items-center">
            <div 
              className="w-12 bg-blue-500 rounded-sm" 
              style={{ height: `${(city.value / maxValue) * 150}px` }}
            ></div>
            <div className="text-xs font-medium mt-2">{city.name}</div>
            <div className="text-xs text-gray-500">{city.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopCities;
