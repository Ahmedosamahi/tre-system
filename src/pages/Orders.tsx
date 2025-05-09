
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
  Wallet, // Using Wallet instead of Cash
  BadgeDollarSign,
  BadgePercent,
  Info,
  Check,
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

// Type definitions
type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'dispatched' 
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
  const disallowedStatuses = ['delivered', 'returned', 'canceled', 'refunded'];
  return status === 'all' || !disallowedStatuses.includes(status);
};

// Helper function to get available bulk actions for a status
const getBulkActions = (status: string): string[] => {
  switch(status) {
    case 'pending':
      return ['assignShipping', 'assignAuto', 'changeStatus'];
    case 'confirmed':
    case 'dispatched':
      return ['assignShipping', 'changeStatus'];
    case 'picked-up':
    case 'delivering':
    case 'returning':
    case 'abnormal':
    case 'pending-refund':
      return ['changeStatus'];
    default:
      return [];
  }
};

const Orders = () => {
  // States
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
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
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkCourier, setBulkCourier] = useState('');
  const [isProcessingBulkAction, setIsProcessingBulkAction] = useState(false);

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
      count: sampleOrders.filter(order => order.status === 'dispatched').length 
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
        if (activeTab !== 'all' && order.status !== activeTab) {
          return false;
        }
        
        // Filter by searchTerm
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
        if (filters.courier && order.courier !== filters.courier) {
          return false;
        }
        if (filters.status && order.status !== filters.status) {
          return false;
        }
        
        return true;
      });
  }, [sampleOrders, activeTab, searchTerm, dateRange, filters]);

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
      status: ''
    });
    setDateRange({ from: null, to: null });
    setSearchTerm('');
  };

  const handleClearSelections = () => {
    setSelectedOrders([]);
  };

  const handleBulkAction = async (action: string) => {
    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order");
      return;
    }

    setIsProcessingBulkAction(true);
    
    try {
      console.log(`Performing bulk action: ${action}`, selectedOrders);
      
      // Simulate an asynchronous operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (action === 'changeStatus' && bulkStatus) {
        console.log(`Setting status to: ${bulkStatus} for ${selectedOrders.length} orders`);
        toast.success(`Successfully changed status to ${bulkStatus} for ${selectedOrders.length} orders`);
      } else if (action === 'assignShipping' && bulkCourier) {
        console.log(`Assigning courier: ${bulkCourier} to ${selectedOrders.length} orders`);
        toast.success(`Successfully assigned ${bulkCourier} to ${selectedOrders.length} orders`);
      } else if (action === 'assignAuto') {
        console.log(`Auto assigning couriers to ${selectedOrders.length} orders`);
        toast.success(`Successfully auto-assigned couriers to ${selectedOrders.length} orders`);
      } else {
        toast.error("Please select a valid action option");
      }
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast.error("Failed to process the bulk action. Please try again.");
    } finally {
      setIsProcessingBulkAction(false);
      // Clear selections after successful action
      setSelectedOrders([]);
      setBulkStatus('');
      setBulkCourier('');
    }
  };

  // Handle print functions
  const handlePrintAWB = () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order to print AWB");
      return;
    }
    
    console.log(`Printing AWB for ${selectedOrders.length} orders`);
    toast.success(`Preparing to print ${selectedOrders.length} AWB documents`);
  };
  
  const handlePrintInvoice = () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order to print invoice");
      return;
    }
    
    console.log(`Printing invoices for ${selectedOrders.length} orders`);
    toast.success(`Preparing to print ${selectedOrders.length} invoices`);
  };

  // Handle row click to view order
  const handleRowClick = (orderId: string) => {
    handleViewOrder(orderId);
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
        <div className="flex gap-4">
          {/* Export Button */}
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => console.log("Export orders")}
          >
            <Download className="h-4 w-4" />
            Export All
          </Button>
          
          {/* Bulk Actions Button - Always visible but conditionally enabled */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className={`${selectedOrders.length > 0 ? 'bg-brand text-white hover:bg-brand-dark' : 'bg-gray-200 text-gray-500'} transition-all`}
                disabled={selectedOrders.length === 0 || isProcessingBulkAction}
                title={selectedOrders.length === 0 ? "Select orders to enable bulk actions" : "Perform bulk actions"}
              >
                {isProcessingBulkAction ? 'Processing...' : 'Bulk Actions'}
              </Button>
            </DropdownMenuTrigger>
            {bulkActionsAllowed && selectedOrders.length > 0 && (
              <DropdownMenuContent align="end" className="w-56">
                {availableBulkActions.includes('changeStatus') && (
                  <div className="p-2 border-b">
                    <p className="text-sm font-medium mb-1">Change Status</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          {bulkStatus || "Select Status"}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        {statusTabs
                          .filter(tab => tab.id !== 'all' && tab.id !== activeTab)
                          .map(tab => (
                            <DropdownMenuItem 
                              key={tab.id}
                              onClick={() => setBulkStatus(tab.id as string)}
                            >
                              {tab.label}
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button 
                      className="w-full mt-2" 
                      size="sm"
                      disabled={!bulkStatus || isProcessingBulkAction}
                      onClick={() => handleBulkAction('changeStatus')}
                    >
                      Apply Status Change
                    </Button>
                  </div>
                )}
                
                {availableBulkActions.includes('assignShipping') && (
                  <div className="p-2 border-b">
                    <p className="text-sm font-medium mb-1">Assign Shipping Company</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          {bulkCourier || "Select Courier"}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem onClick={() => setBulkCourier('Aramex')}>
                          Aramex
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setBulkCourier('DHL')}>
                          DHL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setBulkCourier('Fedex')}>
                          Fedex
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button 
                      className="w-full mt-2" 
                      size="sm"
                      disabled={!bulkCourier || isProcessingBulkAction}
                      onClick={() => handleBulkAction('assignShipping')}
                    >
                      Assign Courier
                    </Button>
                  </div>
                )}
                
                {availableBulkActions.includes('assignAuto') && (
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction('assignAuto')}
                    disabled={isProcessingBulkAction}
                    className="cursor-pointer"
                  >
                    Auto Assign Courier
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      </div>

      {/* Selected Orders Status Bar */}
      {selectedOrders.length > 0 && (
        <div className="bg-muted/20 py-2 px-4 mb-4 rounded-md flex items-center justify-between">
          <span>✓ {selectedOrders.length} orders selected</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearSelections}
            className="text-sm"
          >
            Clear Selection
          </Button>
        </div>
      )}

      {/* Filters Toggle Button and Print Options */}
      <div className="flex justify-between items-center mb-2">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 text-sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        
        {/* Print Options */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className={`flex items-center gap-1 ${selectedOrders.length === 0 ? 'opacity-50' : ''}`}
            onClick={handlePrintAWB}
            disabled={selectedOrders.length === 0}
          >
            <Printer className="h-4 w-4" />
            Print AWB
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={`flex items-center gap-1 ${selectedOrders.length === 0 ? 'opacity-50' : ''}`}
            onClick={handlePrintInvoice}
            disabled={selectedOrders.length === 0}
          >
            <FileTextIcon className="h-4 w-4" />
            Print Invoice
          </Button>
        </div>
      </div>

      {/* Filters Card - Expandable */}
      {showFilters && (
        <Card className="mb-6">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range Picker */}
            <div className="flex flex-col gap-2">
              <Label>Date Range</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, "PPP") : "From Date"}
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
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, "PPP") : "To Date"}
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
            <div className="flex flex-col gap-2">
              <Label htmlFor="orderNumber">Order Number</Label>
              <Input 
                id="orderNumber" 
                value={filters.orderNumber}
                onChange={e => setFilters(prev => ({ ...prev, orderNumber: e.target.value }))}
                placeholder="Enter order number"
              />
            </div>

            {/* AWB Number */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="awbNumber">AWB Number</Label>
              <Input 
                id="awbNumber" 
                value={filters.awbNumber}
                onChange={e => setFilters(prev => ({ ...prev, awbNumber: e.target.value }))}
                placeholder="Enter AWB number"
              />
            </div>

            {/* Reference Number */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="referenceNumber">Reference Number</Label>
              <Input 
                id="referenceNumber" 
                value={filters.referenceNumber}
                onChange={e => setFilters(prev => ({ ...prev, referenceNumber: e.target.value }))}
                placeholder="Enter reference number"
              />
            </div>

            {/* Receiver Phone */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Receiver Phone</Label>
              <Input 
                id="phone" 
                value={filters.phone}
                onChange={e => setFilters(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>

            {/* Service Type Dropdown */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {filters.serviceType || "Select Service Type"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, serviceType: '' }))}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, serviceType: 'delivery' }))}>
                    Delivery
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, serviceType: 'return' }))}>
                    Return
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, serviceType: 'exchange' }))}>
                    Exchange
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Courier Dropdown */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="courier">Courier</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {filters.courier || "Select Courier"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, courier: '' }))}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, courier: 'Aramex' }))}>
                    Aramex
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, courier: 'DHL' }))}>
                    DHL
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, courier: 'Fedex' }))}>
                    Fedex
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Status Dropdown */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Status</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {filters.status || "Select Status"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => setFilters(prev => ({ ...prev, status: '' }))}>
                    All
                  </DropdownMenuItem>
                  {statusTabs
                    .filter(tab => tab.id !== 'all')
                    .map(tab => (
                      <DropdownMenuItem 
                        key={tab.id}
                        onClick={() => setFilters(prev => ({ ...prev, status: tab.id as string }))}
                      >
                        {tab.label}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2 col-span-1 md:col-span-2 lg:col-span-4">
              <Button
                variant="outline"
                onClick={() => handleClearFilters()}
                className="flex gap-2 items-center"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
              <Button
                variant="default"
                className="flex gap-2 items-center bg-brand hover:bg-brand-dark"
              >
                <Search className="h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Status Tabs */}
      <StatusTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={statusTabs} />

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by order number, AWB, phone, etc."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          {searchTerm && (
            <X
              className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={() => setSearchTerm('')}
            />
          )}
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={paginatedOrders.length > 0 && selectedOrders.length === paginatedOrders.length}
                    onCheckedChange={handleSelectAllOrders}
                    aria-label="Select all orders"
                  />
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <Button variant="ghost" className="flex items-center gap-2 p-0 hover:bg-transparent">
                    Order #
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="min-w-[120px]">Reference #</TableHead>
                <TableHead className="min-w-[120px]">AWB #</TableHead>
                <TableHead className="min-w-[150px]">Customer</TableHead>
                <TableHead className="min-w-[120px]">Status</TableHead>
                <TableHead className="min-w-[120px]">Payment</TableHead>
                <TableHead className="min-w-[100px]">Date</TableHead>
                <TableHead className="min-w-[80px]">Items</TableHead>
                <TableHead className="min-w-[100px]">Value</TableHead>
                <TableHead className="min-w-[100px]">Weight</TableHead>
                <TableHead className="min-w-[120px]">Courier</TableHead>
                <TableHead className="min-w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                    No orders found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow 
                    key={order.id}
                    className={`${viewOrderId === order.id ? 'bg-muted/50' : ''} cursor-pointer hover:bg-muted/30`}
                    onClick={() => handleRowClick(order.id)}
                  >
                    <TableCell className="p-2" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => handleSelectOrder(order.id)}
                        aria-label={`Select order ${order.orderNumber}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.referenceNumber}</TableCell>
                    <TableCell>{order.awbNumber}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{order.receiverInfo.name}</span>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Phone className="h-3 w-3 mr-1" /> 
                          {order.receiverInfo.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={getStatusBadgeType(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm">
                          {getPaymentMethodIcon(order.paymentMethod)}
                          <span>{order.paymentMethod}</span>
                        </div>
                        {order.paymentStatus && (
                          <StatusBadge status={getPaymentStatusBadge(order.paymentStatus)}>
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1).replace('-', ' ')}
                          </StatusBadge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{order.createdAt}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>${order.valueOfGoods}</TableCell>
                    <TableCell>{order.weight} kg</TableCell>
                    <TableCell>{order.courier || '-'}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewOrder(order.id)}>
                            <Info className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {canEdit(order.status) && (
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Order
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handlePrintAWB();
                          }}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print AWB
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handlePrintInvoice();
                          }}>
                            <FileTextIcon className="mr-2 h-4 w-4" />
                            Print Invoice
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      {paginatedOrders.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                // Show first page, last page, and pages around current
                if (
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        isActive={currentPage === pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  (pageNum === 2 && currentPage > 3) || 
                  (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return <PaginationEllipsis key={pageNum} />;
                }
                return null;
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Order Details Side Sheet */}
      {viewOrderId && (
        <Sheet open={!!viewOrderId} onOpenChange={() => setViewOrderId(null)}>
          <SheetContent className="w-full sm:max-w-xl">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Details
                </div>
                {viewedOrder && canEdit(viewedOrder.status) && (
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </SheetTitle>
            </SheetHeader>
            
            {viewedOrder && (
              <div className="mt-6 space-y-6">
                {/* Order Header */}
                <div className="bg-muted/20 p-4 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{viewedOrder.orderNumber}</h3>
                      <p className="text-muted-foreground text-sm">Created on {viewedOrder.createdAt}</p>
                    </div>
                    <StatusBadge status={getStatusBadgeType(viewedOrder.status)}>
                      {viewedOrder.status.charAt(0).toUpperCase() + viewedOrder.status.slice(1).replace('-', ' ')}
                    </StatusBadge>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-2">
                    <div>
                      <span className="text-muted-foreground">Reference #:</span> {viewedOrder.referenceNumber}
                    </div>
                    <div>
                      <span className="text-muted-foreground">AWB #:</span> {viewedOrder.awbNumber}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Service:</span> {viewedOrder.serviceType.charAt(0).toUpperCase() + viewedOrder.serviceType.slice(1)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Warehouse:</span> {viewedOrder.warehouse}
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h4 className="font-semibold mb-2 text-base">Customer Information</h4>
                  <div className="bg-muted/10 p-4 rounded-md grid grid-cols-1 gap-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="font-medium">{viewedOrder.receiverInfo.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      {viewedOrder.receiverInfo.phone}
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Address:</p>
                      <p>{viewedOrder.receiverInfo.address},</p>
                      <p>{viewedOrder.receiverInfo.area}, {viewedOrder.receiverInfo.city},</p>
                      <p>{viewedOrder.receiverInfo.province}</p>
                    </div>
                  </div>
                </div>
                
                {/* Financial Details */}
                <div>
                  <h4 className="font-semibold mb-2 text-base">Financial Details</h4>
                  <div className="bg-muted/10 p-4 rounded-md grid grid-cols-1 gap-y-3 text-sm">
                    <div className="flex items-center">
                      {getPaymentMethodIcon(viewedOrder.paymentMethod)}
                      <span className="font-medium">Payment Method: {viewedOrder.paymentMethod}</span>
                    </div>
                    {viewedOrder.paymentStatus && (
                      <div className="flex items-center">
                        <span className="mr-2">Payment Status:</span>
                        <StatusBadge status={getPaymentStatusBadge(viewedOrder.paymentStatus)}>
                          {viewedOrder.paymentStatus.charAt(0).toUpperCase() + viewedOrder.paymentStatus.slice(1).replace('-', ' ')}
                        </StatusBadge>
                      </div>
                    )}
                    {viewedOrder.downPayment?.applied && (
                      <div className="flex items-center">
                        <BadgeDollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Down Payment: {viewedOrder.downPayment.value} EGP</span>
                      </div>
                    )}
                    {viewedOrder.discountCode && (
                      <div className="flex items-center">
                        <BadgePercent className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Discount: {viewedOrder.discountCode.code} ({viewedOrder.discountCode.value} EGP)</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between items-center">
                      <span>COD Amount:</span>
                      <span className="font-semibold">{viewedOrder.cod} EGP</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold mb-2 text-base">Order Items</h4>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {viewedOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{item.description}</div>
                                <div className="text-xs text-muted-foreground">SKU: {item.sku}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell>Total</TableCell>
                          <TableCell className="text-right">{viewedOrder.quantity}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                  <div className="flex justify-between text-sm mt-3">
                    <span>Total Value:</span>
                    <span className="font-semibold">{viewedOrder.valueOfGoods} EGP</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Total Weight:</span>
                    <span>{viewedOrder.weight} kg</span>
                  </div>
                </div>
                
                {/* Shipping Details */}
                <div>
                  <h4 className="font-semibold mb-2 text-base">Shipping Details</h4>
                  <div className="bg-muted/10 p-4 rounded-md grid grid-cols-1 gap-y-2 text-sm">
                    {viewedOrder.courier ? (
                      <>
                        <div>
                          <span className="text-muted-foreground">Courier:</span> {viewedOrder.courier}
                        </div>
                        <div>
                          <span className="text-muted-foreground">AWB:</span> {viewedOrder.awbNumber}
                        </div>
                      </>
                    ) : (
                      <div className="text-muted-foreground italic">No shipping company assigned yet.</div>
                    )}
                  </div>
                </div>
                
                {/* Notes */}
                {viewedOrder.notes && (
                  <div>
                    <h4 className="font-semibold mb-2 text-base">Notes</h4>
                    <div className="bg-muted/10 p-4 rounded-md text-sm">
                      {viewedOrder.notes}
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => {
                      handlePrintAWB();
                      setViewOrderId(null);
                    }}
                  >
                    <Printer className="h-4 w-4" />
                    Print AWB
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => {
                      handlePrintInvoice();
                      setViewOrderId(null);
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
      )}
    </PageLayout>
  );
};

export default Orders;
