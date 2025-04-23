
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export type Period = {
  key: string;
  label: string;
};

interface PeriodDropdownProps {
  periods: Period[];
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export const PeriodDropdown = ({
  periods,
  selectedPeriod,
  onPeriodChange,
}: PeriodDropdownProps) => {
  const selectedLabel = periods.find(p => p.key === selectedPeriod)?.label || 'Select period';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-8 px-3 border-gray-200 bg-white hover:bg-gray-50 flex items-center gap-1"
        >
          {selectedLabel}
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[140px]">
        {periods.map((period) => (
          <DropdownMenuItem 
            key={period.key}
            onClick={() => onPeriodChange(period.key)}
            className="text-xs cursor-pointer"
          >
            {period.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const defaultPeriods: Period[] = [
  { key: '30d', label: 'Last 30 days' },
  { key: 'week', label: 'Last week' },
  { key: 'day', label: 'Today' },
  { key: 'year', label: 'This year' },
  { key: '3m', label: 'Last 3 months' }
];

export default PeriodDropdown;
