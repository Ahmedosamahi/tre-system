
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  PiTruck, 
  PiPackage, 
  PiArrowLeft, 
  PiWarningCircle, 
  PiArrowDown, 
  PiArrowUp 
} from 'react-icons/pi';
import { DateRangeFilter, DateFilterProps } from './DateRangeFilter';

// Reordered the metrics as requested
const initialMetrics = [
  {
    title: 'Picked Up Orders',
    value: 36,
    subtitle: 'Orders',
    color: '#eab308',
    icon: <PiTruck size={28} color="#eab308" />,
    trend: { value: 4, up: true }
  },
  {
    title: 'Going To Customers',
    value: 35,
    subtitle: 'Orders',
    color: '#2563eb',
    icon: <PiTruck size={28} color="#2563eb" />,
    trend: { value: 8, up: true }
  },
  {
    title: 'Action Needed',
    value: 10,
    subtitle: 'Orders',
    color: '#f59e42',
    icon: <PiWarningCircle size={28} color="#f59e42" />,
    trend: { value: -10, up: false }
  },
  {
    title: 'Delivered',
    value: 548,
    subtitle: 'Orders',
    color: '#22c55e',
    icon: <PiPackage size={28} color="#22c55e" />,
    trend: { value: 15, up: true }
  },
  {
    title: 'Returned To You',
    value: 26,
    subtitle: 'Orders',
    color: '#ef4444',
    icon: <PiArrowLeft size={28} color="#ef4444" />,
    trend: { value: -2, up: false }
  }
];

// Mock data for different time periods
const metricsData = {
  today: [
    { title: 'Picked Up Orders', value: 6, trend: { value: 20, up: true } },
    { title: 'Going To Customers', value: 8, trend: { value: 14, up: true } },
    { title: 'Action Needed', value: 2, trend: { value: -5, up: false } },
    { title: 'Delivered', value: 42, trend: { value: 8, up: true } },
    { title: 'Returned To You', value: 3, trend: { value: 0, up: true } }
  ],
  week: [
    { title: 'Picked Up Orders', value: 22, trend: { value: 10, up: true } },
    { title: 'Going To Customers', value: 18, trend: { value: 12, up: true } },
    { title: 'Action Needed', value: 5, trend: { value: -8, up: false } },
    { title: 'Delivered', value: 152, trend: { value: 18, up: true } },
    { title: 'Returned To You', value: 12, trend: { value: -5, up: false } }
  ],
  month: [
    { title: 'Picked Up Orders', value: 36, trend: { value: 4, up: true } },
    { title: 'Going To Customers', value: 35, trend: { value: 8, up: true } },
    { title: 'Action Needed', value: 10, trend: { value: -10, up: false } },
    { title: 'Delivered', value: 548, trend: { value: 15, up: true } },
    { title: 'Returned To You', value: 26, trend: { value: -2, up: false } }
  ],
  year: [
    { title: 'Picked Up Orders', value: 452, trend: { value: 12, up: true } },
    { title: 'Going To Customers', value: 410, trend: { value: 15, up: true } },
    { title: 'Action Needed', value: 89, trend: { value: -3, up: false } },
    { title: 'Delivered', value: 6820, trend: { value: 22, up: true } },
    { title: 'Returned To You', value: 324, trend: { value: 5, up: true } }
  ]
};

export const MetricsCards = () => {
  const [metrics, setMetrics] = useState(initialMetrics);

  const handleFilterChange: DateFilterProps['onFilterChange'] = (range, filterType) => {
    // In a real app, you would fetch data for the specific date range
    // For this example, we'll use mock data based on the quick filter type
    if (filterType === 'custom') {
      // For custom date ranges, we'd normally make an API call with the range
      // Here we'll just use the month data as a placeholder
      const updatedMetrics = initialMetrics.map((metric, index) => {
        // Generate random trend between -15 and +20
        const randomTrend = Math.floor(Math.random() * 35) - 15;
        return {
          ...metric,
          trend: { 
            value: randomTrend, 
            up: randomTrend >= 0 
          }
        };
      });
      setMetrics(updatedMetrics);
    } else {
      // Use our mock data for quick filters
      const dataKey = filterType === 'today' ? 'today' : 
                     filterType === 'week' ? 'week' : 
                     filterType === 'year' ? 'year' : 'month';
      
      const updatedMetrics = initialMetrics.map((metric, index) => {
        const matchingData = metricsData[dataKey].find(item => item.title === metric.title);
        if (matchingData) {
          return {
            ...metric,
            value: matchingData.value,
            trend: matchingData.trend
          };
        }
        return metric;
      });
      
      setMetrics(updatedMetrics);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end mb-2">
        <DateRangeFilter onFilterChange={handleFilterChange} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {metrics.map((metric, index) => (
          <Card
            key={index}
            className="shadow border-0" 
            style={{ borderRadius: 14, minHeight: 115, padding: 0 }}
          >
            <div className="p-4 flex flex-col gap-2 items-center justify-between" style={{ minHeight: 110 }}>
              <div className="flex items-center gap-3 w-full justify-between">
                <span className="rounded-full p-2" style={{ background: metric.color + '22' }}>{metric.icon}</span>
                <div className="flex items-end flex-col items-end">
                  <span className="text-2xl font-bold" style={{ color: metric.color }}>{metric.value}</span>
                  <span className="text-xs text-gray-400">{metric.subtitle}</span>
                </div>
              </div>
              <div className="w-full flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700">{metric.title}</span>
                <span
                  className={`flex items-center gap-0.5 text-xs ${
                    metric.trend.up ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.trend.up ? <PiArrowUp size={14} /> : <PiArrowDown size={14} />}
                  {metric.trend.value}%
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MetricsCards;
