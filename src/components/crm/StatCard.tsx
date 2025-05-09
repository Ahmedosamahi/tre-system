
import React from 'react';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon,
  bgColor = 'bg-gray-50'
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-semibold mt-1">{value}</p>
        </div>
        <div className={`p-3.5 rounded-full ${bgColor}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};
