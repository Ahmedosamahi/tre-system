
import React from 'react';
import { Card } from '@/components/ui/Card';
import { CityData } from '@/types';
import { ChevronDown } from 'lucide-react';

const cityData: CityData[] = [
  { name: 'Cairo', value: 40 },
  { name: 'Giza', value: 30 },
  { name: 'Alex', value: 20 },
  { name: 'Mansoura', value: 12 },
  { name: 'Tanta', value: 11 }
];

export const TopCities = () => {
  const maxValue = Math.max(...cityData.map(city => city.value));
  
  return (
    <Card title="Top 5 Cities" action={<ChevronDown size={16} className="text-gray-400" />} className="h-full">
      <div className="text-sm text-gray-500 mb-4">LAST 30 DAYS</div>
      
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
