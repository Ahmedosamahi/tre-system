
import React from 'react';
import { Card } from '@/components/ui/Card';
import { MetricCardProps } from '@/types';

const metrics: MetricCardProps[] = [
  {
    title: 'Action Needed',
    value: 10,
    subtitle: 'Orders',
    icon: (
      <div className="p-2 rounded-lg bg-amber-100">
        <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    ),
    trend: (
      <svg className="w-12 h-6" viewBox="0 0 100 25" preserveAspectRatio="none">
        <path d="M0,25 L20,15 L40,20 L60,5 L80,15 L100,0" stroke="#f97316" strokeWidth="2" fill="none" />
      </svg>
    )
  },
  {
    title: 'Going To Customers',
    value: 35,
    subtitle: 'Orders',
    icon: (
      <div className="p-2 rounded-lg bg-blue-100">
        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      </div>
    ),
    trend: (
      <svg className="w-12 h-6" viewBox="0 0 100 25" preserveAspectRatio="none">
        <path d="M0,15 L20,10 L40,20 L60,5 L80,10 L100,0" stroke="#3b82f6" strokeWidth="2" fill="none" />
      </svg>
    )
  },
  {
    title: 'Delivered',
    value: 548,
    subtitle: 'Orders',
    icon: (
      <div className="p-2 rounded-lg bg-green-100">
        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    trend: (
      <svg className="w-12 h-6" viewBox="0 0 100 25" preserveAspectRatio="none">
        <path d="M0,20 L20,15 L40,18 L60,10 L80,5 L100,0" stroke="#22c55e" strokeWidth="2" fill="none" />
      </svg>
    )
  },
  {
    title: 'Picked Up Orders',
    value: 36,
    subtitle: 'Orders',
    icon: (
      <div className="p-2 rounded-lg bg-yellow-100">
        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      </div>
    ),
    trend: (
      <svg className="w-12 h-6" viewBox="0 0 100 25" preserveAspectRatio="none">
        <path d="M0,15 L20,20 L40,10 L60,18 L80,5 L100,0" stroke="#eab308" strokeWidth="2" fill="none" />
      </svg>
    )
  },
  {
    title: 'Returned To You',
    value: 26,
    subtitle: 'Orders',
    icon: (
      <div className="p-2 rounded-lg bg-red-100">
        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
        </svg>
      </div>
    ),
    trend: (
      <svg className="w-12 h-6" viewBox="0 0 100 25" preserveAspectRatio="none">
        <path d="M0,10 L20,15 L40,5 L60,20 L80,10 L100,15" stroke="#ef4444" strokeWidth="2" fill="none" />
      </svg>
    )
  }
];

export const MetricsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="relative">
          <div className="flex items-start">
            {metric.icon}
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
              <div className="flex items-baseline mt-1">
                <p className="text-xl font-semibold">{metric.value}</p>
                <p className="ml-1 text-sm text-gray-500">{metric.subtitle}</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 h-7 w-16">
            {metric.trend}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MetricsCards;
