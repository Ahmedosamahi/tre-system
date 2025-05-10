
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

type QuickFilter = 'today' | 'week' | 'month' | 'year' | 'custom';

export type DateFilterProps = {
  onFilterChange: (range: DateRange, filterType: QuickFilter) => void;
};

export const DateRangeFilter: React.FC<DateFilterProps> = ({ onFilterChange }) => {
  const [date, setDate] = useState<DateRange>({ from: undefined, to: undefined });
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('month');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleQuickFilterSelect = (filter: QuickFilter) => {
    setQuickFilter(filter);
    
    let newRange: DateRange = { from: undefined, to: undefined };
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filter) {
      case 'today':
        newRange = { from: today, to: today };
        break;
      case 'week':
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - 7);
        newRange = { from: lastWeekStart, to: today };
        break;
      case 'month':
        const lastMonthStart = new Date(today);
        lastMonthStart.setMonth(today.getMonth() - 1);
        newRange = { from: lastMonthStart, to: today };
        break;
      case 'year':
        const lastYearStart = new Date(today);
        lastYearStart.setFullYear(today.getFullYear() - 1);
        newRange = { from: lastYearStart, to: today };
        break;
      default:
        break;
    }
    
    setDate(newRange);
    onFilterChange(newRange, filter);
  };

  const handleDateSelect = (range: DateRange) => {
    setDate(range);
    if (range.from && range.to) {
      setIsCalendarOpen(false);
      setQuickFilter('custom');
      onFilterChange(range, 'custom');
    }
  };

  const clearFilters = () => {
    setDate({ from: undefined, to: undefined });
    setQuickFilter('month');
    handleQuickFilterSelect('month');
  };

  const getDateRangeText = () => {
    if (date.from && date.to) {
      if (format(date.from, 'PP') === format(date.to, 'PP')) {
        return format(date.from, 'PP');
      }
      return `${format(date.from, 'PP')} - ${format(date.to, 'PP')}`;
    }
    
    switch (quickFilter) {
      case 'today': return 'Today';
      case 'week': return 'Last Week';
      case 'month': return 'Last Month';
      case 'year': return 'Last Year';
      default: return 'Select Date Range';
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-9 border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>{getDateRangeText()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="h-9 border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50"
          >
            <span>Quick Filter</span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => handleQuickFilterSelect('today')} className="cursor-pointer">
            Today
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickFilterSelect('week')} className="cursor-pointer">
            Last Week
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickFilterSelect('month')} className="cursor-pointer">
            Last Month
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickFilterSelect('year')} className="cursor-pointer">
            Last Year
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button 
        variant="outline" 
        size="icon"
        onClick={clearFilters}
        className="h-9 w-9 border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50"
        title="Clear Filters"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DateRangeFilter;
