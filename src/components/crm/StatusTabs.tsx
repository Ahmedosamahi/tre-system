
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  count: number;
  tooltip?: string;
}

interface StatusTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  tabs: Tab[];
}

export const StatusTabs: React.FC<StatusTabsProps> = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="py-4 overflow-x-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex w-full" style={{ minWidth: 'max-content' }}>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex justify-center items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span>{tab.label}</span>
                {tab.tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{tab.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <Badge 
                variant="primary" 
                className="text-xs ml-1 font-medium px-2.5 py-0.5 bg-blue-500 hover:bg-blue-600"
              >
                {tab.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
