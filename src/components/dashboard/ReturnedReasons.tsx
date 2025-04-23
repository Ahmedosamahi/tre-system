
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import PeriodDropdown, { defaultPeriods } from './PeriodDropdown';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const reasonDataByPeriod: Record<string, { reason: string, percentage: number, color: string }[]> = {
  '30d': [
    { reason: 'Customer Refused', percentage: 30, color: '#6366f1' },
    { reason: 'Not Answering', percentage: 25, color: '#818cf8' },
    { reason: 'Customer Unavailable', percentage: 15, color: '#a21caf' },
    { reason: 'Wrong Address', percentage: 12, color: '#f472b6' },
    { reason: 'Package Damaged', percentage: 10, color: '#ef4444' },
    { reason: 'Changed Mind', percentage: 8, color: '#f97316' }
  ],
  'week': [
    { reason: 'Customer Refused', percentage: 32, color: '#6366f1' },
    { reason: 'Not Answering', percentage: 22, color: '#818cf8' },
    { reason: 'Customer Unavailable', percentage: 18, color: '#a21caf' },
    { reason: 'Wrong Address', percentage: 14, color: '#f472b6' },
    { reason: 'Package Damaged', percentage: 8, color: '#ef4444' },
    { reason: 'Changed Mind', percentage: 6, color: '#f97316' }
  ],
  'day': [
    { reason: 'Customer Refused', percentage: 35, color: '#6366f1' },
    { reason: 'Not Answering', percentage: 20, color: '#818cf8' },
    { reason: 'Customer Unavailable', percentage: 15, color: '#a21caf' },
    { reason: 'Wrong Address', percentage: 15, color: '#f472b6' },
    { reason: 'Package Damaged', percentage: 5, color: '#ef4444' },
    { reason: 'Changed Mind', percentage: 10, color: '#f97316' }
  ],
  'year': [
    { reason: 'Customer Refused', percentage: 28, color: '#6366f1' },
    { reason: 'Not Answering', percentage: 26, color: '#818cf8' },
    { reason: 'Customer Unavailable', percentage: 14, color: '#a21caf' },
    { reason: 'Wrong Address', percentage: 12, color: '#f472b6' },
    { reason: 'Package Damaged', percentage: 11, color: '#ef4444' },
    { reason: 'Changed Mind', percentage: 9, color: '#f97316' }
  ],
  '3m': [
    { reason: 'Customer Refused', percentage: 29, color: '#6366f1' },
    { reason: 'Not Answering', percentage: 24, color: '#818cf8' },
    { reason: 'Customer Unavailable', percentage: 16, color: '#a21caf' },
    { reason: 'Wrong Address', percentage: 13, color: '#f472b6' },
    { reason: 'Package Damaged', percentage: 10, color: '#ef4444' },
    { reason: 'Changed Mind', percentage: 8, color: '#f97316' }
  ]
};

export const ReturnedReasons = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const reasonData = reasonDataByPeriod[selectedPeriod];
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card cardTitle="Returned Reasons By Couriers" action={
      <PeriodDropdown
        periods={defaultPeriods}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />
    }>
      <div className="flex items-center justify-between">
        
      </div>
      <div className="flex flex-col items-center justify-center min-h-[250px] py-2">
        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie
              data={reasonData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              innerRadius={50}
              fill="#8884d8"
              dataKey="percentage"
              nameKey="reason"
            >
              {reasonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ReturnedReasons;
