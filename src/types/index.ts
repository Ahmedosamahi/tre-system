export type NavItem = {
  title: string;
  href: string;
  icon: string;
};

export type CourierData = {
  name: string;
  delivered: number;
  returned: number;
};

export type CityData = {
  name: string;
  value: number;
};

export type MetricCardProps = {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: React.ReactNode;
};

export type CardProps = {
  title?: string;
  className?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

export interface StatusBadgeProps {
  status: 'success' | 'warning' | 'danger' | 'info' | 'default';
  children: React.ReactNode;
}

export type FinancialMetric = {
  title: string;
  amount: string;
  change: string;
  type: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
};
