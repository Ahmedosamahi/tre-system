import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

const periods = [
  { key: '30d', label: 'LAST 30 DAYS' },
  { key: 'week', label: 'Last Week' },
  { key: 'day', label: 'Day' },
  { key: 'year', label: 'Year' },
  { key: '3m', label: '3 Months' }
];

// Example data: replace with API or dynamic data as needed
const shippingCompaniesData: Record<
  string,
  { name: string; percent: number }[]
> = {
  '30d': [
    { name: 'DHL', percent: 95 },
    { name: 'FedEx', percent: 92 },
    { name: 'UPS', percent: 91 },
    { name: 'Aramex', percent: 89 }
  ],
  'week': [
    { name: 'DHL', percent: 94 },
    { name: 'FedEx', percent: 92 },
    { name: 'UPS', percent: 89 },
    { name: 'Aramex', percent: 88 }
  ],
  'day': [
    { name: 'DHL', percent: 98 },
    { name: 'FedEx', percent: 94 },
    { name: 'UPS', percent: 92 },
    { name: 'Aramex', percent: 91 }
  ],
  'year': [
    { name: 'DHL', percent: 93 },
    { name: 'FedEx', percent: 90 },
    { name: 'UPS', percent: 87 },
    { name: 'Aramex', percent: 86 }
  ],
  '3m': [
    { name: 'DHL', percent: 94 },
    { name: 'FedEx', percent: 92 },
    { name: 'UPS', percent: 89 },
    { name: 'Aramex', percent: 88 }
  ]
};

const ShippingCompanySuccess: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0].key);
  const companies = shippingCompaniesData[selectedPeriod];

  return (
    <Card 
      cardTitle={
        <div>
          <div className="text-lg font-medium">Success Rate Comparison</div>
          <div className="text-xs text-gray-400 font-normal leading-tight mt-1">
            Shipping Companies Performance
          </div>
        </div>
      }
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
      <div className="space-y-3 py-4">
        {companies.map(company => (
          <div key={company.name} className="flex items-center justify-between py-2">
            <span className="font-medium">{company.name}</span>
            <div className="flex items-center gap-3">
              <div className="relative h-2 w-32 rounded bg-gray-200">
                <div
                  className="absolute left-0 top-0 h-2 rounded bg-blue-500"
                  style={{ width: `${company.percent}%` }}
                />
              </div>
              <span className="font-mono text-sm text-gray-700">{company.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ShippingCompanySuccess;
