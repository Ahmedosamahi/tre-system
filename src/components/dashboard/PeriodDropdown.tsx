
import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  return (
    <Select value={selectedPeriod} onValueChange={onPeriodChange}>
      <SelectTrigger className="h-8 text-xs border-none bg-transparent px-2 w-auto focus:ring-0">
        <SelectValue placeholder="Select period" />
      </SelectTrigger>
      <SelectContent className="min-w-[140px]">
        {periods.map((period) => (
          <SelectItem key={period.key} value={period.key} className="text-xs">
            {period.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
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
