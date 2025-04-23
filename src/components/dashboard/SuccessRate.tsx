
import React from 'react';
import { Card } from '@/components/ui/Card';
import { ChevronDown } from 'lucide-react';

export const SuccessRate = () => {
  return (
    <Card title="Success Rate" action={<ChevronDown size={16} className="text-gray-400" />} className="h-full">
      <div className="flex flex-col items-center justify-center h-64">
        <div className="relative h-40 w-40">
          <svg className="h-full w-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#e6e6e6" strokeWidth="4"></circle>
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeDasharray="88 12"
              strokeDashoffset="0"
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
            ></circle>
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-4xl font-bold">88%</p>
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-4">LAST 30 DAYS</div>
      </div>
    </Card>
  );
};

export default SuccessRate;
