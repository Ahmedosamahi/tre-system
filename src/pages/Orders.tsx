
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
  FileText as FileTextIcon
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
  paymentStatus?: 'paid' | 'pending' | 'failed' | 'refunded';
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
      paymentStatus: 'pending',
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

      {/* Status Tabs */}
      <StatusTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        tabs={statusTabs.slice(0, 3)} // Only use the first few tabs for the StatusTabs component
      />
      
      {/* Full Tabs List - Add this to show all tabs */}
      <div className="mb-4 mt-2 overflow-x-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="inline-flex w-auto">
            {statusTabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="flex justify-center items-center gap-2 whitespace-nowrap"
                title={tab.tooltip}
              >
                {tab.label}
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
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
                <DropdownMenuContent align="end" className="w-56">
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

            {/* Action Buttons */}
            <div className="flex gap-2 items-end">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
              <Button 
                className="flex-1"
                onClick={() => console.log('Applied filters:', filters)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                    onCheckedChange={handleSelectAllOrders}
                  />
                </TableHead>
                <TableHead className="min-w-[160px]">
                  <div className="flex items-center">
                    Order #
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="min-w-[140px]">Status</TableHead>
                <TableHead className="min-w-[160px]">Customer</TableHead>
                <TableHead className="min-w-[150px]">Service</TableHead>
                <TableHead className="min-w-[140px]">Courier</TableHead>
                <TableHead className="min-w-[100px]">COD Amount</TableHead>
                <TableHead className="min-w-[180px]">Created</TableHead>
                <TableHead className="min-w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id} onClick={() => handleRowClick(order.id)} className="cursor-pointer">
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedOrders.includes(order.id)} 
                        onCheckedChange={() => handleSelectOrder(order.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <StatusBadge 
                        status={getStatusBadgeType(order.status)}
                      >
                        {order.status.replace('-', ' ')}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{order.receiverInfo.name}</TableCell>
                    <TableCell className="capitalize">{order.serviceType}</TableCell>
                    <TableCell>{order.courier || '-'}</TableCell>
                    <TableCell>{order.cod ? `${order.cod} EGP` : '-'}</TableCell>
                    <TableCell>{order.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleViewOrder(order.id);
                          }}>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          
                          {canEdit(order.status) && (
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              console.log('Edit Order:', order.id);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit Order</span>
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            console.log('Call customer:', order.receiverInfo.phone);
                          }}>
                            <Phone className="mr-2 h-4 w-4" />
                            <span>Call Customer</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  onClick={() => currentPage > 1 && setCurrentPage(prev => Math.max(prev - 1, 1))} 
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum;
                
                // Simple pagination for now, can be enhanced for larger page counts
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else {
                  // Complex pagination logic here if needed
                  pageNum = i + 1;
                }
                
                return (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      isActive={pageNum === currentPage}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              {totalPages > 5 && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      onClick={() => currentPage !== totalPages && setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  onClick={() => currentPage < totalPages && setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Order Detail Side Panel */}
      <Sheet open={!!viewOrderId} onOpenChange={() => setViewOrderId(null)}>
        <SheetContent className="sm:max-w-md lg:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex justify-between items-center">
              <span>Order Details</span>
              {viewedOrder && (
                <StatusBadge 
                  status={getStatusBadgeType(viewedOrder.status)}
                >
                  {viewedOrder.status.replace('-', ' ')}
                </StatusBadge>
              )}
            </SheetTitle>
          </SheetHeader>
          
          {viewedOrder && (
            <div className="mt-6 space-y-6">
              {/* General Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Order Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Order Number</p>
                    <p className="font-medium">{viewedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">AWB</p>
                    <p className="font-medium">{viewedOrder.awbNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reference</p>
                    <p className="font-medium">{viewedOrder.referenceNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="font-medium">{viewedOrder.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Warehouse</p>
                    <p className="font-medium">{viewedOrder.warehouse}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Service Type</p>
                    <p className="font-medium capitalize">{viewedOrder.serviceType}</p>
                  </div>
                  {viewedOrder.courier && (
                    <div>
                      <p className="text-xs text-muted-foreground">Shipping Company</p>
                      <p className="font-medium">{viewedOrder.courier}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Financial Summary - NEW SECTION */}
              <div className="space-y-4 bg-muted/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium border-b pb-2">Financial Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Method</p>
                    <p className="font-medium">{viewedOrder.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Status</p>
                    <StatusBadge 
                      status={viewedOrder.paymentStatus === 'paid' ? 'success' : 
                            viewedOrder.paymentStatus === 'failed' ? 'danger' : 
                            viewedOrder.paymentStatus === 'refunded' ? 'info' : 'warning'}
                    >
                      {viewedOrder.paymentStatus || 'Unknown'}
                    </StatusBadge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">COD Amount</p>
                    <p className="font-medium">{viewedOrder.cod ? `${viewedOrder.cod} EGP` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Value of Goods</p>
                    <p className="font-medium">{viewedOrder.valueOfGoods} EGP</p>
                  </div>
                  {viewedOrder.downPayment?.applied && (
                    <div>
                      <p className="text-xs text-muted-foreground">Down Payment</p>
                      <p className="font-medium">{viewedOrder.downPayment.value} EGP</p>
                    </div>
                  )}
                  {viewedOrder.discountCode && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Discount Applied</p>
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md font-medium">
                          {viewedOrder.discountCode.code}
                        </span>
                        <span className="text-sm font-medium">-{viewedOrder.discountCode.value} EGP</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Receiver Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium">{viewedOrder.receiverInfo.name}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{viewedOrder.receiverInfo.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="font-medium">{viewedOrder.receiverInfo.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Area</p>
                    <p className="font-medium">{viewedOrder.receiverInfo.area}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">City</p>
                    <p className="font-medium">{viewedOrder.receiverInfo.city}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Province</p>
                    <p className="font-medium">{viewedOrder.receiverInfo.province}</p>
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Order Items</h3>
                <div className="space-y-3">
                  {viewedOrder.items.map((item, index) => (
                    <div key={index} className="bg-muted/20 p-3 rounded-md">
                      <div className="flex justify-between">
                        <p className="font-medium">{item.description}</p>
                        <p>Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between pt-2">
                  <p className="text-sm text-muted-foreground">Total Quantity:</p>
                  <p className="font-medium">{viewedOrder.quantity} items</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Total Weight:</p>
                  <p className="font-medium">{viewedOrder.weight} kg</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                {canEdit(viewedOrder.status) && (
                  <Button className="flex-1">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Order
                  </Button>
                )}
                <Button variant="outline" className="flex-1" onClick={() => setViewOrderId(null)}>
                  Close
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

