
import React from 'react';
import { ChevronDown, ChevronRight, Pencil, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DetailSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  isExpandable?: boolean;
  count?: string;
}

export const DetailSection: React.FC<DetailSectionProps> = ({ 
  icon, 
  title, 
  description, 
  action,
  isExpandable = false,
  count
}) => {
  const [expanded, setExpanded] = React.useState(false);
  
  return (
    <div className="border-b p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-gray-500">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{title}</h3>
              {count && <span className="text-sm text-gray-500">{count}</span>}
            </div>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {action}
          {isExpandable && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setExpanded(!expanded)}
              className="h-8 w-8 text-gray-500"
            >
              {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
