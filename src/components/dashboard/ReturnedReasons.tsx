import React from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

export const ReturnedReasons = () => {
  return (
    <Card title="Returned Reasons By Couriers" action={<ChevronDown size={16} className="text-gray-400" />}>
      <div className="text-sm text-gray-500 mb-4">LAST 30 DAYS</div>
      
      <div className="h-64 relative overflow-hidden">
        <div className="flex h-full">
          {/* This is a simplified representation of the heatmap */}
          <div className="flex-1">
            <div className="h-1/3 bg-blue-600" title="The customer refused to receive"></div>
            <div className="h-1/3 bg-blue-500" title="The customer is not answering"></div>
            <div className="h-1/3 bg-blue-400" title="The customer is not available"></div>
          </div>
          <div className="flex-1">
            <div className="h-1/2 bg-lime-400" title="The phone is busy"></div>
            <div className="h-1/2 bg-lime-500" title="The phone is unreachable"></div>
          </div>
          <div className="flex-1">
            <div className="h-2/3 bg-green-500" title="The phone is off"></div>
            <div className="h-1/3 bg-green-600" title="The address is incorrect"></div>
          </div>
          <div className="flex-1">
            <div className="h-full bg-teal-500" title="The customer requested"></div>
          </div>
          <div className="flex-1">
            <div className="h-1/3 bg-fuchsia-500" title="The customer is not present"></div>
            <div className="h-2/3 bg-fuchsia-400" title="Customer changed mind"></div>
          </div>
          <div className="flex-1">
            <div className="h-1/2 bg-rose-400" title="The phone number is wrong"></div>
            <div className="h-1/2 bg-rose-500" title="The package was damaged"></div>
          </div>
        </div>
        
        {/* Overlay text - in a real implementation, this would be dynamically positioned */}
        <div className="absolute top-1/4 left-1/3 text-white text-xs">
          The phone is busy
        </div>
        <div className="absolute top-1/2 left-3/4 text-white text-xs">
          The customer is not present
        </div>
      </div>
    </Card>
  );
};

export default ReturnedReasons;
