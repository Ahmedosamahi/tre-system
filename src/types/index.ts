
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
  className?: string;
  title?: string;
}

export type FinancialMetric = {
  title: string;
  amount: string;
  change: string;
  type: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
};

// Enhanced Customer type with new fields
export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  ordersCount: number;
  qualityScore: number;
  status: 'Active' | 'Inactive';
  customerType: 'VIP' | 'Returning Customer' | 'New' | 'Low Activity';
  warehouse: string;
  city: string;
  governorate: string;
  courierPreference: string;
  totalOrderValue: number;
  lastOrderDate: string;
  frequentCities: string[];
  orders: CustomerOrder[];
};

export type CustomerOrder = {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Delivered' | 'Rejected' | 'In Transit' | 'Pending' | 'Refunded' | 'Cancelled';
  courier: string;
  amount: number;
  paymentMethod: 'Cash' | 'Visa' | 'Mastercard' | 'ValU' | 'Bank Transfer';
  brandName: string;
  city: string;
  fullAddress: string;
};

// New types for Couriers
export type Courier = {
  id: string;
  name: string;
  country: string;
  status: 'Active' | 'Inactive';
  totalShipments: number;
  avgDeliveryTime: number;
  successRate: number;
  avgShippingCost: number;
  isPreferred: boolean;
  supportedServices: string[];
  returnPolicies: string;
  connectedApis: string[];
  rating?: number;
};

export interface Ticket {
  id: string;
  ticketId: string;
  orderNumber: string;
  referenceNumber: string;
  issueType: string;
  shippingCompany: string;
  dateCreated: string;
  issueCategory: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Not Responded' | 'Responded' | 'Resolved';
  customerName: string;
  phone: string;
  attachments?: string[];
  assignedTo?: string;
  lastResponse?: string;
  createdBy: string;
}

export interface TicketFormData {
  orderNumber: string;
  referenceNumber: string;
  issueType: string;
  shippingCompany: string;
  issueCategory: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  attachments?: File[];
}
