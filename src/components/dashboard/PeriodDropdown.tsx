
import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/lara-light-blue/theme.css'; // Or select your preferred Prime theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

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
  const value = periods.find(p => p.key === selectedPeriod);

  return (
    <Dropdown
      value={value}
      onChange={(e) => onPeriodChange(e.value.key)}
      options={periods}
      optionLabel="label"
      style={{ minWidth: 140, fontSize: '12px', height: 32 }}
      panelClassName="z-50"
      className="text-xs border-0 bg-transparent p-0 w-auto focus:ring-0"
      editable={false}
      placeholder="Select period"
    />
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
