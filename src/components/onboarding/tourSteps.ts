
import { TourStepData } from './TourStep';

export const tourSteps: TourStepData[] = [
  {
    id: 'dashboard-metrics',
    title: 'Dashboard Overview',
    description: 'These KPI cards show your key metrics at a glance - total orders, successful deliveries, and processing status.',
    selector: '[data-tour="metrics-cards"]',
    position: 'bottom',
  },
  {
    id: 'sidebar-orders',
    title: 'Orders Management',
    description: 'Create, track, and manage all your shipments from the Orders section. This is where you\'ll spend most of your time.',
    selector: '[data-tour="nav-orders"]',
    position: 'right',
  },
  {
    id: 'sidebar-warehouse',
    title: 'Warehouse & Inventory',
    description: 'Manage your warehouse locations, inventory, and pickup points from this section.',
    selector: '[data-tour="nav-warehouse"]',
    position: 'right',
  },
  {
    id: 'sidebar-customers',
    title: 'Customer Management',
    description: 'View and manage your customer database, including contact information and shipping preferences.',
    selector: '[data-tour="nav-customers"]',
    position: 'right',
  },
  {
    id: 'sidebar-analytics',
    title: 'Analytics & Reports',
    description: 'Access detailed reports on delivery performance, financial summaries, and business insights.',
    selector: '[data-tour="nav-analytics"]',
    position: 'right',
  },
  {
    id: 'sidebar-couriers',
    title: 'Courier Management',
    description: 'Manage your courier partners, compare rates, and track their performance metrics.',
    selector: '[data-tour="nav-couriers"]',
    position: 'right',
  },
  {
    id: 'sidebar-support',
    title: 'Help & Support',
    description: 'Access our help center, contact support, or submit tickets whenever you need assistance.',
    selector: '[data-tour="nav-support"]',
    position: 'right',
  },
];
