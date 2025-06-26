
import React, { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Card } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';
import { SearchBox } from '@/components/ui/SearchBox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowUpDown, 
  CalendarIcon, 
  Package, 
  Search, 
  X, 
  ChevronDown, 
  FileText,
  MoreHorizontal,
  Edit,
  PlusCircle,
  Ban,
  Phone,
  CheckCircle2,
  Download,
  ChevronUp,
  Printer,
  FileText as FileTextIcon,
  CreditCard,
  Wallet,
  BadgeDollarSign,
  BadgePercent,
  Info,
  Check,
  MapPin,
  Truck,
  ShieldCheck,
  PenBox,
  PackageCheck,
  TicketIcon,
  Pencil,
  Trash2,
  User
} from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

import { cn } from '@/lib/utils';
import { StatusTabs } from '@/components/crm/StatusTabs';
import { useCreateOrderModals } from '@/hooks/useCreateOrderModals';
import { Separator } from '@/components/ui/separator';

// Type definitions
type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'dispatched' 
  | 'dispatched-request'
  | 'picked-up'
  | 'delivering'
  | 'abnormal'
  | 'delivered'
  | 'returning'
  | 'returned'
  | 'canceled'
  | 'pending-refund'
  | 'refunded';

interface Order {
  id: string;
  orderNumber: string;
  referenceNumber: string;
  awbNumber: string;
  quantity: number;
  weight: number;
  serviceType: 'delivery' | 'return' | 'exchange';
  cod: number;
  valueOfGoods: number;
  courier?: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus?: 'paid' | 'pending' | 'failed' | 'refunded' | 'partially-paid';
  deliveryAttempts?: number;
  downPayment?: {
    applied: boolean;
    value?: number;
  };
  discountCode?: {
    code: string;
    value: number;
  };
  receiverInfo: {
    name: string;
    phone: string;
    address: string;
    area: string;
    city: string;
    province: string;
  };
  items: Array<{
    sku: string;
    description: string;
    quantity: number;
  }>;
  notes?: string;
  warehouse: string;
  createdAt: string;
}

// Status tab mapping
interface StatusTab {
  id: OrderStatus | 'all';
  label: string;
  tooltip?: string;
  count: number;
}

// Shipping company interface
interface ShippingCompany {
  id: string;
  name: string;
  logo: string;
  cost: number;
  performanceScore: number;
  avgDeliveryTime: string;
  successRate: number;
}

// Helper function to map order status to badge style
const getStatusBadgeType = (status: OrderStatus): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
  switch(status) {
    case 'delivered':
    case 'refunded':
      return 'success';
    case 'abnormal':
    case 'returning':
    case 'pending-refund':
      return 'warning';
    case 'canceled':
    case 'returned':
      return 'danger';
    case 'dispatched':
    case 'dispatched-request':
    case 'picked-up':
    case 'delivering':
      return 'info';
    case 'pending':
    case 'confirmed':
    default:
      return 'default';
  }
};

// Helper function to get payment status badge style
const getPaymentStatusBadge = (status?: string): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
  switch(status) {
    case 'paid':
      return 'success';
    case 'pending':
    case 'partially-paid':
      return 'warning';
    case 'failed':
      return 'danger';
    case 'refunded':
      return 'info';
    default:
      return 'default';
  }
};

// Helper function to get delivery attempts badge style
const getAttemptsStatusBadge = (attempts: number): 'success' | 'warning' | 'danger' | 'default' => {
  if (attempts === 0) return 'default';
  if (attempts <= 2) return 'success';
  if (attempts === 3) return 'warning';
  return 'danger';
};

// Helper function to get payment method icon
const getPaymentMethodIcon = (method: string) => {
  switch(method?.toLowerCase()) {
    case 'credit card':
    case 'visa':
    case 'mastercard':
      return <CreditCard className="h-4 w-4 mr-2 text-gray-500" />;
    case 'cash':
    case 'cash on delivery':
    case 'cod':
      return <Wallet className="h-4 w-4 mr-2 text-gray-500" />; // Using Wallet instead of Cash
    default:
      return <BadgeDollarSign className="h-4 w-4 mr-2 text-gray-500" />;
  }
};

// Helper function to determine if bulk actions are allowed for a status
const areBulkActionsAllowed = (status: string): boolean => {
  const allowedStatuses = ['all', 'pending', 'confirmed', 'dispatched', 'picked-up', 'canceled'];
  return allowedStatuses.includes(status);
};

// Helper function to get available bulk actions for a status
const getBulkActions = (status: string): string[] => {
  switch(status) {
    case 'all':
      return ['cancel', 'confirm', 'assignShipping'];
    case 'pending':
      return ['cancel', 'confirm'];
    case 'confirmed':
      return ['assignShipping', 'cancel'];
    case 'dispatched':
      return ['cancel', 'createPickupRequest'];
    case 'picked-up':
      return ['cancelDelivery'];
    case 'canceled':
      return []; // No actions for canceled orders
    default:
      return [];
  }
};

const Orders = () => {
  // States
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{from: Date | null, to: Date | null}>({
    from: null,
    to: null
  });
  const [filters, setFilters] = useState({
    orderNumber: '',
    awbNumber: '',
    referenceNumber: '',
    phone: '',
    serviceType: '',
    courier: '',
    status: '',
    warehouse: '',
    paymentMethod: '',
    city: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkCourier, setBulkCourier] = useState('');
  const [isProcessingBulkAction, setIsProcessingBulkAction] = useState(false);
  const [showShippingCompanyModal, setShowShippingCompanyModal] = useState(false);

  // Mock shipping companies data
  const shippingCompanies: ShippingCompany[] = [
    {
      id: '1',
      name: 'Aramex',
      logo: '/api/placeholder/80/40',
      cost: 25,
      performanceScore: 4.5,
      avgDeliveryTime: '2-3 days',
      successRate: 92
    },
    {
      id: '2',
      name: 'DHL',
      logo: '/api/placeholder/80/40',
      cost: 35,
      performanceScore: 4.8,
      avgDeliveryTime: '1-2 days',
      successRate: 96
    },
    {
      id: '3',
      name: 'Fedex',
      logo: '/api/placeholder/80/40',
      cost: 30,
      performanceScore: 4.6,
      avgDeliveryTime: '2-3 days',
      successRate: 94
    }
  ];

  // Expanded Mock data with 10 orders for each status
  const sampleOrders: Order[] = [
    // Pending Orders (10)
    {
      id: '1',
      orderNumber: 'ORD-2025-10001',
      referenceNumber: 'REF-001',
      awbNumber: 'AWB0012345',
      quantity: 2,
      weight: 1.5,
      serviceType: 'delivery',
      cod: 250,
      valueOfGoods: 300,
      courier: 'Aramex',
      status: 'pending',
      paymentMethod: 'Cash',
      paymentStatus: 'pending',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Ahmed Mohamed',
        phone: '+201012345678',
        address: '123 El Nasr St',
        area: 'Nasr City',
        city: 'Cairo',
        province: 'Cairo'
      },
      items: [
        { sku: 'SKU001', description: 'Men\'s T-Shirt', quantity: 1 },
        { sku: 'SKU002', description: 'Women\'s Scarf', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-05-07'
    },
    {
      id: '11',
      orderNumber: 'ORD-2025-10011',
      referenceNumber: 'REF-011',
      awbNumber: 'AWB0012355',
      quantity: 1,
      weight: 0.8,
      serviceType: 'delivery',
      cod: 180,
      valueOfGoods: 200,
      status: 'pending',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'pending',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Fatma Ali',
        phone: '+201112345678',
        address: '456 Tahrir Square',
        area: 'Downtown',
        city: 'Cairo',
        province: 'Cairo'
      },
      items: [
        { sku: 'SKU011', description: 'Phone Charger', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-05-07'
    },
    {
      id: '12',
      orderNumber: 'ORD-2025-10012',
      referenceNumber: 'REF-012',
      awbNumber: 'AWB0012356',
      quantity: 3,
      weight: 2.1,
      serviceType: 'delivery',
      cod: 450,
      valueOfGoods: 500,
      status: 'pending',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'pending',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Omar Hassan',
        phone: '+201212345678',
        address: '789 Gezira St',
        area: 'Zamalek',
        city: 'Cairo',
        province: 'Cairo'
      },
      items: [
        { sku: 'SKU012', description: 'Bluetooth Speaker', quantity: 1 },
        { sku: 'SKU013', description: 'Cable Pack', quantity: 2 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-05-06'
    },
    {
      id: '13',
      orderNumber: 'ORD-2025-10013',
      referenceNumber: 'REF-013',
      awbNumber: 'AWB0012357',
      quantity: 1,
      weight: 1.2,
      serviceType: 'delivery',
      cod: 320,
      valueOfGoods: 350,
      status: 'pending',
      paymentMethod: 'Credit Card',
      paymentStatus: 'pending',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Nadia Mahmoud',
        phone: '+201312345678',
        address: '101 Shubra St',
        area: 'Shubra',
        city: 'Cairo',
        province: 'Cairo'
      },
      items: [
        { sku: 'SKU014', description: 'Wireless Mouse', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-05-06'
    },
    {
      id: '14',
      orderNumber: 'ORD-2025-10014',
      referenceNumber: 'REF-014',
      awbNumber: 'AWB0012358',
      quantity: 2,
      weight: 1.8,
      serviceType: 'delivery',
      cod: 280,
      valueOfGoods: 320,
      status: 'pending',
      paymentMethod: 'ValU',
      paymentStatus: 'pending',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Khaled Samir',
        phone: '+201412345678',
        address: '202 Heliopolis St',
        area: 'Heliopolis',
        city: 'Cairo',
        province: 'Cairo'
      },
      items: [
        { sku: 'SKU015', description: 'Gaming Headset', quantity: 1 },
        { sku: 'SKU016', description: 'Mouse Pad', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-05-05'
    },
    {
      id: '15',
      orderNumber: 'ORD-2025-10015',
      referenceNumber: 'REF-015',
      awbNumber: 'AWB0012359',
      quantity: 1,
      weight: 0.5,
      serviceType: 'delivery',
      cod: 150,
      valueOfGoods: 180,
      status: 'pending',
      paymentMethod: 'Cash',
      paymentStatus: 'pending',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Laila Ahmed',
        phone: '+201512345678',
        address: '303 Maadi St',
        area: 'Maadi',
        city: 'Cairo',
        province: 'Cairo'
      },
      items: [
        { sku: 'SKU017', description: 'Phone Case', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-05-05'
    },
    {
      id: '16',
      orderNumber: 'ORD-2025-10016',
      referenceNumber: 'REF-016',
      awbNumber: 'AWB0012360',
      quantity: 4,
      weight: 3.2,
      serviceType: 'delivery',
      cod: 680,
      valueOfGoods: 750,
      status: 'pending',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'pending',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Youssef Ibrahim',
        phone: '+201612345678',
        address: '404 New Cairo St',
        area: 'New Cairo',
        city: 'Cairo',
        province: 'Cairo'
      },
      items: [
        { sku: 'SKU018', description: 'Laptop Stand', quantity: 1 },
        { sku: 'SKU019', description: 'USB Hub', quantity: 2 },
        { sku: 'SKU020', description: 'HDMI Cable', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-05-04'
    },
    {
      id: '17',
      orderNumber: 'ORD-2025-10017',
      referenceNumber: 'REF-017',
      awbNumber: 'AWB0012361',
      quantity: 1,
      weight: 2.5,
      serviceType: 'delivery',
      cod: 420,
      valueOfGoods: 480,
      status: 'pending',
      paymentMethod: 'Credit Card',
      paymentStatus: 'pending',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Rania Mostafa',
        phone: '+201712345678',
        address: '505 Dokki St',
        area: 'Dokki',
        city: 'Giza',
        province: 'Giza'
      },
      items: [
        { sku: 'SKU021', description: 'Portable Speaker', quantity: 1 }
      ],
      warehouse: 'Giza Branch',
      createdAt: '2025-05-04'
    },
    {
      id: '18',
      orderNumber: 'ORD-2025-10018',
      referenceNumber: 'REF-018',
      awbNumber: 'AWB0012362',
      quantity: 2,
      weight: 1.1,
      serviceType: 'delivery',
      cod: 240,
      valueOfGoods: 280,
      status: 'pending',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'pending',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Tarek Fathy',
        phone: '+201812345678',
        address: '606 Agouza St',
        area: 'Agouza',
        city: 'Giza',
        province: 'Giza'
      },
      items: [
        { sku: 'SKU022', description: 'Power Bank', quantity: 1 },
        { sku: 'SKU023', description: 'Charging Cable', quantity: 1 }
      ],
      warehouse: 'Giza Branch',
      createdAt: '2025-05-03'
    },
    {
      id: '19',
      orderNumber: 'ORD-2025-10019',
      referenceNumber: 'REF-019',
      awbNumber: 'AWB0012363',
      quantity: 1,
      weight: 0.3,
      serviceType: 'delivery',
      cod: 90,
      valueOfGoods: 120,
      status: 'pending',
      paymentMethod: 'ValU',
      paymentStatus: 'pending',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Dina Salah',
        phone: '+201912345678',
        address: '707 Haram St',
        area: 'Haram',
        city: 'Giza',
        province: 'Giza'
      },
      items: [
        { sku: 'SKU024', description: 'Screen Protector', quantity: 1 }
      ],
      warehouse: 'Giza Branch',
      createdAt: '2025-05-03'
    },

    // Confirmed Orders (10)
    {
      id: '2',
      orderNumber: 'ORD-2025-10002',
      referenceNumber: 'REF-002',
      awbNumber: 'AWB0012346',
      quantity: 1,
      weight: 0.5,
      serviceType: 'delivery',
      cod: 150,
      valueOfGoods: 150,
      courier: 'Fedex',
      status: 'confirmed',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'paid',
      deliveryAttempts: 0,
      discountCode: {
        code: 'SUMMER10',
        value: 15
      },
      receiverInfo: {
        name: 'Sara Ali',
        phone: '+201123456789',
        address: '456 El Haram St',
        area: 'Giza',
        city: 'Giza',
        province: 'Giza'
      },
      items: [
        { sku: 'SKU003', description: 'Phone Case', quantity: 1 }
      ],
      warehouse: 'Giza Branch',
      createdAt: '2025-05-06'
    },
    {
      id: '21',
      orderNumber: 'ORD-2025-10021',
      referenceNumber: 'REF-021',
      awbNumber: 'AWB0012365',
      quantity: 2,
      weight: 1.6,
      serviceType: 'delivery',
      cod: 380,
      valueOfGoods: 420,
      status: 'confirmed',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Mahmoud Adel',
        phone: '+202112345678',
        address: '808 Alexandria St',
        area: 'Smouha',
        city: 'Alexandria',
        province: 'Alexandria'
      },
      items: [
        { sku: 'SKU025', description: 'Wireless Earbuds', quantity: 1 },
        { sku: 'SKU026', description: 'Case', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-05-06'
    },
    {
      id: '22',
      orderNumber: 'ORD-2025-10022',
      referenceNumber: 'REF-022',
      awbNumber: 'AWB0012366',
      quantity: 1,
      weight: 2.8,
      serviceType: 'delivery',
      cod: 520,
      valueOfGoods: 580,
      status: 'confirmed',
      paymentMethod: 'Cash',
      paymentStatus: 'pending',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Aya Khaled',
        phone: '+202212345678',
        address: '909 Mansoura St',
        area: 'Downtown',
        city: 'Mansoura',
        province: 'Dakahlia'
      },
      items: [
        { sku: 'SKU027', description: 'Smart Watch', quantity: 1 }
      ],
      warehouse: 'Mansoura Branch',
      createdAt: '2025-05-05'
    },
    {
      id: '23',
      orderNumber: 'ORD-2025-10023',
      referenceNumber: 'REF-023',
      awbNumber: 'AWB0012367',
      quantity: 3,
      weight: 1.9,
      serviceType: 'delivery',
      cod: 350,
      valueOfGoods: 400,
      status: 'confirmed',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Hossam Nabil',
        phone: '+202312345678',
        address: '1010 Luxor St',
        area: 'East Bank',
        city: 'Luxor',
        province: 'Luxor'
      },
      items: [
        { sku: 'SKU028', description: 'Keyboard', quantity: 1 },
        { sku: 'SKU029', description: 'Mouse', quantity: 1 },
        { sku: 'SKU030', description: 'Mousepad', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-05-05'
    },
    {
      id: '24',
      orderNumber: 'ORD-2025-10024',
      referenceNumber: 'REF-024',
      awbNumber: 'AWB0012368',
      quantity: 1,
      weight: 0.7,
      serviceType: 'delivery',
      cod: 200,
      valueOfGoods: 230,
      status: 'confirmed',
      paymentMethod: 'ValU',
      paymentStatus: 'partially-paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Noha Gamal',
        phone: '+202412345678',
        address: '1111 Aswan St',
        area: 'City Center',
        city: 'Aswan',
        province: 'Aswan'
      },
      items: [
        { sku: 'SKU031', description: 'Tablet Stand', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-05-04'
    },
    {
      id: '25',
      orderNumber: 'ORD-2025-10025',
      referenceNumber: 'REF-025',
      awbNumber: 'AWB0012369',
      quantity: 2,
      weight: 2.3,
      serviceType: 'delivery',
      cod: 460,
      valueOfGoods: 520,
      status: 'confirmed',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Sherif Wael',
        phone: '+202512345678',
        address: '1212 Port Said St',
        area: 'Port',
        city: 'Port Said',
        province: 'Port Said'
      },
      items: [
        { sku: 'SKU032', description: 'Camera Lens', quantity: 1 },
        { sku: 'SKU033', description: 'Tripod', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-05-04'
    },
    {
      id: '26',
      orderNumber: 'ORD-2025-10026',
      referenceNumber: 'REF-026',
      awbNumber: 'AWB0012370',
      quantity: 1,
      weight: 1.4,
      serviceType: 'delivery',
      cod: 300,
      valueOfGoods: 340,
      status: 'confirmed',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'pending',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Mariam Essam',
        phone: '+202612345678',
        address: '1313 Suez St',
        area: 'Industrial',
        city: 'Suez',
        province: 'Suez'
      },
      items: [
        { sku: 'SKU034', description: 'External HDD', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-05-03'
    },
    {
      id: '27',
      orderNumber: 'ORD-2025-10027',
      referenceNumber: 'REF-027',
      awbNumber: 'AWB0012371',
      quantity: 4,
      weight: 2.7,
      serviceType: 'delivery',
      cod: 620,
      valueOfGoods: 700,
      status: 'confirmed',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Amr Magdy',
        phone: '+202712345678',
        address: '1414 Tanta St',
        area: 'Downtown',
        city: 'Tanta',
        province: 'Gharbia'
      },
      items: [
        { sku: 'SKU035', description: 'Monitor', quantity: 1 },
        { sku: 'SKU036', description: 'HDMI Cable', quantity: 2 },
        { sku: 'SKU037', description: 'Stand', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-05-03'
    },
    {
      id: '28',
      orderNumber: 'ORD-2025-10028',
      referenceNumber: 'REF-028',
      awbNumber: 'AWB0012372',
      quantity: 1,
      weight: 0.9,
      serviceType: 'delivery',
      cod: 180,
      valueOfGoods: 210,
      status: 'confirmed',
      paymentMethod: 'Cash',
      paymentStatus: 'pending',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Salma Reda',
        phone: '+202812345678',
        address: '1515 Ismailia St',
        area: 'City Center',
        city: 'Ismailia',
        province: 'Ismailia'
      },
      items: [
        { sku: 'SKU038', description: 'Webcam', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-05-02'
    },
    {
      id: '29',
      orderNumber: 'ORD-2025-10029',
      referenceNumber: 'REF-029',
      awbNumber: 'AWB0012373',
      quantity: 2,
      weight: 1.3,
      serviceType: 'delivery',
      cod: 260,
      valueOfGoods: 300,
      status: 'confirmed',
      paymentMethod: 'ValU',
      paymentStatus: 'partially-paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Karim Ashraf',
        phone: '+202912345678',
        address: '1616 Zagazig St',
        area: 'University',
        city: 'Zagazig',
        province: 'Sharqia'
      },
      items: [
        { sku: 'SKU039', description: 'USB Flash Drive', quantity: 2 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-05-02'
    },

    // Dispatched Orders (10)
    {
      id: '31',
      orderNumber: 'ORD-2025-10031',
      referenceNumber: 'REF-031',
      awbNumber: 'AWB0012375',
      quantity: 1,
      weight: 1.8,
      serviceType: 'delivery',
      cod: 320,
      valueOfGoods: 380,
      courier: 'Aramex',
      status: 'dispatched',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Mona Hesham',
        phone: '+203112345678',
        address: '1717 Beni Suef St',
        area: 'Central',
        city: 'Beni Suef',
        province: 'Beni Suef'
      },
      items: [
        { sku: 'SKU041', description: 'Tablet Case', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-05-01'
    },
    {
      id: '32',
      orderNumber: 'ORD-2025-10032',
      referenceNumber: 'REF-032',
      awbNumber: 'AWB0012376',
      quantity: 3,
      weight: 2.4,
      serviceType: 'delivery',
      cod: 480,
      valueOfGoods: 550,
      courier: 'DHL',
      status: 'dispatched',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Tamer Fouad',
        phone: '+203212345678',
        address: '1818 Minya St',
        area: 'Corniche',
        city: 'Minya',
        province: 'Minya'
      },
      items: [
        { sku: 'SKU042', description: 'Gaming Controller', quantity: 1 },
        { sku: 'SKU043', description: 'Charging Station', quantity: 1 },
        { sku: 'SKU044', description: 'Game Disc', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-05-01'
    },
    {
      id: '33',
      orderNumber: 'ORD-2025-10033',
      referenceNumber: 'REF-033',
      awbNumber: 'AWB0012377',
      quantity: 1,
      weight: 0.6,
      serviceType: 'delivery',
      cod: 140,
      valueOfGoods: 170,
      courier: 'Fedex',
      status: 'dispatched',
      paymentMethod: 'Cash',
      paymentStatus: 'pending',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Yasmin Omar',
        phone: '+203312345678',
        address: '1919 Asyut St',
        area: 'University',
        city: 'Asyut',
        province: 'Asyut'
      },
      items: [
        { sku: 'SKU045', description: 'Phone Grip', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-04-30'
    },
    {
      id: '34',
      orderNumber: 'ORD-2025-10034',
      referenceNumber: 'REF-034',
      awbNumber: 'AWB0012378',
      quantity: 2,
      weight: 1.7,
      serviceType: 'delivery',
      cod: 340,
      valueOfGoods: 390,
      courier: 'Aramex',
      status: 'dispatched',
      paymentMethod: 'ValU',
      paymentStatus: 'partially-paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Hassan Ali',
        phone: '+203412345678',
        address: '2020 Sohag St',
        area: 'Sohag Center',
        city: 'Sohag',
        province: 'Sohag'
      },
      items: [
        { sku: 'SKU046', description: 'Bluetooth Adapter', quantity: 1 },
        { sku: 'SKU047', description: 'Audio Cable', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-04-30'
    },
    {
      id: '35',
      orderNumber: 'ORD-2025-10035',
      referenceNumber: 'REF-035',
      awbNumber: 'AWB0012379',
      quantity: 1,
      weight: 2.1,
      serviceType: 'delivery',
      cod: 420,
      valueOfGoods: 480,
      courier: 'DHL',
      status: 'dispatched',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Nihal Mahmoud',
        phone: '+203512345678',
        address: '2121 Qena St',
        area: 'Qena Center',
        city: 'Qena',
        province: 'Qena'
      },
      items: [
        { sku: 'SKU048', description: 'Projector', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-04-29'
    },
    {
      id: '36',
      orderNumber: 'ORD-2025-10036',
      referenceNumber: 'REF-036',
      awbNumber: 'AWB0012380',
      quantity: 4,
      weight: 3.1,
      serviceType: 'delivery',
      cod: 580,
      valueOfGoods: 650,
      courier: 'Fedex',
      status: 'dispatched',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Adel Saeed',
        phone: '+203612345678',
        address: '2222 Hurghada St',
        area: 'Resort Area',
        city: 'Hurghada',
        province: 'Red Sea'
      },
      items: [
        { sku: 'SKU049', description: 'Action Camera', quantity: 1 },
        { sku: 'SKU050', description: 'Memory Card', quantity: 2 },
        { sku: 'SKU051', description: 'Waterproof Case', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-04-29'
    },
    {
      id: '37',
      orderNumber: 'ORD-2025-10037',
      referenceNumber: 'REF-037',
      awbNumber: 'AWB0012381',
      quantity: 1,
      weight: 1.0,
      serviceType: 'delivery',
      cod: 220,
      valueOfGoods: 260,
      courier: 'Aramex',
      status: 'dispatched',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'pending',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Eman Youssef',
        phone: '+203712345678',
        address: '2323 Marsa Alam St',
        area: 'Port Area',
        city: 'Marsa Alam',
        province: 'Red Sea'
      },
      items: [
        { sku: 'SKU052', description: 'Fitness Tracker', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-04-28'
    },
    {
      id: '38',
      orderNumber: 'ORD-2025-10038',
      referenceNumber: 'REF-038',
      awbNumber: 'AWB0012382',
      quantity: 2,
      weight: 1.5,
      serviceType: 'delivery',
      cod: 300,
      valueOfGoods: 350,
      courier: 'DHL',
      status: 'dispatched',
      paymentMethod: 'ValU',
      paymentStatus: 'partially-paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Mostafa Gamal',
        phone: '+203812345678',
        address: '2424 Sharm El Sheikh St',
        area: 'Naama Bay',
        city: 'Sharm El Sheikh',
        province: 'South Sinai'
      },
      items: [
        { sku: 'SKU053', description: 'Snorkeling Gear', quantity: 1 },
        { sku: 'SKU054', description: 'Waterproof Bag', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-28'
    },
    {
      id: '39',
      orderNumber: 'ORD-2025-10039',
      referenceNumber: 'REF-039',
      awbNumber: 'AWB0012383',
      quantity: 1,
      weight: 0.8,
      serviceType: 'delivery',
      cod: 160,
      valueOfGoods: 190,
      courier: 'Fedex',
      status: 'dispatched',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Hala Nasser',
        phone: '+203912345678',
        address: '2525 Dahab St',
        area: 'Dahab Center',
        city: 'Dahab',
        province: 'South Sinai'
      },
      items: [
        { sku: 'SKU055', description: 'Beach Speaker', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-27'
    },
    {
      id: '40',
      orderNumber: 'ORD-2025-10040',
      referenceNumber: 'REF-040',
      awbNumber: 'AWB0012384',
      quantity: 3,
      weight: 2.6,
      serviceType: 'delivery',
      cod: 500,
      valueOfGoods: 570,
      courier: 'Aramex',
      status: 'dispatched',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Wael Tarek',
        phone: '+204012345678',
        address: '2626 Nuweiba St',
        area: 'Port Area',
        city: 'Nuweiba',
        province: 'South Sinai'
      },
      items: [
        { sku: 'SKU056', description: 'Camping Tent', quantity: 1 },
        { sku: 'SKU057', description: 'Sleeping Bag', quantity: 1 },
        { sku: 'SKU058', description: 'Lantern', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-27'
    },

    // Picked-Up Orders (10)
    {
      id: '41',
      orderNumber: 'ORD-2025-10041',
      referenceNumber: 'REF-041',
      awbNumber: 'AWB0012385',
      quantity: 1,
      weight: 1.2,
      serviceType: 'delivery',
      cod: 280,
      valueOfGoods: 320,
      courier: 'Aramex',
      status: 'picked-up',
      paymentMethod: 'Cash',
      paymentStatus: 'pending',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Nour El Din',
        phone: '+204112345678',
        address: '2727 Arish St',
        area: 'Arish Center',
        city: 'Arish',
        province: 'North Sinai'
      },
      items: [
        { sku: 'SKU059', description: 'Solar Charger', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-26'
    },
    {
      id: '42',
      orderNumber: 'ORD-2025-10042',
      referenceNumber: 'REF-042',
      awbNumber: 'AWB0012386',
      quantity: 2,
      weight: 1.9,
      serviceType: 'delivery',
      cod: 380,
      valueOfGoods: 430,
      courier: 'DHL',
      status: 'picked-up',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Farah Ahmed',
        phone: '+204212345678',
        address: '2828 Rafah St',
        area: 'Border Area',
        city: 'Rafah',
        province: 'North Sinai'
      },
      items: [
        { sku: 'SKU060', description: 'Satellite Phone', quantity: 1 },
        { sku: 'SKU061', description: 'Emergency Kit', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-26'
    },
    {
      id: '43',
      orderNumber: 'ORD-2025-10043',
      referenceNumber: 'REF-043',
      awbNumber: 'AWB0012387',
      quantity: 1,
      weight: 0.4,
      serviceType: 'delivery',
      cod: 120,
      valueOfGoods: 150,
      courier: 'Fedex',
      status: 'picked-up',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Ziad Hosny',
        phone: '+204312345678',
        address: '2929 Sheikh Zuweid St',
        area: 'Central',
        city: 'Sheikh Zuweid',
        province: 'North Sinai'
      },
      items: [
        { sku: 'SKU062', description: 'Compass', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-25'
    },
    {
      id: '44',
      orderNumber: 'ORD-2025-10044',
      referenceNumber: 'REF-044',
      awbNumber: 'AWB0012388',
      quantity: 3,
      weight: 2.3,
      serviceType: 'delivery',
      cod: 460,
      valueOfGoods: 520,
      courier: 'Aramex',
      status: 'picked-up',
      paymentMethod: 'ValU',
      paymentStatus: 'partially-paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Lina Mahmoud',
        phone: '+204412345678',
        address: '3030 Bir Al Abd St',
        area: 'Desert Road',
        city: 'Bir Al Abd',
        province: 'North Sinai'
      },
      items: [
        { sku: 'SKU063', description: 'Desert Boots', quantity: 1 },
        { sku: 'SKU064', description: 'Sun Hat', quantity: 1 },
        { sku: 'SKU065', description: 'Water Bottle', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-25'
    },
    {
      id: '45',
      orderNumber: 'ORD-2025-10045',
      referenceNumber: 'REF-045',
      awbNumber: 'AWB0012389',
      quantity: 1,
      weight: 1.6,
      serviceType: 'delivery',
      cod: 340,
      valueOfGoods: 390,
      courier: 'DHL',
      status: 'picked-up',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'pending',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Samir Lotfy',
        phone: '+204512345678',
        address: '3131 Nakhl St',
        area: 'Oasis',
        city: 'Nakhl',
        province: 'North Sinai'
      },
      items: [
        { sku: 'SKU066', description: 'Binoculars', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-24'
    },
    {
      id: '46',
      orderNumber: 'ORD-2025-10046',
      referenceNumber: 'REF-046',
      awbNumber: 'AWB0012390',
      quantity: 2,
      weight: 1.1,
      serviceType: 'delivery',
      cod: 240,
      valueOfGoods: 280,
      courier: 'Fedex',
      status: 'picked-up',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Dalia Fayed',
        phone: '+204612345678',
        address: '3232 Hassana St',
        area: 'Central',
        city: 'Hassana',
        province: 'North Sinai'
      },
      items: [
        { sku: 'SKU067', description: 'Thermal Blanket', quantity: 1 },
        { sku: 'SKU068', description: 'Hand Warmer', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-24'
    },
    {
      id: '47',
      orderNumber: 'ORD-2025-10047',
      referenceNumber: 'REF-047',
      awbNumber: 'AWB0012391',
      quantity: 1,
      weight: 2.8,
      serviceType: 'delivery',
      cod: 520,
      valueOfGoods: 580,
      courier: 'Aramex',
      status: 'picked-up',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Reda Farouk',
        phone: '+204712345678',
        address: '3333 Nekhel St',
        area: 'Mountain Area',
        city: 'Nekhel',
        province: 'North Sinai'
      },
      items: [
        { sku: 'SKU069', description: 'Mountain Bike', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-23'
    },
    {
      id: '48',
      orderNumber: 'ORD-2025-10048',
      referenceNumber: 'REF-048',
      awbNumber: 'AWB0012392',
      quantity: 4,
      weight: 2.2,
      serviceType: 'delivery',
      cod: 440,
      valueOfGoods: 500,
      courier: 'DHL',
      status: 'picked-up',
      paymentMethod: 'ValU',
      paymentStatus: 'partially-paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Ghada Samy',
        phone: '+204812345678',
        address: '3434 Taba St',
        area: 'Border Crossing',
        city: 'Taba',
        province: 'South Sinai'
      },
      items: [
        { sku: 'SKU070', description: 'Travel Adapter', quantity: 2 },
        { sku: 'SKU071', description: 'Passport Holder', quantity: 1 },
        { sku: 'SKU072', description: 'Luggage Tag', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-23'
    },
    {
      id: '49',
      orderNumber: 'ORD-2025-10049',
      referenceNumber: 'REF-049',
      awbNumber: 'AWB0012393',
      quantity: 1,
      weight: 0.7,
      serviceType: 'delivery',
      cod: 180,
      valueOfGoods: 210,
      courier: 'Fedex',
      status: 'picked-up',
      paymentMethod: 'Cash',
      paymentStatus: 'pending',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Khaled Nour',
        phone: '+204912345678',
        address: '3535 Catherine St',
        area: 'Monastery Area',
        city: 'Saint Catherine',
        province: 'South Sinai'
      },
      items: [
        { sku: 'SKU073', description: 'Hiking Boots', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-22'
    },
    {
      id: '50',
      orderNumber: 'ORD-2025-10050',
      referenceNumber: 'REF-050',
      awbNumber: 'AWB0012394',
      quantity: 2,
      weight: 1.4,
      serviceType: 'delivery',
      cod: 300,
      valueOfGoods: 340,
      courier: 'Aramex',
      status: 'picked-up',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Maha Rizk',
        phone: '+205012345678',
        address: '3636 Ras Sedr St',
        area: 'Beach Area',
        city: 'Ras Sedr',
        province: 'South Sinai'
      },
      items: [
        { sku: 'SKU074', description: 'Beach Umbrella', quantity: 1 },
        { sku: 'SKU075', description: 'Beach Chair', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-22'
    },

    // Delivering Orders (10)
    {
      id: '51',
      orderNumber: 'ORD-2025-10051',
      referenceNumber: 'REF-051',
      awbNumber: 'AWB0012395',
      quantity: 1,
      weight: 1.3,
      serviceType: 'delivery',
      cod: 290,
      valueOfGoods: 330,
      courier: 'Aramex',
      status: 'delivering',
      paymentMethod: 'Cash',
      paymentStatus: 'pending',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Basma Kamal',
        phone: '+205112345678',
        address: '3737 Abu Zenima St',
        area: 'Industrial',
        city: 'Abu Zenima',
        province: 'South Sinai'
      },
      items: [
        { sku: 'SKU076', description: 'Industrial Gloves', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-21'
    },
    {
      id: '52',
      orderNumber: 'ORD-2025-10052',
      referenceNumber: 'REF-052',
      awbNumber: 'AWB0012396',
      quantity: 3,
      weight: 2.5,
      serviceType: 'delivery',
      cod: 480,
      valueOfGoods: 540,
      courier: 'DHL',
      status: 'delivering',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Tarik Mansour',
        phone: '+205212345678',
        address: '3838 Tor St',
        area: 'Coastal',
        city: 'Tor',
        province: 'South Sinai'
      },
      items: [
        { sku: 'SKU077', description: 'Diving Equipment', quantity: 1 },
        { sku: 'SKU078', description: 'Underwater Camera', quantity: 1 },
        { sku: 'SKU079', description: 'Diving Fins', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-21'
    },
    {
      id: '53',
      orderNumber: 'ORD-2025-10053',
      referenceNumber: 'REF-053',
      awbNumber: 'AWB0012397',
      quantity: 1,
      weight: 0.9,
      serviceType: 'delivery',
      cod: 200,
      valueOfGoods: 230,
      courier: 'Fedex',
      status: 'delivering',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'paid',
      deliveryAttempts: 2,
      receiverInfo: {
        name: 'Amina Zaki',
        phone: '+205312345678',
        address: '3939 Abu Rudeis St',
        area: 'Oil Field',
        city: 'Abu Rudeis',
        province: 'South Sinai'
      },
      items: [
        { sku: 'SKU080', description: 'Safety Helmet', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-20'
    },
    {
      id: '54',
      orderNumber: 'ORD-2025-10054',
      referenceNumber: 'REF-054',
      awbNumber: 'AWB0012398',
      quantity: 2,
      weight: 1.8,
      serviceType: 'delivery',
      cod: 360,
      valueOfGoods: 410,
      courier: 'Aramex',
      status: 'delivering',
      paymentMethod: 'ValU',
      paymentStatus: 'partially-paid',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Samy Helal',
        phone: '+205412345678',
        address: '4040 Ras Gharib St',
        area: 'Port',
        city: 'Ras Gharib',
        province: 'Red Sea'
      },
      items: [
        { sku: 'SKU081', description: 'Marine Radio', quantity: 1 },
        { sku: 'SKU082', description: 'Life Jacket', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-04-20'
    },
    {
      id: '55',
      orderNumber: 'ORD-2025-10055',
      referenceNumber: 'REF-055',
      awbNumber: 'AWB0012399',
      quantity: 1,
      weight: 2.7,
      serviceType: 'delivery',
      cod: 510,
      valueOfGoods: 570,
      courier: 'DHL',
      status: 'delivering',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'pending',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Nada Farid',
        phone: '+205512345678',
        address: '4141 Safaga St',
        area: 'Port Area',
        city: 'Safaga',
        province: 'Red Sea'
      },
      items: [
        { sku: 'SKU083', description: 'Fishing Rod', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-04-19'
    },
    {
      id: '56',
      orderNumber: 'ORD-2025-10056',
      referenceNumber: 'REF-056',
      awbNumber: 'AWB0012400',
      quantity: 4,
      weight: 3.2,
      serviceType: 'delivery',
      cod: 620,
      valueOfGoods: 700,
      courier: 'Fedex',
      status: 'delivering',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      deliveryAttempts: 2,
      receiverInfo: {
        name: 'Hesham Younes',
        phone: '+205612345678',
        address: '4242 Quseir St',
        area: 'Historic Port',
        city: 'Quseir',
        province: 'Red Sea'
      },
      items: [
        { sku: 'SKU084', description: 'Boat Engine', quantity: 1 },
        { sku: 'SKU085', description: 'Propeller', quantity: 1 },
        { sku: 'SKU086', description: 'Fuel Tank', quantity: 1 },
        { sku: 'SKU087', description: 'Navigation Light', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-04-19'
    },
    {
      id: '57',
      orderNumber: 'ORD-2025-10057',
      referenceNumber: 'REF-057',
      awbNumber: 'AWB0012401',
      quantity: 1,
      weight: 1.1,
      serviceType: 'delivery',
      cod: 250,
      valueOfGoods: 290,
      courier: 'Aramex',
      status: 'delivering',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'paid',
      deliveryAttempts: 3,
      receiverInfo: {
        name: 'Yara Hosam',
        phone: '+205712345678',
        address: '4343 Berenice St',
        area: 'Archaeological',
        city: 'Berenice',
        province: 'Red Sea'
      },
      items: [
        { sku: 'SKU088', description: 'Metal Detector', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-04-18'
    },
    {
      id: '58',
      orderNumber: 'ORD-2025-10058',
      referenceNumber: 'REF-058',
      awbNumber: 'AWB0012402',
      quantity: 2,
      weight: 1.6,
      serviceType: 'delivery',
      cod: 320,
      valueOfGoods: 370,
      courier: 'DHL',
      status: 'delivering',
      paymentMethod: 'ValU',
      paymentStatus: 'partially-paid',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Ayman Adly',
        phone: '+205812345678',
        address: '4444 Shalatein St',
        area: 'Border',
        city: 'Shalatein',
        province: 'Red Sea'
      },
      items: [
        { sku: 'SKU089', description: 'Desert GPS', quantity: 1 },
        { sku: 'SKU090', description: 'Emergency Beacon', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-04-18'
    },
    {
      id: '59',
      orderNumber: 'ORD-2025-10059',
      referenceNumber: 'REF-059',
      awbNumber: 'AWB0012403',
      quantity: 1,
      weight: 0.6,
      serviceType: 'delivery',
      cod: 140,
      valueOfGoods: 170,
      courier: 'Fedex',
      status: 'delivering',
      paymentMethod: 'Cash',
      paymentStatus: 'pending',
      deliveryAttempts: 2,
      receiverInfo: {
        name: 'Rana Magdi',
        phone: '+205912345678',
        address: '4545 Halaib St',
        area: 'Administrative',
        city: 'Halaib',
        province: 'Red Sea'
      },
      items: [
        { sku: 'SKU091', description: 'Border Pass Holder', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-04-17'
    },
    {
      id: '60',
      orderNumber: 'ORD-2025-10060',
      referenceNumber: 'REF-060',
      awbNumber: 'AWB0012404',
      quantity: 3,
      weight: 2.4,
      serviceType: 'delivery',
      cod: 460,
      valueOfGoods: 520,
      courier: 'Aramex',
      status: 'delivering',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Magdy Sobhy',
        phone: '+206012345678',
        address: '4646 Abu Ramad St',
        area: 'Coastal',
        city: 'Abu Ramad',
        province: 'Red Sea'
      },
      items: [
        { sku: 'SKU092', description: 'Coral Study Kit', quantity: 1 },
        { sku: 'SKU093', description: 'Underwater Notebook', quantity: 1 },
        { sku: 'SKU094', description: 'Specimen Container', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-04-17'
    },

    // Delivered Orders (10)
    {
      id: '3',
      orderNumber: 'ORD-2025-10003',
      referenceNumber: 'REF-003',
      awbNumber: 'AWB0012347',
      quantity: 3,
      weight: 2.2,
      serviceType: 'exchange',
      cod: 0,
      valueOfGoods: 450,
      courier: 'DHL',
      status: 'delivered',
      paymentMethod: 'Visa',
      paymentStatus: 'paid',
      deliveryAttempts: 1,
      downPayment: {
        applied: true,
        value: 50
      },
      receiverInfo: {
        name: 'Mohamed Hassan',
        phone: '+201234567890',
        address: '789 Alexandria St',
        area: 'Smouha',
        city: 'Alexandria',
        province: 'Alexandria'
      },
      items: [
        { sku: 'SKU004', description: 'Running Shoes', quantity: 1 },
        { sku: 'SKU005', description: 'Sports Socks', quantity: 2 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-05-05'
    },
    {
      id: '61',
      orderNumber: 'ORD-2025-10061',
      referenceNumber: 'REF-061',
      awbNumber: 'AWB0012405',
      quantity: 1,
      weight: 1.5,
      serviceType: 'delivery',
      cod: 320,
      valueOfGoods: 360,
      courier: 'Aramex',
      status: 'delivered',
      paymentMethod: 'Cash',
      paymentStatus: 'paid',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Ola Tamer',
        phone: '+206112345678',
        address: '4747 Marsa Matruh St',
        area: 'Beach Front',
        city: 'Marsa Matruh',
        province: 'Matruh'
      },
      items: [
        { sku: 'SKU095', description: 'Beach Towel', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-16'
    },
    {
      id: '62',
      orderNumber: 'ORD-2025-10062',
      referenceNumber: 'REF-062',
      awbNumber: 'AWB0012406',
      quantity: 2,
      weight: 1.8,
      serviceType: 'delivery',
      cod: 380,
      valueOfGoods: 430,
      courier: 'DHL',
      status: 'delivered',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      deliveryAttempts: 2,
      receiverInfo: {
        name: 'Nabil Gaber',
        phone: '+206212345678',
        address: '4848 Siwa St',
        area: 'Oasis Center',
        city: 'Siwa',
        province: 'Matruh'
      },
      items: [
        { sku: 'SKU096', description: 'Desert Guide', quantity: 1 },
        { sku: 'SKU097', description: 'Oasis Map', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-16'
    },
    {
      id: '63',
      orderNumber: 'ORD-2025-10063',
      referenceNumber: 'REF-063',
      awbNumber: 'AWB0012407',
      quantity: 1,
      weight: 0.8,
      serviceType: 'delivery',
      cod: 180,
      valueOfGoods: 210,
      courier: 'Fedex',
      status: 'delivered',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'paid',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Sherihan Nour',
        phone: '+206312345678',
        address: '4949 El Alamein St',
        area: 'Memorial Area',
        city: 'El Alamein',
        province: 'Matruh'
      },
      items: [
        { sku: 'SKU098', description: 'History Book', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-15'
    },
    {
      id: '64',
      orderNumber: 'ORD-2025-10064',
      referenceNumber: 'REF-064',
      awbNumber: 'AWB0012408',
      quantity: 3,
      weight: 2.6,
      serviceType: 'delivery',
      cod: 500,
      valueOfGoods: 560,
      courier: 'Aramex',
      status: 'delivered',
      paymentMethod: 'ValU',
      paymentStatus: 'paid',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Essam Fouad',
        phone: '+206412345678',
        address: '5050 Dabaa St',
        area: 'Nuclear Plant',
        city: 'Dabaa',
        province: 'Matruh'
      },
      items: [
        { sku: 'SKU099', description: 'Radiation Detector', quantity: 1 },
        { sku: 'SKU100', description: 'Safety Equipment', quantity: 2 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-15'
    },
    {
      id: '65',
      orderNumber: 'ORD-2025-10065',
      referenceNumber: 'REF-065',
      awbNumber: 'AWB0012409',
      quantity: 1,
      weight: 1.2,
      serviceType: 'delivery',
      cod: 270,
      valueOfGoods: 310,
      courier: 'DHL',
      status: 'delivered',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'paid',
      deliveryAttempts: 3,
      receiverInfo: {
        name: 'Layla Farouk',
        phone: '+206512345678',
        address: '5151 Barani St',
        area: 'Desert Area',
        city: 'Barani',
        province: 'Matruh'
      },
      items: [
        { sku: 'SKU101', description: 'Desert Survival Kit', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-14'
    },
    {
      id: '66',
      orderNumber: 'ORD-2025-10066',
      referenceNumber: 'REF-066',
      awbNumber: 'AWB0012410',
      quantity: 2,
      weight: 1.7,
      serviceType: 'delivery',
      cod: 350,
      valueOfGoods: 400,
      courier: 'Fedex',
      status: 'delivered',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Ashraf Helmi',
        phone: '+206612345678',
        address: '5252 Salloum St',
        area: 'Border Crossing',
        city: 'Salloum',
        province: 'Matruh'
      },
      items: [
        { sku: 'SKU102', description: 'Travel Documents Holder', quantity: 1 },
        { sku: 'SKU103', description: 'Currency Exchanger', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-14'
    },
    {
      id: '67',
      orderNumber: 'ORD-2025-10067',
      referenceNumber: 'REF-067',
      awbNumber: 'AWB0012411',
      quantity: 1,
      weight: 2.9,
      serviceType: 'delivery',
      cod: 540,
      valueOfGoods: 600,
      courier: 'Aramex',
      status: 'delivered',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'paid',
      deliveryAttempts: 2,
      receiverInfo: {
        name: 'Reem Samir',
        phone: '+206712345678',
        address: '5353 Sidi Abdel Rahman St',
        area: 'Resort Area',
        city: 'Sidi Abdel Rahman',
        province: 'Matruh'
      },
      items: [
        { sku: 'SKU104', description: 'Resort Equipment', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-13'
    },
    {
      id: '68',
      orderNumber: 'ORD-2025-10068',
      referenceNumber: 'REF-068',
      awbNumber: 'AWB0012412',
      quantity: 4,
      weight: 3.1,
      serviceType: 'delivery',
      cod: 600,
      valueOfGoods: 680,
      courier: 'DHL',
      status: 'delivered',
      paymentMethod: 'ValU',
      paymentStatus: 'paid',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Osama Rashad',
        phone: '+206812345678',
        address: '5454 Ras El Hekma St',
        area: 'Development Area',
        city: 'Ras El Hekma',
        province: 'Matruh'
      },
      items: [
        { sku: 'SKU105', description: 'Construction Tools', quantity: 2 },
        { sku: 'SKU106', description: 'Measuring Equipment', quantity: 1 },
        { sku: 'SKU107', description: 'Safety Gear', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-13'
    },
    {
      id: '69',
      orderNumber: 'ORD-2025-10069',
      referenceNumber: 'REF-069',
      awbNumber: 'AWB0012413',
      quantity: 1,
      weight: 0.5,
      serviceType: 'delivery',
      cod: 120,
      valueOfGoods: 150,
      courier: 'Fedex',
      status: 'delivered',
      paymentMethod: 'Cash',
      paymentStatus: 'paid',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Menna Atef',
        phone: '+206912345678',
        address: '5555 Marina St',
        area: 'Marina Area',
        city: 'Marina',
        province: 'Matruh'
      },
      items: [
        { sku: 'SKU108', description: 'Beach Accessories', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-04-12'
    },

    // Returning Orders (10)
    {
      id: '71',
      orderNumber: 'ORD-2025-10071',
      referenceNumber: 'REF-071',
      awbNumber: 'AWB0012415',
      quantity: 1,
      weight: 1.4,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 280,
      courier: 'Aramex',
      status: 'returning',
      paymentMethod: 'Credit Card',
      paymentStatus: 'refunded',
      deliveryAttempts: 2,
      receiverInfo: {
        name: 'Walid Shaker',
        phone: '+207112345678',
        address: '5656 Fayoum St',
        area: 'City Center',
        city: 'Fayoum',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU109', description: 'Defective Watch', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-11'
    },
    {
      id: '72',
      orderNumber: 'ORD-2025-10072',
      referenceNumber: 'REF-072',
      awbNumber: 'AWB0012416',
      quantity: 2,
      weight: 1.9,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 360,
      courier: 'DHL',
      status: 'returning',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'refunded',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Nagwa Salem',
        phone: '+207212345678',
        address: '5757 Tamiya St',
        area: 'Rural Area',
        city: 'Tamiya',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU110', description: 'Wrong Size Shoes', quantity: 2 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-11'
    },
    {
      id: '73',
      orderNumber: 'ORD-2025-10073',
      referenceNumber: 'REF-073',
      awbNumber: 'AWB0012417',
      quantity: 1,
      weight: 2.3,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 450,
      courier: 'Fedex',
      status: 'returning',
      paymentMethod: 'ValU',
      paymentStatus: 'pending',
      deliveryAttempts: 3,
      receiverInfo: {
        name: 'Ihab Lotfy',
        phone: '+207312345678',
        address: '5858 Sinnuris St',
        area: 'Agricultural',
        city: 'Sinnuris',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU111', description: 'Damaged Blender', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-10'
    },
    {
      id: '74',
      orderNumber: 'ORD-2025-10074',
      referenceNumber: 'REF-074',
      awbNumber: 'AWB0012418',
      quantity: 3,
      weight: 2.1,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 520,
      courier: 'Aramex',
      status: 'returning',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'refunded',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Sawsan Kamel',
        phone: '+207412345678',
        address: '5959 Itsa St',
        area: 'Market Area',
        city: 'Itsa',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU112', description: 'Incorrect Order Items', quantity: 3 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-10'
    },
    {
      id: '75',
      orderNumber: 'ORD-2025-10075',
      referenceNumber: 'REF-075',
      awbNumber: 'AWB0012419',
      quantity: 1,
      weight: 0.7,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 150,
      courier: 'DHL',
      status: 'returning',
      paymentMethod: 'Credit Card',
      paymentStatus: 'refunded',
      deliveryAttempts: 4,
      receiverInfo: {
        name: 'Magdy Amin',
        phone: '+207512345678',
        address: '6060 Yusuf El Seddik St',
        area: 'Residential',
        city: 'Yusuf El Seddik',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU113', description: 'Faulty Charger', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-09'
    },
    {
      id: '76',
      orderNumber: 'ORD-2025-10076',
      referenceNumber: 'REF-076',
      awbNumber: 'AWB0012420',
      quantity: 2,
      weight: 1.6,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 320,
      courier: 'Fedex',
      status: 'returning',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'pending',
      deliveryAttempts: 2,
      receiverInfo: {
        name: 'Azza Mahmoud',
        phone: '+207612345678',
        address: '6161 Ibshaway St',
        area: 'Town Center',
        city: 'Ibshaway',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU114', description: 'Unwanted Purchase', quantity: 2 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-09'
    },
    {
      id: '77',
      orderNumber: 'ORD-2025-10077',
      referenceNumber: 'REF-077',
      awbNumber: 'AWB0012421',
      quantity: 1,
      weight: 2.8,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 540,
      courier: 'Aramex',
      status: 'returning',
      paymentMethod: 'ValU',
      paymentStatus: 'refunded',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Farouk Zidan',
        phone: '+207712345678',
        address: '6262 Seila St',
        area: 'Outskirts',
        city: 'Seila',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU115', description: 'Quality Issue Product', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-08'
    },
    {
      id: '78',
      orderNumber: 'ORD-2025-10078',
      referenceNumber: 'REF-078',
      awbNumber: 'AWB0012422',
      quantity: 4,
      weight: 3.2,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 680,
      courier: 'DHL',
      status: 'returning',
      paymentMethod: 'Cash',
      paymentStatus: 'pending',
      deliveryAttempts: 3,
      receiverInfo: {
        name: 'Soheir Farid',
        phone: '+207812345678',
        address: '6363 Qasr Qaroun St',
        area: 'Lake Area',
        city: 'Qasr Qaroun',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU116', description: 'Bulk Return Items', quantity: 4 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-08'
    },
    {
      id: '79',
      orderNumber: 'ORD-2025-10079',
      referenceNumber: 'REF-079',
      awbNumber: 'AWB0012423',
      quantity: 1,
      weight: 1.3,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 260,
      courier: 'Fedex',
      status: 'returning',
      paymentMethod: 'Credit Card',
      paymentStatus: 'refunded',
      deliveryAttempts: 2,
      receiverInfo: {
        name: 'Mahmoud Shawky',
        phone: '+207912345678',
        address: '6464 Tunis St',
        area: 'Village Center',
        city: 'Tunis',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU117', description: 'Changed Mind Item', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-07'
    },
    {
      id: '80',
      orderNumber: 'ORD-2025-10080',
      referenceNumber: 'REF-080',
      awbNumber: 'AWB0012424',
      quantity: 2,
      weight: 1.8,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 380,
      courier: 'Aramex',
      status: 'returning',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'pending',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Hanaa Tawfik',
        phone: '+208012345678',
        address: '6565 Hawar St',
        area: 'Desert Edge',
        city: 'Hawar',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU118', description: 'Duplicate Order', quantity: 2 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-07'
    },

    // Returned Orders (10)
    {
      id: '81',
      orderNumber: 'ORD-2025-10081',
      referenceNumber: 'REF-081',
      awbNumber: 'AWB0012425',
      quantity: 1,
      weight: 1.1,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 230,
      courier: 'Aramex',
      status: 'returned',
      paymentMethod: 'Cash',
      paymentStatus: 'refunded',
      deliveryAttempts: 5,
      receiverInfo: {
        name: 'Gamal Hosny',
        phone: '+208112345678',
        address: '6666 Kom Oshim St',
        area: 'Archaeological',
        city: 'Kom Oshim',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU119', description: 'Returned Electronics', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-06'
    },
    {
      id: '82',
      orderNumber: 'ORD-2025-10082',
      referenceNumber: 'REF-082',
      awbNumber: 'AWB0012426',
      quantity: 3,
      weight: 2.4,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 480,
      courier: 'DHL',
      status: 'returned',
      paymentMethod: 'Credit Card',
      paymentStatus: 'refunded',
      deliveryAttempts: 3,
      receiverInfo: {
        name: 'Nadia Farag',
        phone: '+208212345678',
        address: '6767 Wadi El Ryan St',
        area: 'Protected Area',
        city: 'Wadi El Ryan',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU120', description: 'Nature Equipment', quantity: 3 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-06'
    },
    {
      id: '83',
      orderNumber: 'ORD-2025-10083',
      referenceNumber: 'REF-083',
      awbNumber: 'AWB0012427',
      quantity: 1,
      weight: 0.9,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 180,
      courier: 'Fedex',
      status: 'returned',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'refunded',
      deliveryAttempts: 4,
      receiverInfo: {
        name: 'Saad Abdel Aziz',
        phone: '+208312345678',
        address: '6868 Lahun St',
        area: 'Historical',
        city: 'Lahun',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU121', description: 'Returned Accessory', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-05'
    },
    {
      id: '84',
      orderNumber: 'ORD-2025-10084',
      referenceNumber: 'REF-084',
      awbNumber: 'AWB0012428',
      quantity: 2,
      weight: 1.7,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 340,
      courier: 'Aramex',
      status: 'returned',
      paymentMethod: 'ValU',
      paymentStatus: 'refunded',
      deliveryAttempts: 2,
      receiverInfo: {
        name: 'Sanaa Morsi',
        phone: '+208412345678',
        address: '6969 Medinet Madi St',
        area: 'Ancient Site',
        city: 'Medinet Madi',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU122', description: 'Archaeological Tools', quantity: 2 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-05'
    },
    {
      id: '85',
      orderNumber: 'ORD-2025-10085',
      referenceNumber: 'REF-085',
      awbNumber: 'AWB0012429',
      quantity: 1,
      weight: 2.5,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 500,
      courier: 'DHL',
      status: 'returned',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'refunded',
      deliveryAttempts: 6,
      receiverInfo: {
        name: 'Emad Safwat',
        phone: '+208512345678',
        address: '7070 Hawara St',
        area: 'Pyramid Area',
        city: 'Hawara',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU123', description: 'Heavy Returned Item', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-04'
    },
    {
      id: '86',
      orderNumber: 'ORD-2025-10086',
      referenceNumber: 'REF-086',
      awbNumber: 'AWB0012430',
      quantity: 4,
      weight: 3.1,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 620,
      courier: 'Fedex',
      status: 'returned',
      paymentMethod: 'Credit Card',
      paymentStatus: 'refunded',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Zeinab Abdel Hamid',
        phone: '+208612345678',
        address: '7171 Biahmu St',
        area: 'Ancient Ruins',
        city: 'Biahmu',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU124', description: 'Bulk Returned Items', quantity: 4 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-04'
    },
    {
      id: '87',
      orderNumber: 'ORD-2025-10087',
      referenceNumber: 'REF-087',
      awbNumber: 'AWB0012431',
      quantity: 1,
      weight: 1.4,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 280,
      courier: 'Aramex',
      status: 'returned',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'refunded',
      deliveryAttempts: 3,
      receiverInfo: {
        name: 'Hussain Fahmy',
        phone: '+208712345678',
        address: '7272 Karanis St',
        area: 'Archaeological Site',
        city: 'Karanis',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU125', description: 'Research Equipment', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-03'
    },
    {
      id: '88',
      orderNumber: 'ORD-2025-10088',
      referenceNumber: 'REF-088',
      awbNumber: 'AWB0012432',
      quantity: 2,
      weight: 1.9,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 380,
      courier: 'DHL',
      status: 'returned',
      paymentMethod: 'ValU',
      paymentStatus: 'refunded',
      deliveryAttempts: 4,
      receiverInfo: {
        name: 'Leila Shams',
        phone: '+208812345678',
        address: '7373 Dimeh St',
        area: 'Lake Side',
        city: 'Dimeh',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU126', description: 'Marine Research Tools', quantity: 2 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-03'
    },
    {
      id: '89',
      orderNumber: 'ORD-2025-10089',  
      referenceNumber: 'REF-089',
      awbNumber: 'AWB0012433',
      quantity: 1,
      weight: 0.6,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 140,
      courier: 'Fedex',
      status: 'returned',
      paymentMethod: 'Cash',
      paymentStatus: 'refunded',
      deliveryAttempts: 5,
      receiverInfo: {
        name: 'Rashad Gomaa',
        phone: '+208912345678',
        address: '7474 Tebtunis St',
        area: 'Excavation Site',
        city: 'Tebtunis',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU127', description: 'Small Artifact', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-02'
    },
    {
      id: '90',
      orderNumber: 'ORD-2025-10090',
      referenceNumber: 'REF-090',
      awbNumber: 'AWB0012434',
      quantity: 3,
      weight: 2.6,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 520,
      courier: 'Aramex',
      status: 'returned',
      paymentMethod: 'Credit Card',
      paymentStatus: 'refunded',
      deliveryAttempts: 2,
      receiverInfo: {
        name: 'Khadija Nabil',
        phone: '+209012345678',
        address: '7575 Soknopaiou Nesos St',
        area: 'Remote Site',
        city: 'Soknopaiou Nesos',
        province: 'Fayoum'
      },
      items: [
        { sku: 'SKU128', description: 'Remote Area Equipment', quantity: 3 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-04-02'
    },

    // Canceled Orders (10)
    {
      id: '91',
      orderNumber: 'ORD-2025-10091',
      referenceNumber: 'REF-091',
      awbNumber: 'AWB0012435',
      quantity: 1,
      weight: 1.2,
      serviceType: 'delivery',
      cod: 250,
      valueOfGoods: 290,
      status: 'canceled',
      paymentMethod: 'Cash',
      paymentStatus: 'failed',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Amgad Soliman',
        phone: '+209112345678',
        address: '7676 New Valley St',
        area: 'Oasis Area',
        city: 'Kharga',
        province: 'New Valley'
      },
      items: [
        { sku: 'SKU129', description: 'Canceled Item', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-04-01'
    },
    {
      id: '92',
      orderNumber: 'ORD-2025-10092',
      referenceNumber: 'REF-092',
      awbNumber: 'AWB0012436',
      quantity: 2,
      weight: 1.8,
      serviceType: 'delivery',
      cod: 360,
      valueOfGoods: 410,
      status: 'canceled',
      paymentMethod: 'Credit Card',
      paymentStatus: 'failed',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Nour Hamdi',
        phone: '+209212345678',
        address: '7777 Dakhla St',
        area: 'Oasis Center',
        city: 'Dakhla',
        province: 'New Valley'
      },
      items: [
        { sku: 'SKU130', description: 'Oasis Supplies', quantity: 2 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-04-01'
    },
    {
      id: '93',
      orderNumber: 'ORD-2025-10093',
      referenceNumber: 'REF-093',
      awbNumber: 'AWB0012437',
      quantity: 1,
      weight: 0.8,
      serviceType: 'delivery',
      cod: 180,
      valueOfGoods: 220,
      status: 'canceled',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'failed',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Yusra Abdel Rahman',
        phone: '+209312345678',
        address: '7878 Farafra St',
        area: 'White Desert',
        city: 'Farafra',
        province: 'New Valley'
      },
      items: [
        { sku: 'SKU131', description: 'Desert Equipment', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-03-31'
    },
    {
      id: '94',
      orderNumber: 'ORD-2025-10094',
      referenceNumber: 'REF-094',
      awbNumber: 'AWB0012438',
      quantity: 3,
      weight: 2.3,
      serviceType: 'delivery',
      cod: 460,
      valueOfGoods: 520,
      status: 'canceled',
      paymentMethod: 'ValU',
      paymentStatus: 'failed',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Hazem Shehata',
        phone: '+209412345678',
        address: '7979 Bahariya St',
        area: 'Oasis Town',
        city: 'Bahariya',
        province: 'New Valley'
      },
      items: [
        { sku: 'SKU132', description: 'Oasis Tools', quantity: 3 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-03-31'
    },
    {
      id: '95',
      orderNumber: 'ORD-2025-10095',
      referenceNumber: 'REF-095',
      awbNumber: 'AWB0012439',
      quantity: 1,
      weight: 2.1,
      serviceType: 'delivery',
      cod: 420,
      valueOfGoods: 480,
      status: 'canceled',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'failed',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Hala Karim',
        phone: '+209512345678',
        address: '8080 Siwa St',
        area: 'Salt Lakes',
        city: 'Siwa',
        province: 'New Valley'
      },
      items: [
        { sku: 'SKU133', description: 'Salt Production Equipment', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-03-30'
    },
    {
      id: '96',
      orderNumber: 'ORD-2025-10096',
      referenceNumber: 'REF-096',
      awbNumber: 'AWB0012440',
      quantity: 2,
      weight: 1.6,
      serviceType: 'delivery',
      cod: 320,
      valueOfGoods: 370,
      status: 'canceled',
      paymentMethod: 'Credit Card',
      paymentStatus: 'failed',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Adham Fekry',
        phone: '+209612345678',
        address: '8181 Mut St',
        area: 'Administrative Capital',
        city: 'Mut',
        province: 'New Valley'
      },
      items: [
        { sku: 'SKU134', description: 'Office Supplies', quantity: 2 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-03-30'
    },
    {
      id: '97',
      orderNumber: 'ORD-2025-10097',
      referenceNumber: 'REF-097',
      awbNumber: 'AWB0012441',
      quantity: 1,
      weight: 1.4,
      serviceType: 'delivery',
      cod: 300,
      valueOfGoods: 340,
      status: 'canceled',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'failed',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Safaa El Deeb',
        phone: '+209712345678',
        address: '8282 El Qasr St',
        area: 'Historical Quarter',
        city: 'El Qasr',
        province: 'New Valley'
      },
      items: [
        { sku: 'SKU135', description: 'Historical Research', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-03-29'
    },
    {
      id: '98',
      orderNumber: 'ORD-2025-10098',
      referenceNumber: 'REF-098',
      awbNumber: 'AWB0012442',
      quantity: 4,
      weight: 3.2,
      serviceType: 'delivery',
      cod: 640,
      valueOfGoods: 720,
      status: 'canceled',
      paymentMethod: 'ValU',
      paymentStatus: 'failed',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Tharwat Gad',
        phone: '+209812345678',
        address: '8383 Balat St',
        area: 'Old Town',
        city: 'Balat',
        province: 'New Valley'
      },
      items: [
        { sku: 'SKU136', description: 'Construction Materials', quantity: 4 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-03-29'
    },
    {
      id: '99',
      orderNumber: 'ORD-2025-10099',
      referenceNumber: 'REF-099',
      awbNumber: 'AWB0012443',
      quantity: 1,
      weight: 0.7,
      serviceType: 'delivery',
      cod: 160,
      valueOfGoods: 190,
      status: 'canceled',
      paymentMethod: 'Cash',
      paymentStatus: 'failed',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Nesreen Zayed',
        phone: '+209912345678',
        address: '8484 Rashda St',
        area: 'Village Center',
        city: 'Rashda',
        province: 'New Valley'
      },
      items: [
        { sku: 'SKU137', description: 'Village Supplies', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-03-28'
    },
    {
      id: '100',
      orderNumber: 'ORD-2025-10100',
      referenceNumber: 'REF-100',
      awbNumber: 'AWB0012444',
      quantity: 2,
      weight: 1.9,
      serviceType: 'delivery',
      cod: 380,
      valueOfGoods: 430,
      status: 'canceled',
      paymentMethod: 'Credit Card',
      paymentStatus: 'failed',
      deliveryAttempts: 0,
      receiverInfo: {
        name: 'Wafaa Ismail',
        phone: '+210012345678',
        address: '8585 Sheikh Moftah St',
        area: 'Remote Area',
        city: 'Sheikh Moftah',
        province: 'New Valley'
      },
      items: [
        { sku: 'SKU138', description: 'Remote Communication', quantity: 2 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-03-28'
    },

    // Pending Refund Orders (10)
    {
      id: '4',
      orderNumber: 'ORD-2025-10004',
      referenceNumber: 'REF-004',
      awbNumber: 'AWB0012348',
      quantity: 1,
      weight: 3.0,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 200,
      status: 'pending-refund',
      paymentMethod: 'ValU',
      paymentStatus: 'partially-paid',
      deliveryAttempts: 3,
      downPayment: {
        applied: true,
        value: 75
      },
      receiverInfo: {
        name: 'Nour Ibrahim',
        phone: '+201345678901',
        address: '101 El Mansoura St',
        area: 'Mansoura',
        city: 'Mansoura',
        province: 'Dakahlia'
      },
      items: [
        { sku: 'SKU006', description: 'Blender', quantity: 1 }
      ],
      warehouse: 'Mansoura Branch',
      createdAt: '2025-05-04'
    },
    {
      id: '101',
      orderNumber: 'ORD-2025-10101',
      referenceNumber: 'REF-101',
      awbNumber: 'AWB0012445',
      quantity: 1,
      weight: 1.5,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 320,
      status: 'pending-refund',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      deliveryAttempts: 2,
      receiverInfo: {
        name: 'Kareem Shady',
        phone: '+210112345678',
        address: '8686 Damanhour St',
        area: 'City Center',
        city: 'Damanhour',
        province: 'Beheira'
      },
      items: [
        { sku: 'SKU139', description: 'Defective Product', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-03-27'
    },
    {
      id: '102',
      orderNumber: 'ORD-2025-10102',
      referenceNumber: 'REF-102',
      awbNumber: 'AWB0012446',
      quantity: 2,
      weight: 2.2,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 440,
      status: 'pending-refund',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'paid',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Laila Rashed',
        phone: '+210212345678',
        address: '8787 Kafr El Dawar St',
        area: 'Industrial',
        city: 'Kafr El Dawar',
        province: 'Beheira'
      },
      items: [
        { sku: 'SKU140', description: 'Industrial Equipment', quantity: 2 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-03-27'
    },
    {
      id: '103',
      orderNumber: 'ORD-2025-10103',
      referenceNumber: 'REF-103',
      awbNumber: 'AWB0012447',
      quantity: 1,
      weight: 0.9,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 190,
      status: 'pending-refund',
      paymentMethod: 'ValU',
      paymentStatus: 'partially-paid',
      deliveryAttempts: 4,
      receiverInfo: {
        name: 'Samir Wahba',
        phone: '+210312345678',
        address: '8888 Rashid St',
        area: 'Historic Port',
        city: 'Rashid',
        province: 'Beheira'
      },
      items: [
        { sku: 'SKU141', description: 'Historical Item', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-03-26'
    },
    {
      id: '104',
      orderNumber: 'ORD-2025-10104',
      referenceNumber: 'REF-104',
      awbNumber: 'AWB0012448',
      quantity: 3,
      weight: 2.7,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 540,
      status: 'pending-refund',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'paid',
      deliveryAttempts: 2,
      receiverInfo: {
        name: 'Hisham Abdel Aal',
        phone: '+210412345678',
        address: '8989 Edko St',
        area: 'Lake Area',
        city: 'Edko',
        province: 'Beheira'
      },
      items: [
        { sku: 'SKU142', description: 'Lake Equipment', quantity: 3 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-03-26'
    },
    {
      id: '105',
      orderNumber: 'ORD-2025-10105',
      referenceNumber: 'REF-105',
      awbNumber: 'AWB0012449',
      quantity: 1,
      weight: 1.3,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 280,
      status: 'pending-refund',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      deliveryAttempts: 3,
      receiverInfo: {
        name: 'Mona Helmy',
        phone: '+210512345678',
        address: '9090 Abu Hummus St',
        area: 'Agricultural',
        city: 'Abu Hummus',
        province: 'Beheira'
      },
      items: [
        { sku: 'SKU143', description: 'Agricultural Tool', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-03-25'
    },
    {
      id: '106',
      orderNumber: 'ORD-2025-10106',
      referenceNumber: 'REF-106',
      awbNumber: 'AWB0012450',
      quantity: 2,
      weight: 1.8,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 380,
      status: 'pending-refund',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'paid',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Nagwan Zaki',
        phone: '+210612345678',
        address: '9191 Delengat St',
        area: 'Town Center',
        city: 'Delengat',
        province: 'Beheira'
      },
      items: [
        { sku: 'SKU144', description: 'Town Supplies', quantity: 2 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-03-25'
    },
    {
      id: '107',
      orderNumber: 'ORD-2025-10107',
      referenceNumber: 'REF-107',
      awbNumber: 'AWB0012451',
      quantity: 1,
      weight: 2.4,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 480,
      status: 'pending-refund',
      paymentMethod: 'ValU',
      paymentStatus: 'partially-paid',
      deliveryAttempts: 5,
      receiverInfo: {
        name: 'Rania Badawi',
        phone: '+210712345678',
        address: '9292 Kom Hamada St',
        area: 'Rural Area',
        city: 'Kom Hamada',
        province: 'Beheira'
      },
      items: [
        { sku: 'SKU145', description: 'Rural Equipment', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-03-24'
    },
    {
      id: '108',
      orderNumber: 'ORD-2025-10108',
      referenceNumber: 'REF-108',
      awbNumber: 'AWB0012452',
      quantity: 4,
      weight: 3.5,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 700,
      status: 'pending-refund',
      paymentMethod: 'Cash',
      paymentStatus: 'paid',
      deliveryAttempts: 2,
      receiverInfo: {
        name: 'Ehab Samy',
        phone: '+210812345678',
        address: '9393 Badr St',
        area: 'New Development',
        city: 'Badr',
        province: 'Beheira'
      },
      items: [
        { sku: 'SKU146', description: 'Development Tools', quantity: 4 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-03-24'
    },
    {
      id: '109',
      orderNumber: 'ORD-2025-10109',
      referenceNumber: 'REF-109',
      awbNumber: 'AWB0012453',
      quantity: 1,
      weight: 1.1,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 240,
      status: 'pending-refund',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      deliveryAttempts: 3,
      receiverInfo: {
        name: 'Amany Darwish',
        phone: '+210912345678',
        address: '9494 Wadi El Natrun St',
        area: 'Monastery Area',
        city: 'Wadi El Natrun',
        province: 'Beheira'
      },
      items: [
        { sku: 'SKU147', description: 'Religious Item', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-03-23'
    },

    // Refunded Orders (10)
    {
      id: '5',
      orderNumber: 'ORD-2025-10005',
      referenceNumber: 'REF-005',
      awbNumber: 'AWB0012349',
      quantity: 2,
      weight: 1.0,
      serviceType: 'delivery',
      cod: 0,
      valueOfGoods: 350,
      courier: 'Aramex',
      status: 'refunded',
      paymentMethod: 'Credit Card',
      paymentStatus: 'refunded',
      deliveryAttempts: 5,
      discountCode: {
        code: 'WELCOME20',
        value: 70
      },
      receiverInfo: {
        name: 'Amir Salah',
        phone: '+201456789012',
        address: '202 Luxor St',
        area: 'Downtown',
        city: 'Luxor',
        province: 'Luxor'
      },
      items: [
        { sku: 'SKU007', description: 'Wireless Headphones', quantity: 1 },
        { sku: 'SKU008', description: 'USB Cable', quantity: 1 }
      ],
      warehouse: 'Upper Egypt Branch',
      createdAt: '2025-05-03'
    },
    {
      id: '110',
      orderNumber: 'ORD-2025-10110',
      referenceNumber: 'REF-110',
      awbNumber: 'AWB0012454',
      quantity: 1,
      weight: 1.6,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 340,
      courier: 'DHL',
      status: 'refunded',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'refunded',
      deliveryAttempts: 2,
      receiverInfo: {
        name: 'Salam Hosni',
        phone: '+211012345678',
        address: '9595 Itay El Baroud St',
        area: 'Market Area',
        city: 'Itay El Baroud',
        province: 'Beheira'
      },
      items: [
        { sku: 'SKU148', description: 'Market Equipment', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-03-23'
    },
    {
      id: '111',
      orderNumber: 'ORD-2025-10111',
      referenceNumber: 'REF-111',
      awbNumber: 'AWB0012455',
      quantity: 3,
      weight: 2.8,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 560,
      courier: 'Fedex',
      status: 'refunded',
      paymentMethod: 'ValU',
      paymentStatus: 'refunded',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Ghada Farag',
        phone: '+211112345678',
        address: '9696 Shubrakhit St',
        area: 'Textile Area',
        city: 'Shubrakhit',
        province: 'Beheira'
      },
      items: [
        { sku: 'SKU149', description: 'Textile Equipment', quantity: 3 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-03-22'
    },
    {
      id: '112',
      orderNumber: 'ORD-2025-10112',
      referenceNumber: 'REF-112',
      awbNumber: 'AWB0012456',
      quantity: 1,
      weight: 0.8,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 180,
      courier: 'Aramex',
      status: 'refunded',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'refunded',
      deliveryAttempts: 4,
      receiverInfo: {
        name: 'Adel Mansour',
        phone: '+211212345678',
        address: '9797 Housh Eissa St',
        area: 'Village',
        city: 'Housh Eissa',
        province: 'Beheira'
      },
      items: [
        { sku: 'SKU150', description: 'Village Tool', quantity: 1 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-03-22'
    },
    {
      id: '113',
      orderNumber: 'ORD-2025-10113',
      referenceNumber: 'REF-113',
      awbNumber: 'AWB0012457',
      quantity: 2,
      weight: 2.1,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 420,
      courier: 'DHL',
      status: 'refunded',
      paymentMethod: 'Credit Card',
      paymentStatus: 'refunded',
      deliveryAttempts: 3,
      receiverInfo: {
        name: 'Zeinab Farouk',
        phone: '+211312345678',
        address: '9898 Mahmoudiyah St',
        area: 'Canal Area',
        city: 'Mahmoudiyah',
        province: 'Beheira'
      },
      items: [
        { sku: 'SKU151', description: 'Canal Equipment', quantity: 2 }
      ],
      warehouse: 'Alexandria Branch',
      createdAt: '2025-03-21'
    },
    {
      id: '114',
      orderNumber: 'ORD-2025-10114',
      referenceNumber: 'REF-114',
      awbNumber: 'AWB0012458',
      quantity: 1,
      weight: 1.4,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 300,
      courier: 'Fedex',
      status: 'refunded',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'refunded',
      deliveryAttempts: 2,
      receiverInfo: {
        name: 'Mahmoud Yasser',
        phone: '+211412345678',
        address: '9999 El Khatatba St',
        area: 'Railway Area',
        city: 'El Khatatba',
        province: 'Monufia'
      },
      items: [
        { sku: 'SKU152', description: 'Railway Equipment', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-03-21'
    },
    {
      id: '115',
      orderNumber: 'ORD-2025-10115',
      referenceNumber: 'REF-115',
      awbNumber: 'AWB0012459',
      quantity: 4,
      weight: 3.3,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 660,
      courier: 'Aramex',
      status: 'refunded',
      paymentMethod: 'ValU',
      paymentStatus: 'refunded',
      deliveryAttempts: 1,
      receiverInfo: {
        name: 'Hanan Abdel Latif',
        phone: '+211512345678',
        address: '10101 Shibin El Kom St',
        area: 'Capital',
        city: 'Shibin El Kom',
        province: 'Monufia'
      },
      items: [
        { sku: 'SKU153', description: 'Capital Equipment', quantity: 4 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-03-20'
    },
    {
      id: '116',
      orderNumber: 'ORD-2025-10116',
      referenceNumber: 'REF-116',
      awbNumber: 'AWB0012460',
      quantity: 1,
      weight: 1.0,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 220,
      courier: 'DHL',
      status: 'refunded',
      paymentMethod: 'Cash',
      paymentStatus: 'refunded',
      deliveryAttempts: 5,
      receiverInfo: {
        name: 'Khaled Refaat',
        phone: '+211612345678',
        address: '10202 Menouf St',
        area: 'Agricultural Center',
        city: 'Menouf',
        province: 'Monufia'
      },
      items: [
        { sku: 'SKU154', description: 'Agricultural Equipment', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-03-20'
    },
    {
      id: '117',
      orderNumber: 'ORD-2025-10117',
      referenceNumber: 'REF-117',
      awbNumber: 'AWB0012461',
      quantity: 2,
      weight: 1.9,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 400,
      courier: 'Fedex',
      status: 'refunded',
      paymentMethod: 'Credit Card',
      paymentStatus: 'refunded',
      deliveryAttempts: 2,
      receiverInfo: {
        name: 'Shereen Ghanem',
        phone: '+211712345678',
        address: '10303 Ashmoun St',
        area: 'Historic Area',
        city: 'Ashmoun',
        province: 'Monufia'
      },
      items: [
        { sku: 'SKU155', description: 'Historic Research', quantity: 2 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-03-19'
    },
    {
      id: '118',
      orderNumber: 'ORD-2025-10118',
      referenceNumber: 'REF-118',
      awbNumber: 'AWB0012462',
      quantity: 1,
      weight: 2.5,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 520,
      courier: 'Aramex',
      status: 'refunded',
      paymentMethod: 'Vodafone Cash',
      paymentStatus: 'refunded',
      deliveryAttempts: 3,
      receiverInfo: {
        name: 'Ahmed Lutfi',
        phone: '+211812345678',
        address: '10404 Quesna St',
        area: 'Industrial Zone',
        city: 'Quesna',
        province: 'Monufia'
      },
      items: [
        { sku: 'SKU156', description: 'Industrial Machine', quantity: 1 }
      ],
      warehouse: 'Cairo Main',
      createdAt: '2025-03-19'
    }
  ];

  // Mock data for filter dropdowns
  const warehouses = ['All Warehouses', 'Cairo Main', 'Giza Branch', 'Alexandria Branch', 'Mansoura Branch', 'Upper Egypt Branch'];
  const courierCompanies = ['All Couriers', 'Aramex', 'DHL', 'Fedex', 'UPS', 'Egypt Post'];
  const paymentMethods = ['All Methods', 'Cash', 'Cash on Delivery', 'Credit Card', 'Vodafone Cash', 'ValU'];
  const cities = ['All Cities', 'Cairo', 'Alexandria', 'Giza', 'Luxor', 'Mansoura', 'Aswan', 'Port Said', 'Suez'];

  // Status tabs with updated counts (10 for each)
  const statusTabs: StatusTab[] = [
    { id: 'all', label: 'All', count: sampleOrders.length },
    { 
      id: 'pending', 
      label: 'Pending Orders', 
      tooltip: 'Not Audited Yet – Awaiting Customer Service Confirmation',
      count: sampleOrders.filter(order => order.status === 'pending').length 
    },
    { 
      id: 'confirmed', 
      label: 'Confirmed/Approved', 
      tooltip: 'Audited by CS – You Can Assign a Courier, Print AWB & Invoice',
      count: sampleOrders.filter(order => order.status === 'confirmed').length 
    },
    { 
      id: 'dispatched', 
      label: 'Dispatched', 
      tooltip: 'You Can Request Pickup from Tredo Ops + Courier',
      count: sampleOrders.filter(order => ['dispatched', 'dispatched-request'].includes(order.status)).length 
    },
    { 
      id: 'picked-up', 
      label: 'Picked-Up', 
      count: sampleOrders.filter(order => order.status === 'picked-up').length 
    },
    { 
      id: 'delivering', 
      label: 'Delivering', 
      count: sampleOrders.filter(order => order.status === 'delivering').length 
    },
    { 
      id: 'delivered', 
      label: 'Delivered - Signed', 
      count: sampleOrders.filter(order => order.status === 'delivered').length 
    },
    { 
      id: 'returning', 
      label: 'Returning', 
      count: sampleOrders.filter(order => order.status === 'returning').length 
    },
    { 
      id: 'returned', 
      label: 'Returned', 
      count: sampleOrders.filter(order => order.status === 'returned').length 
    },
    { 
      id: 'canceled', 
      label: 'Canceled', 
      tooltip: 'Canceled Before Pickup',
      count: sampleOrders.filter(order => order.status === 'canceled').length 
    },
    { 
      id: 'pending-refund', 
      label: 'Pending Refund', 
      count: sampleOrders.filter(order => order.status === 'pending-refund').length 
    },
    { 
      id: 'refunded', 
      label: 'Refunded', 
      count: sampleOrders.filter(order => order.status === 'refunded').length 
    }
  ];

  // Filtered orders based on active tab and search filters
  const filteredOrders = React.useMemo(() => {
    return sampleOrders
      .filter(order => {
        // Filter by status tab
        if (activeTab !== 'all') {
          if (activeTab === 'dispatched' && !['dispatched', 'dispatched-request'].includes(order.status)) {
            return false;
          } else if (activeTab !== 'dispatched' && order.status !== activeTab) {
            return false;
          }
        }
        
        // Global search filter
        if (globalSearchTerm) {
          const searchableValues = [
            order.orderNumber,
            order.referenceNumber,
            order.awbNumber,
            order.receiverInfo.name,
            order.receiverInfo.phone,
            order.receiverInfo.address,
            order.receiverInfo.city,
            order.status,
            order.paymentMethod,
            order.courier || '',
          ];
          
          const matchesSearch = searchableValues.some(value => 
            value.toLowerCase().includes(globalSearchTerm.toLowerCase())
          );
          
          if (!matchesSearch) return false;
        }
        
        // Filter by detailed searchTerm
        if (searchTerm && !Object.values(order).some(value => 
          typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        )) {
          return false;
        }
        
        // Filter by date range
        if (dateRange.from && new Date(order.createdAt) < dateRange.from) {
          return false;
        }
        if (dateRange.to && new Date(order.createdAt) > dateRange.to) {
          return false;
        }
        
        // Filter by other form filters
        if (filters.orderNumber && !order.orderNumber.includes(filters.orderNumber)) {
          return false;
        }
        if (filters.awbNumber && !order.awbNumber.includes(filters.awbNumber)) {
          return false;
        }
        if (filters.referenceNumber && !order.referenceNumber.includes(filters.referenceNumber)) {
          return false;
        }
        if (filters.phone && !order.receiverInfo.phone.includes(filters.phone)) {
          return false;
        }
        if (filters.serviceType && order.serviceType !== filters.serviceType) {
          return false;
        }
        if (filters.courier && filters.courier !== 'All Couriers' && order.courier !== filters.courier) {
          return false;
        }
        if (filters.status && order.status !== filters.status) {
          return false;
        }
        if (filters.warehouse && filters.warehouse !== 'All Warehouses' && order.warehouse !== filters.warehouse) {
          return false;
        }
        if (filters.paymentMethod && filters.paymentMethod !== 'All Methods' && 
            !order.paymentMethod.toLowerCase().includes(filters.paymentMethod.toLowerCase())) {
          return false;
        }
        if (filters.city && filters.city !== 'All Cities' && order.receiverInfo.city !== filters.city) {
          return false;
        }
        
        return true;
      });
  }, [sampleOrders, activeTab, searchTerm, globalSearchTerm, dateRange, filters]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Effect for showing bulk actions
  React.useEffect(() => {
    setShowBulkActions(selectedOrders.length > 0);
  }, [selectedOrders]);

  // Event handlers
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handleSelectAllOrders = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(paginatedOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleViewOrder = (orderId: string) => {
    setViewOrderId(orderId);
  };

  const handleClearFilters = () => {
    setFilters({
      orderNumber: '',
      awbNumber: '',
      referenceNumber: '',
      phone: '',
      serviceType: '',
      courier: '',
      status: '',
      warehouse: '',
      paymentMethod: '',
      city: ''
    });
    setDateRange({ from: null, to: null });
    setSearchTerm('');
    setGlobalSearchTerm('');
  };

  const handleClearSelections = () => {
    setSelectedOrders([]);
  };

  const handleBulkAction = async (action: string, shippingCompanyId?: string) => {
    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order");
      return;
    }

    setIsProcessingBulkAction(true);
    
    try {
      console.log(`Performing bulk action: ${action}`, selectedOrders);
      
      // Simulate an asynchronous operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch(action) {
        case 'cancel':
          toast.success(`Successfully canceled ${selectedOrders.length} orders`);
          break;
        case 'confirm':
          toast.success(`Successfully confirmed ${selectedOrders.length} orders`);
          break;
        case 'assignShipping':
          if (shippingCompanyId) {
            const company = shippingCompanies.find(c => c.id === shippingCompanyId);
            toast.success(`Successfully assigned ${company?.name} to ${selectedOrders.length} orders`);
          }
          break;
        case 'createPickupRequest':
          toast.success(`Created pickup requests for ${selectedOrders.length} orders. Status updated to "Dispatched - Request"`);
          break;
        case 'cancelDelivery':
          toast.success(`Sent cancel delivery requests for ${selectedOrders.length} orders`);
          break;
        default:
          toast.error("Unknown action");
      }
      
      setShowShippingCompanyModal(false);
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast.error("Failed to process the bulk action. Please try again.");
    } finally {
      setIsProcessingBulkAction(false);
      setSelectedOrders([]);
      setBulkStatus('');
      setBulkCourier('');
    }
  };

  // Handle print functions
  const handlePrintAWB = () => {
    const ordersToPrint = selectedOrders.length > 0 ? selectedOrders : (viewOrderId ? [viewOrderId] : []);
    const ordersWithCourier = ordersToPrint.filter(orderId => {
      const order = sampleOrders.find(o => o.id === orderId);
      return order?.courier;
    });
    
    if (ordersWithCourier.length === 0) {
      toast.error("AWB can only be printed for orders assigned to a shipping company");
      return;
    }
    
    console.log(`Printing AWB for ${ordersWithCourier.length} orders`);
    toast.success(`Preparing to print ${ordersWithCourier.length} AWB documents`);
  };
  
  const handlePrintInvoice = () => {
    const ordersToPrint = selectedOrders.length > 0 ? selectedOrders : (viewOrderId ? [viewOrderId] : []);
    
    if (ordersToPrint.length === 0) {
      toast.error("Please select at least one order to print invoice");
      return;
    }
    
    console.log(`Printing invoices for ${ordersToPrint.length} orders`);
    toast.success(`Preparing to print ${ordersToPrint.length} invoices`);
  };

  const handleExport = () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select orders to export");
      return;
    }
    
    console.log(`Exporting ${selectedOrders.length} selected orders to Excel`);
    toast.success(`Preparing to export ${selectedOrders.length} orders to Excel`);
  };

  // Handle row click to view order
  const handleRowClick = (orderId: string) => {
    handleViewOrder(orderId);
  };
  
  const handleCancelOrder = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.warning(`Are you sure you want to cancel order ${orderId}?`, {
      action: {
        label: "Confirm",
        onClick: () => toast.success(`Order ${orderId} cancelled successfully`)
      },
    });
  };

  const handleEditOrder = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toast(`Editing order ${orderId}`, {
      description: "Opening order edit form..."
    });
    // Implementation would follow here
  };

  // Find the order being viewed if any
  const viewedOrder = viewOrderId ? sampleOrders.find(order => order.id === viewOrderId) : null;

  // Handle can edit logic
  const canEdit = (status: OrderStatus) => status === 'pending';
  
  // Available bulk actions based on active tab
  const availableBulkActions = getBulkActions(activeTab);  
  const bulkActionsAllowed = areBulkActionsAllowed(activeTab);
  
  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-brand" />
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        </div>
      </div>

      {/* Action Bar Layout */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2 py-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Export Button */}
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExport}
            disabled={selectedOrders.length === 0}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          
          {/* Bulk Actions Button */}
          {bulkActionsAllowed && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  className={`${selectedOrders.length > 0 ? 'bg-brand text-white hover:bg-brand-dark' : ''} transition-all`}
                  disabled={isProcessingBulkAction || selectedOrders.length === 0}
                  title={selectedOrders.length === 0 ? "Select orders to enable bulk actions" : "Perform bulk actions"}
                >
                  {isProcessingBulkAction ? 'Processing...' : 'Bulk Actions'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {availableBulkActions.includes('cancel') && (
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction('cancel')}
                    disabled={isProcessingBulkAction}
                    className="cursor-pointer text-red-600"
                  >
                    Cancel Orders
                  </DropdownMenuItem>
                )}
                
                {availableBulkActions.includes('confirm') && (
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction('confirm')}
                    disabled={isProcessingBulkAction}
                    className="cursor-pointer text-green-600"
                  >
                    Confirm Orders
                  </DropdownMenuItem>
                )}
                
                {availableBulkActions.includes('assignShipping') && (
                  <DropdownMenuItem 
                    onClick={() => setShowShippingCompanyModal(true)}
                    disabled={isProcessingBulkAction}
                    className="cursor-pointer"
                  >
                    Assign Shipping Company
                  </DropdownMenuItem>
                )}
                
                {availableBulkActions.includes('createPickupRequest') && (
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction('createPickupRequest')}
                    disabled={isProcessingBulkAction}
                    className="cursor-pointer"
                  >
                    Create Pickup Request
                  </DropdownMenuItem>
                )}
                
                {availableBulkActions.includes('cancelDelivery') && (
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction('cancelDelivery')}
                    disabled={isProcessingBulkAction}
                    className="cursor-pointer text-orange-600"
                  >
                    Cancel Delivery
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* Print Buttons */}
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handlePrintAWB}
            disabled={selectedOrders.length === 0}
          >
            <Printer className="h-4 w-4" />
            Print AWB
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handlePrintInvoice}
            disabled={selectedOrders.length === 0}
          >
            <FileTextIcon className="h-4 w-4" />
            Print Invoice
          </Button>
          
          {/* Filter Toggle Button */}
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
        
        {/* Mini Search Box */}
        <div className="w-full md:w-auto md:min-w-[240px]">
          <SearchBox 
            placeholder="Search all columns..." 
            value={globalSearchTerm}
            onChange={setGlobalSearchTerm}
            onClear={() => setGlobalSearchTerm('')}
            size="mini"
          />
        </div>
      </div>

      {/* Filters Card - Expandable */}
      {showFilters && (
        <Card className="mb-6">
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {/* Date Range Picker */}
            <div className="flex flex-col gap-1 col-span-2">
              <Label className="text-xs">Date Range</Label>
              <div className="flex gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "w-full justify-start text-left font-normal text-xs h-8",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {dateRange.from ? format(dateRange.from, "MMM dd") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from || undefined}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, from: date || null }))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "w-full justify-start text-left font-normal text-xs h-8",
                        !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {dateRange.to ? format(dateRange.to, "MMM dd") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to || undefined}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date || null }))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Order Number */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="orderNumber" className="text-xs">Order #</Label>
              <Input 
                id="orderNumber" 
                size="sm"
                className="h-8 text-xs"
                value={filters.orderNumber}
                onChange={e => setFilters(prev => ({ ...prev, orderNumber: e.target.value }))}
                placeholder="Order number"
              />
            </div>

            {/* AWB Number */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="awbNumber" className="text-xs">AWB #</Label>
              <Input 
                id="awbNumber" 
                size="sm"
                className="h-8 text-xs"
                value={filters.awbNumber}
                onChange={e => setFilters(prev => ({ ...prev, awbNumber: e.target.value }))}
                placeholder="AWB number"
              />
            </div>

            {/* Reference Number */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="referenceNumber" className="text-xs">Ref #</Label>
              <Input 
                id="referenceNumber" 
                size="sm"
                className="h-8 text-xs"
                value={filters.referenceNumber}
                onChange={e => setFilters(prev => ({ ...prev, referenceNumber: e.target.value }))}
                placeholder="Reference"
              />
            </div>
            
            {/* Phone Number Search */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="phone" className="text-xs">Phone</Label>
              <Input 
                id="phone" 
                size="sm"
                className="h-8 text-xs"
                value={filters.phone}
                onChange={e => setFilters(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Phone number"
              />
            </div>
            
            {/* Warehouse */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="warehouse" className="text-xs">Warehouse</Label>
              <Select 
                value={filters.warehouse} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, warehouse: value }))}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map(warehouse => (
                    <SelectItem key={warehouse} value={warehouse} className="text-xs">
                      {warehouse}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Courier Company */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="courier" className="text-xs">Courier</Label>
              <Select 
                value={filters.courier} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, courier: value }))}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Courier" />
                </SelectTrigger>
                <SelectContent>
                  {courierCompanies.map(courier => (
                    <SelectItem key={courier} value={courier} className="text-xs">
                      {courier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Payment Method */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="paymentMethod" className="text-xs">Payment</Label>
              <Select 
                value={filters.paymentMethod} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, paymentMethod: value }))}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(method => (
                    <SelectItem key={method} value={method} className="text-xs">
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* City / Governorate */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="city" className="text-xs">City</Label>
              <Select 
                value={filters.city} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city} value={city} className="text-xs">
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Clear Button */}
            <div className="flex flex-col gap-1 justify-end">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleClearFilters}
                className="w-full h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Status Tabs */}
      <StatusTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={statusTabs}
      />

      {/* Orders Table */}
      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={
                      paginatedOrders.length > 0 && 
                      paginatedOrders.every(order => selectedOrders.includes(order.id))
                    }
                    onCheckedChange={handleSelectAllOrders}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-[180px]">Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Courier</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Payment</TableHead>
                <TableHead className="w-[120px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map(order => (
                  <TableRow 
                    key={order.id}
                    onClick={() => handleRowClick(order.id)}
                    className="cursor-pointer"
                  >
                    <TableCell className="py-2">
                      <Checkbox 
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => handleSelectOrder(order.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Select order"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.orderNumber}</div>
                      {order.awbNumber && (
                        <div className="text-xs text-muted-foreground mt-1">
                          AWB: {order.awbNumber}
                        </div>
                      )}
                      {order.referenceNumber && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Ref: {order.referenceNumber}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.receiverInfo.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {order.receiverInfo.phone}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {order.receiverInfo.city}
                      </div>
                    </TableCell>
                    <TableCell>{order.createdAt}</TableCell>
                    <TableCell>
                      <StatusBadge 
                        status={getStatusBadgeType(order.status)}
                        className="capitalize"
                      >
                        {order.status.replace('-', ' ')}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      {order.courier || '-'}
                    </TableCell>
                    <TableCell>
                      {(order.deliveryAttempts || order.deliveryAttempts === 0) && (
                        <StatusBadge 
                          status={getAttemptsStatusBadge(order.deliveryAttempts)}
                          className={`${order.deliveryAttempts > 3 ? 'font-bold' : ''}`}
                          title={order.deliveryAttempts > 3 ? `Excessive delivery attempts (${order.deliveryAttempts})` : undefined}
                        >
                          {order.deliveryAttempts}
                        </StatusBadge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">{order.valueOfGoods} EGP</div>
                      {order.cod > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          COD: {order.cod} EGP
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center">
                        {getPaymentMethodIcon(order.paymentMethod)}
                        <span className="text-sm">{order.paymentMethod}</span>
                      </div>
                      {order.paymentStatus && (
                        <div className="mt-1.5 flex justify-center">
                          <StatusBadge 
                            status={getPaymentStatusBadge(order.paymentStatus)}
                            className="text-xs capitalize"
                          >
                            {order.paymentStatus}
                          </StatusBadge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center space-x-2">
                        {canEdit(order.status) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => handleEditOrder(order.id, e)}
                            title="Edit Order"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => handleCancelOrder(order.id, e)}
                          title="Cancel Order"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrders([order.id]);
                            handlePrintAWB();
                          }}
                          title="Print AWB"
                          disabled={!order.courier}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrders([order.id]);
                            handlePrintInvoice();
                          }}
                          title="Print Invoice"
                        >
                          <FileTextIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show</span>
              <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                from {filteredOrders.length} orders
              </span>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>

      {/* Shipping Company Assignment Modal */}
      <Dialog open={showShippingCompanyModal} onOpenChange={setShowShippingCompanyModal}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Assign Shipping Company</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {shippingCompanies.map(company => (
              <Card key={company.id} className="p-4 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-brand">
                <div className="flex flex-col items-center text-center space-y-3">
                  <img src={company.logo} alt={company.name} className="h-12 w-auto" />
                  <h3 className="font-semibold text-lg">{company.name}</h3>
                  
                  <div className="w-full space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost:</span>
                      <span className="font-medium">{company.cost} EGP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Performance:</span>
                      <span className="font-medium">{company.performanceScore}/5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Time:</span>
                      <span className="font-medium">{company.avgDeliveryTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Success Rate:</span>
                      <span className="font-medium">{company.successRate}%</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => handleBulkAction('assignShipping', company.id)}
                    disabled={isProcessingBulkAction}
                  >
                    {isProcessingBulkAction ? 'Assigning...' : 'Select'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Order View Sheet */}
      <Sheet open={!!viewOrderId} onOpenChange={(open) => !open && setViewOrderId(null)}>
        <SheetContent className="sm:max-w-3xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Order Details</SheetTitle>
          </SheetHeader>
          
          {viewedOrder && (
            <div className="mt-6 space-y-6">
              {/* Order Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{viewedOrder.orderNumber}</h2>
                  <p className="text-muted-foreground">Created on {viewedOrder.createdAt}</p>
                </div>
                <StatusBadge 
                  status={getStatusBadgeType(viewedOrder.status)}
                  className="capitalize"
                >
                  {viewedOrder.status.replace('-', ' ')}
                </StatusBadge>
              </div>
              
              <Separator />
              
              {/* Customer Info */}
              <div>
                <h3 className="font-medium mb-2">Customer Information</h3>
                <div className="bg-muted/30 rounded-md p-3 space-y-1">
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {viewedOrder.receiverInfo.name}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {viewedOrder.receiverInfo.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {`${viewedOrder.receiverInfo.address}, ${viewedOrder.receiverInfo.area}, ${viewedOrder.receiverInfo.city}, ${viewedOrder.receiverInfo.province}`}
                  </p>
                </div>
              </div>
              
              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="bg-muted/30 rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell className="text-right">{viewedOrder.quantity}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </div>
              
              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Order Details</h3>
                  <div className="bg-muted/30 rounded-md p-3 space-y-2">
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Service Type:</span>
                      <span className="font-medium capitalize">{viewedOrder.serviceType}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-medium">{viewedOrder.weight} kg</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Courier:</span>
                      <span className="font-medium">{viewedOrder.courier || 'Not assigned'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Attempts:</span>
                      <span className="font-medium">{viewedOrder.deliveryAttempts || 0}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Warehouse:</span>
                      <span className="font-medium">{viewedOrder.warehouse}</span>
                    </p>
                    {viewedOrder.awbNumber && (
                      <p className="flex justify-between">
                        <span className="text-muted-foreground">AWB:</span>
                        <span className="font-medium">{viewedOrder.awbNumber}</span>
                      </p>
                    )}
                    {viewedOrder.referenceNumber && (
                      <p className="flex justify-between">
                        <span className="text-muted-foreground">Reference:</span>
                        <span className="font-medium">{viewedOrder.referenceNumber}</span>
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Payment Details</h3>
                  <div className="bg-muted/30 rounded-md p-3 space-y-2">
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span className="font-medium">{viewedOrder.paymentMethod}</span>
                    </p>
                    {viewedOrder.paymentStatus && (
                      <p className="flex justify-between">
                        <span className="text-muted-foreground">Payment Status:</span>
                        <StatusBadge 
                          status={getPaymentStatusBadge(viewedOrder.paymentStatus)}
                          className="text-xs capitalize"
                        >
                          {viewedOrder.paymentStatus}
                        </StatusBadge>
                      </p>
                    )}
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Value of Goods:</span>
                      <span className="font-medium">{viewedOrder.valueOfGoods} EGP</span>
                    </p>
                    {viewedOrder.cod > 0 && (
                      <p className="flex justify-between">
                        <span className="text-muted-foreground">COD Amount:</span>
                        <span className="font-medium">{viewedOrder.cod} EGP</span>
                      </p>
                    )}
                    {viewedOrder.discountCode && (
                      <p className="flex justify-between">
                        <span className="text-muted-foreground">Discount:</span>
                        <span className="font-medium">
                          {viewedOrder.discountCode.code} ({viewedOrder.discountCode.value} EGP)
                        </span>
                      </p>
                    )}
                    {viewedOrder.downPayment?.applied && (
                      <p className="flex justify-between">
                        <span className="text-muted-foreground">Down Payment:</span>
                        <span className="font-medium">{viewedOrder.downPayment.value} EGP</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {viewedOrder.notes && (
                <div>
                  <h3 className="font-medium mb-2">Notes</h3>
                  <div className="bg-muted/30 rounded-md p-3">
                    <p>{viewedOrder.notes}</p>
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex flex-wrap gap-2 justify-end">
                {canEdit(viewedOrder.status) && (
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Order
                  </Button>
                )}
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setSelectedOrders([viewedOrder.id]);
                    handlePrintAWB();
                  }}
                  disabled={!viewedOrder.courier}
                >
                  <Printer className="h-4 w-4" />
                  Print AWB
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setSelectedOrders([viewedOrder.id]);
                    handlePrintInvoice();
                  }}
                >
                  <FileTextIcon className="h-4 w-4" />
                  Print Invoice
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
};

export default Orders;
