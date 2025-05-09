
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Tab {
  id: string;
  label: string;
  count: number;
}

interface StatusTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  tabs: Tab[];
}

export const StatusTabs: React.FC<StatusTabsProps> = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="py-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex justify-center items-center gap-2">
              {tab.label}
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
