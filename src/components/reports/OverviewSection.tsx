
import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Package, CheckCircle, XCircle, Clock } from 'lucide-react';

const kpiData = [
  {
    title: 'Total Orders',
    value: '12,847',
    change: '+12.5%',
    trend: 'up',
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Successful Orders',
    value: '10,423',
    change: '+8.2%',
    trend: 'up',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Unsuccessful Orders',
    value: '1,892',
    change: '-3.1%',
    trend: 'down',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    title: 'Processing Orders',
    value: '532',
    change: '+5.7%',
    trend: 'up',
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
];

export const OverviewSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Overview Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">{kpi.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{kpi.value}</p>
                <div className="flex items-center">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
