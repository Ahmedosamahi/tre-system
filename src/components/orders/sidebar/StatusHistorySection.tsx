
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types/Order';

interface StatusHistorySectionProps {
  order: Order;
}

export const StatusHistorySection: React.FC<StatusHistorySectionProps> = ({
  order,
}) => {
  const mockHistory = [
    {
      timestamp: '2025-05-07 11:34 AM',
      status: 'Created',
      user: 'Ahmed Mohamed',
    },
    {
      timestamp: '2025-05-07 11:45 AM',
      status: 'Confirmed',
      user: 'Sara Ali',
    },
    {
      timestamp: '2025-05-07 02:15 PM',
      status: 'Dispatched',
      user: 'Mohamed Hassan',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Status History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockHistory.map((entry, index) => (
            <div key={index} className="border-l-2 border-gray-200 pl-4 pb-3 last:pb-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full -ml-6 bg-white border-2 border-blue-500"></div>
                <span className="text-sm font-medium">{entry.status}</span>
                <span className="text-xs text-gray-500">{entry.timestamp}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Changed by {entry.user}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
