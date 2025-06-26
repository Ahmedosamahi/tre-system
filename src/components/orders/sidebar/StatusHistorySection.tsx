
import React from 'react';
import { Clock } from 'lucide-react';
import { Order } from '@/types/Order';

interface StatusHistorySectionProps {
  order: Order;
}

export const StatusHistorySection: React.FC<StatusHistorySectionProps> = ({
  order
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Status History</h3>
      
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {order.statusHistory.map((entry) => (
          <div key={entry.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">{entry.fromStatus}</span>
                {' → '}
                <span className="font-medium">{entry.toStatus}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(entry.timestamp).toLocaleString()}
                <br />
                by {entry.userName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
