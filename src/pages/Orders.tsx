
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
  Download
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
import { CreateOrderButton } from '@/components/orders/CreateOrderButton';
import { useCreateOrderModals } from '@/hooks/useCreateOrderModals';

// Type definitions
type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'dispatched' 
  | 'picked-up'
  | 'in-transit'
  | 'delivering'
  | 'abnormal'
  | 'delivered'
  | 'returning'
  | 'returned'
  | 'canceled';

interface Order {
  id: string;
  orderNumber: string;
  referenceNumber: string;
  awbNumber: string;
  quantity: number;
  weight: number;
  allowOpenPackage: boolean;
  serviceType: 'delivery' | 'return' | 'exchange';
  cod: number;
  valueOfGoods: number;
  courier?: string;
  status: OrderStatus;
  paymentMethod: string;
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
      return 'success';
    case 'abnormal':
    case 'returning':
      return 'warning';
    case 'canceled':
    case 'returned':
      return 'danger';
    case 'in-transit':
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

  // Mock data
  const sampleOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2025-10001',
      referenceNumber: 'REF-001',
      awbNumber: 'AWB0012345',
      quantity: 2,
      weight: 1.5,
      allowOpenPackage: true,
      serviceType: 'delivery',
      cod: 250,
      valueOfGoods: 300,
      courier: 'Aramex',
      status: 'pending',
      paymentMethod: 'Cash',
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
      allowOpenPackage: false,
      serviceType: 'delivery',
      cod: 150,
      valueOfGoods: 150,
      courier: 'Fedex',
      status: 'confirmed',
      paymentMethod: 'Vodafone Cash',
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
      allowOpenPackage: true,
      serviceType: 'exchange',
      cod: 0,
      valueOfGoods: 450,
      courier: 'DHL',
      status: 'delivered',
      paymentMethod: 'Visa',
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
      allowOpenPackage: false,
      serviceType: 'return',
      cod: 0,
      valueOfGoods: 200,
      status: 'abnormal',
      paymentMethod: 'ValU',
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
      id: 'in-transit', 
      label: 'In Transit', 
      count: sampleOrders.filter(order => order.status === 'in-transit').length 
    },
    { 
      id: 'delivering', 
      label: 'Delivering', 
      count: sampleOrders.filter(order => order.status === 'delivering').length 
    },
    { 
      id: 'abnormal', 
      label: 'Abnormal', 
      count: sampleOrders.filter(order => order.status === 'abnormal').length 
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

  // Find the order being viewed if any
  const viewedOrder = viewOrderId ? sampleOrders.find(order => order.id === viewOrderId) : null;

  // Handle can edit logic
  const canEdit = (status: OrderStatus) => status === 'pending';
  
  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-brand" />
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => console.log("Export orders")}
          >
            <Download className="h-4 w-4" />
            Export All
          </Button>
          <CreateOrderButton />
        </div>
      </div>

      {/* Filters Card */}
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

          {/* Action Buttons */}
          <div className="flex items-end gap-2">
            <Button 
              className="flex-1"
              onClick={() => console.log('Search with filters:', { dateRange, ...filters })}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleClearFilters}
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* Status Tabs */}
      <div className="mb-6 overflow-x-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="inline-flex h-10 space-x-1 bg-muted p-1">
            {statusTabs.map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-background data-[state=active]:text-foreground relative px-3 py-1.5 text-sm font-medium transition-all"
                title={tab.tooltip}
              >
                {tab.label}
                <span className="ml-2 rounded-full bg-muted-foreground/20 px-2 py-0.5 text-xs">
                  {tab.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Orders Table */}
      <Card className="mb-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={paginatedOrders.length > 0 && selectedOrders.length === paginatedOrders.length} 
                    onCheckedChange={handleSelectAllOrders}
                  />
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Order Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Reference Number</TableHead>
                <TableHead>AWB Number</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-center">Weight</TableHead>
                <TableHead className="text-center">Allow Open Package</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>COD</TableHead>
                <TableHead>Value of Goods</TableHead>
                {activeTab === 'confirmed' || activeTab === 'dispatched' ? (
                  <TableHead>Courier</TableHead>
                ) : null}
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="h-24 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => handleSelectOrder(order.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.referenceNumber}</TableCell>
                    <TableCell>{order.awbNumber}</TableCell>
                    <TableCell className="text-center">{order.quantity}</TableCell>
                    <TableCell className="text-center">{order.weight} kg</TableCell>
                    <TableCell className="text-center">
                      {order.allowOpenPackage ? 'Yes' : 'No'}
                    </TableCell>
                    <TableCell className="capitalize">{order.serviceType}</TableCell>
                    <TableCell>{order.cod} EGP</TableCell>
                    <TableCell>{order.valueOfGoods} EGP</TableCell>
                    {(activeTab === 'confirmed' || activeTab === 'dispatched') && (
                      <TableCell>{order.courier || 'Not Assigned'}</TableCell>
                    )}
                    <TableCell>
                      <StatusBadge status={getStatusBadgeType(order.status)}>
                        {order.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewOrder(order.id)}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          
                          {/* Conditional actions based on order status */}
                          {canEdit(order.status) && (
                            <>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Order
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit COD
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="mr-2 h-4 w-4" />
                                Edit Phone
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Confirm Order
                              </DropdownMenuItem>
                            </>
                          )}
                          
                          <DropdownMenuItem>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Ticket
                          </DropdownMenuItem>
                          
                          {['pending', 'confirmed'].includes(order.status) && (
                            <DropdownMenuItem className="text-red-600">
                              <Ban className="mr-2 h-4 w-4" />
                              Cancel Order
                            </DropdownMenuItem>
                          )}
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
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {rowsPerPage}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setRowsPerPage(10)}>10</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRowsPerPage(25)}>25</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRowsPerPage(50)}>50</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-muted-foreground ml-4">
              Showing {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, filteredOrders.length)} of {filteredOrders.length}
            </span>
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  // Show all pages if 5 or fewer
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  // At start, show 1,2,3,4,...,n
                  if (i < 4) {
                    pageNum = i + 1;
                  } else {
                    return (
                      <PaginationItem key="ellipsis-end">
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                } else if (currentPage >= totalPages - 2) {
                  // At end, show 1,...,n-3,n-2,n-1,n
                  if (i === 0) {
                    pageNum = 1;
                  } else if (i === 1) {
                    return (
                      <PaginationItem key="ellipsis-start">
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  } else {
                    pageNum = totalPages - (4 - i);
                  }
                } else {
                  // In middle, show 1,...,c-1,c,c+1,...,n
                  if (i === 0) {
                    pageNum = 1;
                  } else if (i === 1) {
                    return (
                      <PaginationItem key="ellipsis-start">
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  } else if (i === 4) {
                    return (
                      <PaginationItem key="ellipsis-end">
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  } else {
                    pageNum = currentPage + (i - 2);
                  }
                }

                if (pageNum) {
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
                }
                return null;
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Order Details Modal */}
      <Dialog open={viewOrderId !== null} onOpenChange={(open) => !open && setViewOrderId(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          
          {viewedOrder && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-lg mb-4">Order Information</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">Order Number:</span>
                    <span className="font-medium">{viewedOrder.orderNumber}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">Reference Number:</span>
                    <span>{viewedOrder.referenceNumber}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">AWB Number:</span>
                    <span>{viewedOrder.awbNumber}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">Service Type:</span>
                    <span className="capitalize">{viewedOrder.serviceType}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">Warehouse:</span>
                    <span>{viewedOrder.warehouse}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">Status:</span>
                    <span>
                      <StatusBadge status={getStatusBadgeType(viewedOrder.status)}>
                        {viewedOrder.status}
                      </StatusBadge>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">COD Amount:</span>
                    <span>{viewedOrder.cod} EGP</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">Value of Goods:</span>
                    <span>{viewedOrder.valueOfGoods} EGP</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span>{viewedOrder.paymentMethod}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">Allow Open Package:</span>
                    <span>{viewedOrder.allowOpenPackage ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">Courier:</span>
                    <span>{viewedOrder.courier || 'Not Assigned'}</span>
                  </div>
                  {viewedOrder.notes && (
                    <div className="grid grid-cols-2 gap-1">
                      <span className="text-muted-foreground">Notes:</span>
                      <span>{viewedOrder.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-lg mb-4">Receiver Information</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{viewedOrder.receiverInfo.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{viewedOrder.receiverInfo.phone}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">Address:</span>
                    <span>{viewedOrder.receiverInfo.address}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">Area:</span>
                    <span>{viewedOrder.receiverInfo.area}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">City:</span>
                    <span>{viewedOrder.receiverInfo.city}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-muted-foreground">Province:</span>
                    <span>{viewedOrder.receiverInfo.province}</span>
                  </div>
                </div>

                <h3 className="font-medium text-lg mt-6 mb-4">Items</h3>
                <div className="space-y-3">
                  {viewedOrder.items.map((item, index) => (
                    <div key={index} className="p-3 border rounded-md">
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-muted-foreground">SKU:</span>
                        <span>{item.sku}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-muted-foreground">Description:</span>
                        <span>{item.description}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span>{item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Orders;
