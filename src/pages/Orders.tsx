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
  Cash,
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
      return <Cash className="h-4 w-4 mr-2 text-gray-500" />;
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
                    ))
                  }
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 items-end col-span-1 md:col-span-2 lg:col-span-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
              <Button 
                className="flex-1"
              >
                Apply Filters
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
      <Card className="shadow-sm">
        <div className="p-6">
          {/* Search bar */}
          <div className="relative w-full mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by order number, AWB, contact info..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0} 
                      onCheckedChange={handleSelectAllOrders}
                      aria-label="Select all orders"
                    />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => console.log("Sort by order number")}>
                    Order # <ArrowUpDown className="inline h-4 w-4 ml-1" />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => console.log("Sort by AWB")}>
                    AWB <ArrowUpDown className="inline h-4 w-4 ml-1" />
                  </TableHead>
                  <TableHead>COD</TableHead>
                  <TableHead>Courier</TableHead>
                  <TableHead>Receiver Info</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => console.log("Sort by date")}>
                    Date <ArrowUpDown className="inline h-4 w-4 ml-1" />
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <TableRow 
                      key={order.id} 
                      className={selectedOrders.includes(order.id) ? 'bg-muted/50' : ''}
                      onClick={() => handleRowClick(order.id)}
                    >
                      <TableCell onClick={(e) => { e.stopPropagation(); }}>
                        <Checkbox 
                          checked={selectedOrders.includes(order.id)} 
                          onCheckedChange={() => handleSelectOrder(order.id)}
                          aria-label={`Select order ${order.orderNumber}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {order.orderNumber}
                        <div className="text-xs text-gray-500 mt-1">
                          Ref: {order.referenceNumber}
                        </div>
                      </TableCell>
                      <TableCell>{order.awbNumber}</TableCell>
                      <TableCell>{order.cod > 0 ? `${order.cod} EGP` : '-'}</TableCell>
                      <TableCell>{order.courier || '-'}</TableCell>
                      <TableCell>
                        <div className="max-w-[180px]">
                          <div className="font-medium truncate">{order.receiverInfo.name}</div>
                          <div className="text-sm text-gray-500 flex items-center truncate">
                            <Phone className="h-3 w-3 mr-1" />
                            {order.receiverInfo.phone}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {order.receiverInfo.city}, {order.receiverInfo.province}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <StatusBadge status={getStatusBadgeType(order.status)}>
                          {order.status.replace('-', ' ')}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => { e.stopPropagation(); }}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewOrder(order.id)}>
                              <FileText className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {canEdit(order.status) && (
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Order
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={handlePrintAWB}>
                              <Printer className="h-4 w-4 mr-2" />
                              Print AWB
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handlePrintInvoice}>
                              <FileTextIcon className="h-4 w-4 mr-2" />
                              Print Invoice
                            </DropdownMenuItem>
                            {order.status === 'pending' && (
                              <DropdownMenuItem className="text-red-600">
                                <Ban className="h-4 w-4 mr-2" />
                                Cancel Order
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No orders found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }} 
                      aria-disabled={currentPage === 1}
                      tabIndex={currentPage === 1 ? -1 : undefined}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {/* First page */}
                  {currentPage > 2 && (
                    <PaginationItem>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(1);
                        }}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  {/* Ellipsis if needed */}
                  {currentPage > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  {/* Previous page if not first */}
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage - 1);
                        }}
                      >
                        {currentPage - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  {/* Current page */}
                  <PaginationItem>
                    <PaginationLink href="#" isActive onClick={(e) => e.preventDefault()}>
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                  
                  {/* Next page if not last */}
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage + 1);
                        }}
                      >
                        {currentPage + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  {/* Ellipsis if needed */}
                  {currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  {/* Last page if not current or next */}
                  {currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(totalPages);
                        }}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      aria-disabled={currentPage === totalPages}
                      tabIndex={currentPage === totalPages ? -1 : undefined}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </Card>

      {/* Order Details Sheet */}
      {viewedOrder && (
        <Sheet open={!!viewOrderId} onOpenChange={() => setViewOrderId(null)}>
          <SheetContent className="w-full md:max-w-md overflow-y-auto">
            <SheetHeader>
              <div className="flex justify-between items-center">
                <SheetTitle>Order Details</SheetTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewOrderId(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </SheetHeader>
            
            <div className="mt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{viewedOrder.orderNumber}</h3>
                  <p className="text-sm text-gray-500">Ref: {viewedOrder.referenceNumber}</p>
                  <p className="text-sm text-gray-500">AWB: {viewedOrder.awbNumber}</p>
                </div>
                <StatusBadge status={getStatusBadgeType(viewedOrder.status)}>
                  {viewedOrder.status.replace('-', ' ')}
                </StatusBadge>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-sm text-gray-500 mb-2">Customer Information</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-medium">{viewedOrder.receiverInfo.name}</p>
                  <p className="text-sm flex items-center mt-1">
                    <Phone className="h-3.5 w-3.5 mr-1" />
                    {viewedOrder.receiverInfo.phone}
                  </p>
                  <p className="text-sm mt-1">{viewedOrder.receiverInfo.address}</p>
                  <p className="text-sm">{viewedOrder.receiverInfo.area}, {viewedOrder.receiverInfo.city}</p>
                  <p className="text-sm">{viewedOrder.receiverInfo.province}</p>
                </div>
              </div>

              {/* Financial Details Section */}
              <div className="mt-6">
                <h4 className="font-medium text-sm text-gray-500 mb-2">Financial Details</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getPaymentMethodIcon(viewedOrder.paymentMethod)}
                      <span>Payment Method:</span>
                    </div>
                    <span className="font-medium">{viewedOrder.paymentMethod}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span>Payment Status:</span>
                    <StatusBadge status={getPaymentStatusBadge(viewedOrder.paymentStatus)}>
                      {viewedOrder.paymentStatus || 'Pending'}
                    </StatusBadge>
                  </div>
                  
                  {viewedOrder.downPayment?.applied && (
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <BadgeDollarSign className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Down Payment:</span>
                      </div>
                      <span className="font-medium">{viewedOrder.downPayment.value} EGP</span>
                    </div>
                  )}
                  
                  {viewedOrder.discountCode && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BadgePercent className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Discount Code:</span>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-gray-200 px-2 py-0.5 rounded text-xs mb-1">
                          {viewedOrder.discountCode.code}
                        </span>
                        <div className="font-medium">{viewedOrder.discountCode.value} EGP</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-sm text-gray-500 mb-2">Order Items</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  {viewedOrder.items.map((item, index) => (
                    <div key={index} className={`flex justify-between ${index > 0 ? 'mt-3 pt-3 border-t border-gray-200' : ''}`}>
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      </div>
                      <p className="font-medium">x{item.quantity}</p>
                    </div>
                  ))}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span>Total Items:</span>
                      <span className="font-medium">{viewedOrder.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Value of Goods:</span>
                      <span className="font-medium">{viewedOrder.valueOfGoods} EGP</span>
                    </div>
                    {viewedOrder.cod > 0 && (
                      <div className="flex justify-between text-sm mt-1">
                        <span>Cash on Delivery:</span>
                        <span className="font-medium">{viewedOrder.cod} EGP</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-sm text-gray-500 mb-2">Shipping Details</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  {viewedOrder.courier ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Courier:</span>
                        <span className="font-medium">{viewedOrder.courier}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Weight:</span>
                        <span className="font-medium">{viewedOrder.weight} kg</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">No courier assigned yet</p>
                  )}
                </div>
              </div>
              
              {viewedOrder.notes && (
                <div className="mt-6">
                  <h4 className="font-medium text-sm text-gray-500 mb-2">Notes</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm">{viewedOrder.notes}</p>
                  </div>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t flex gap-3">
                <Button className="flex-1" onClick={handlePrintAWB}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print AWB
                </Button>
                <Button variant="secondary" className="flex-1" onClick={handlePrintInvoice}>
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  Print Invoice
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </PageLayout>
  );
};

export default Orders;
