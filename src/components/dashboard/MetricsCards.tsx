
import React from 'react';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Chart } from 'primereact/chart';
import { PiTruck, PiPackage, PiReturnDownBack, PiWarningCircle, PiArrowDownBold, PiArrowUpBold } from 'react-icons/pi';

const metrics = [
  {
    title: 'Action Needed',
    value: 10,
    subtitle: 'Orders',
    color: '#f59e42',
    icon: <PiWarningCircle size={28} color="#f59e42" />,
    trend: { value: -10, up: false }
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
    title: 'Delivered',
    value: 548,
    subtitle: 'Orders',
    color: '#22c55e',
    icon: <PiPackage size={28} color="#22c55e" />,
    trend: { value: 15, up: true }
  },
  {
    title: 'Picked Up Orders',
    value: 36,
    subtitle: 'Orders',
    color: '#eab308',
    icon: <PiTruck size={28} color="#eab308" />,
    trend: { value: 4, up: true }
  },
  {
    title: 'Returned To You',
    value: 26,
    subtitle: 'Orders',
    color: '#ef4444',
    icon: <PiReturnDownBack size={28} color="#ef4444" />,
    trend: { value: -2, up: false }
  }
];

export const MetricsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-6">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          title={null}
          className="shadow border-0" 
          style={{ borderRadius: 14, minHeight: 115, padding: 0 }}
          content={
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
                  {metric.trend.up ? <PiArrowUpBold size={14} /> : <PiArrowDownBold size={14} />}
                  {metric.trend.value}%
                </span>
              </div>
            </div>
          }
        />
      ))}
    </div>
  );
};

export default MetricsCards;
