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

  // Mock data
  const sampleOrders: Order[] = [
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
    }
  ];

  // Mock data for filter dropdowns
  const warehouses = ['All Warehouses', 'Cairo Main', 'Giza Branch', 'Alexandria Branch', 'Mansoura Branch', 'Upper Egypt Branch'];
  const courierCompanies = ['All Couriers', 'Aramex', 'DHL', 'Fedex', 'UPS', 'Egypt Post'];
  const paymentMethods = ['All Methods', 'Cash', 'Cash on Delivery', 'Credit Card', 'Vodafone Cash', 'ValU'];
  const cities = ['All Cities', 'Cairo', 'Alexandria', 'Giza', 'Luxor', 'Mansoura', 'Aswan', 'Port Said', 'Suez'];

  // Status tabs with counts
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
                      onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
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
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
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
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{(currentPage - 1) * rowsPerPage + 1}</strong> to{" "}
              <strong>{Math.min(currentPage * rowsPerPage, filteredOrders.length)}</strong> of{" "}
              <strong>{filteredOrders.length}</strong> orders
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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
