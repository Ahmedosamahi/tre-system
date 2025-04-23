
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import PeriodDropdown, { defaultPeriods } from './PeriodDropdown';

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

export const TopCities = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const cityData = cityDataSets[selectedPeriod];
  const maxValue = Math.max(...cityData.map(city => city.value));
  
  return (
    <Card 
      cardTitle="Top 5 Cities" 
      action={
        <PeriodDropdown
          periods={defaultPeriods}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      }
      className="h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-500">{defaultPeriods.find(p => p.key === selectedPeriod)?.label.toUpperCase()}</div>
      </div>
      
      <div className="h-64 flex items-end justify-between space-x-6">
        {cityData.map((city) => (
          <div key={city.name} className="flex flex-col items-center group relative">
            <div 
              className="w-12 bg-blue-500 hover:bg-blue-600 rounded-t-md transition-all duration-200" 
              style={{ height: `${(city.value / maxValue) * 150}px` }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {city.value}
              </div>
            </div>
            <div className="text-xs font-medium mt-2">{city.name}</div>
            <div className="text-xs text-gray-500">{city.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopCities;
