import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { SearchBox } from '@/components/ui/SearchBox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown, 
  Mail, 
  Phone, 
  User, 
  Eye,
  Download,
  MoreVertical,
  MapPin,
  Truck,
  Calendar,
  X,
  AlertTriangle,
  Crown,
  RotateCcw,
  UserPlus,
  Activity,
  CreditCard,
  DollarSign,
  Package
} from 'lucide-react';
import { Customer } from '@/types';
import { CustomerModal } from '@/components/customers/CustomerModal';
import { DeleteCustomerModal } from '@/components/customers/DeleteCustomerModal';
import { CustomerProfileModal } from '@/components/customers/CustomerProfileModal';

const initialCustomers: Customer[] = [
  {
    id: 'CUST001',
    name: 'Ahmed Mohamed',
    email: 'ahmed.mohamed@example.com',
    phone: '+201012345678',
    address: '123 El Nasr St, Nasr City, Cairo, Cairo',
    ordersCount: 24,
    qualityScore: 95,
    status: 'Active',
    customerType: 'VIP',
    warehouse: 'Cairo Main',
    city: 'Cairo',
    governorate: 'Cairo',
    courierPreference: 'Aramex',
    totalOrderValue: 12500,
    lastOrderDate: '2025-01-05',
    frequentCities: ['Cairo', 'Giza'],
    orders: [
      { 
        id: 'ORD001', 
        orderNumber: 'ORD-2025-10021',
        date: '2025-01-05', 
        status: 'Delivered', 
        courier: 'Aramex', 
        amount: 450,
        paymentMethod: 'Cash',
        brandName: 'Tredo Store',
        city: 'Cairo',
        fullAddress: '123 El Nasr St, Nasr City, Cairo'
      },
      { 
        id: 'ORD002', 
        orderNumber: 'ORD-2025-10022',
        date: '2025-01-02', 
        status: 'Delivered', 
        courier: 'Aramex', 
        amount: 300,
        paymentMethod: 'Visa',
        brandName: 'Fashion Hub',
        city: 'Cairo',
        fullAddress: '456 Tahrir Square, Downtown, Cairo'
      },
      { 
        id: 'ORD003', 
        orderNumber: 'ORD-2025-10023',
        date: '2024-12-28', 
        status: 'Refunded', 
        courier: 'Mylerz', 
        amount: 150,
        paymentMethod: 'ValU',
        brandName: 'Tech Shop',
        city: 'Giza',
        fullAddress: '789 Pyramids Road, Giza'
      }
    ]
  },
  {
    id: 'CUST002',
    name: 'Fatima Hassan',
    email: 'fatima.hassan@example.com',
    phone: '+201098765432',
    address: '456 Tahrir Square, Downtown, Cairo, Cairo',
    ordersCount: 18,
    qualityScore: 88,
    status: 'Active',
    customerType: 'Returning Customer',
    warehouse: 'Cairo Main',
    city: 'Cairo',
    governorate: 'Cairo',
    courierPreference: 'Bosta',
    totalOrderValue: 8750,
    lastOrderDate: '2025-01-03',
    frequentCities: ['Cairo'],
    orders: [
      { 
        id: 'ORD004', 
        orderNumber: 'ORD-2025-10024',
        date: '2025-01-03', 
        status: 'Delivered', 
        courier: 'Bosta', 
        amount: 250,
        paymentMethod: 'Mastercard',
        brandName: 'Beauty Store',
        city: 'Cairo',
        fullAddress: '456 Tahrir Square, Downtown, Cairo'
      },
      { 
        id: 'ORD005', 
        orderNumber: 'ORD-2025-10025',
        date: '2024-12-30', 
        status: 'In Transit', 
        courier: 'Bosta', 
        amount: 180,
        paymentMethod: 'Cash',
        brandName: 'Home Essentials',
        city: 'Cairo',
        fullAddress: '789 Maadi Street, Maadi, Cairo'
      }
    ]
  },
  {
    id: 'CUST003',
    name: 'Omar Khaled',
    email: 'omar.khaled@example.com',
    phone: '+201123456789',
    address: '789 Corniche St, Alexandria, Alexandria',
    ordersCount: 7,
    qualityScore: 71,
    status: 'Active',
    customerType: 'New',
    warehouse: 'Alexandria Hub',
    city: 'Alexandria',
    governorate: 'Alexandria',
    courierPreference: 'Mylerz',
    totalOrderValue: 3200,
    lastOrderDate: '2024-12-20',
    frequentCities: ['Alexandria'],
    orders: [
      { 
        id: 'ORD006', 
        orderNumber: 'ORD-2024-09876',
        date: '2024-12-20', 
        status: 'Delivered', 
        courier: 'Mylerz', 
        amount: 320,
        paymentMethod: 'Bank Transfer',
        brandName: 'Electronics Plus',
        city: 'Alexandria',
        fullAddress: '789 Corniche St, Alexandria'
      }
    ]
  },
  {
    id: 'CUST004',
    name: 'Nour El-Din',
    email: 'nour.eldin@example.com',
    phone: '+201234567890',
    address: '321 Maadi St, Maadi, Cairo, Cairo',
    ordersCount: 4,
    qualityScore: 45,
    status: 'Inactive',
    customerType: 'Low Activity',
    warehouse: 'Cairo Main',
    city: 'Cairo',
    governorate: 'Cairo',
    courierPreference: 'Aramex',
    totalOrderValue: 950,
    lastOrderDate: '2024-11-15',
    frequentCities: ['Cairo'],
    orders: [
      { 
        id: 'ORD007', 
        orderNumber: 'ORD-2024-08765',
        date: '2024-11-15', 
        status: 'Cancelled', 
        courier: 'Aramex', 
        amount: 195,
        paymentMethod: 'Cash',
        brandName: 'Sport Gear',
        city: 'Cairo',
        fullAddress: '321 Maadi St, Maadi, Cairo'
      }
    ]
  }
];

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [profileCustomer, setProfileCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
  const [activeFilters, setActiveFilters] = useState<string[]>(['All Customers']);
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [courierFilter, setCourierFilter] = useState<string>('all');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = activeFilters.includes('All Customers') ||
                          (activeFilters.includes('Active') && customer.status === 'Active') ||
                          (activeFilters.includes('Inactive') && customer.status === 'Inactive') ||
                          (activeFilters.includes('High Quality') && customer.qualityScore >= 85) ||
                          (activeFilters.includes('Low Quality') && customer.qualityScore < 60);
    
    const matchesWarehouse = warehouseFilter === 'all' || customer.warehouse === warehouseFilter;
    const matchesCity = cityFilter === 'all' || customer.governorate === cityFilter;
    const matchesCourier = courierFilter === 'all' || customer.courierPreference === courierFilter;
    
    return matchesSearch && matchesFilters && matchesWarehouse && matchesCity && matchesCourier;
  });

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setDeletingCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    setProfileCustomer(customer);
    setIsProfileModalOpen(true);
  };

  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'orders'>) => {
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => 
        c.id === editingCustomer.id 
          ? { ...customerData, id: editingCustomer.id, orders: editingCustomer.orders }
          : c
      ));
    } else {
      const newCustomer: Customer = {
        ...customerData,
        id: `CUST${String(customers.length + 1).padStart(3, '0')}`,
        orders: []
      };
      setCustomers(prev => [...prev, newCustomer]);
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const confirmDelete = () => {
    if (deletingCustomer) {
      setCustomers(prev => prev.filter(c => c.id !== deletingCustomer.id));
    }
    setIsDeleteModalOpen(false);
    setDeletingCustomer(null);
  };

  const toggleRowExpansion = (customerId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(customerId)) {
        newSet.delete(customerId);
      } else {
        newSet.add(customerId);
      }
      return newSet;
    });
  };

  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(customerId)) {
        newSet.delete(customerId);
      } else {
        newSet.add(customerId);
      }
      return newSet;
    });
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => {
      if (filter === 'All Customers') {
        return ['All Customers'];
      }
      const filtered = prev.filter(f => f !== 'All Customers');
      if (filtered.includes(filter)) {
        const newFilters = filtered.filter(f => f !== filter);
        return newFilters.length === 0 ? ['All Customers'] : newFilters;
      } else {
        return [...filtered, filter];
      }
    });
  };

  const clearAllFilters = () => {
    setActiveFilters(['All Customers']);
    setWarehouseFilter('all');
    setCityFilter('all');
    setCourierFilter('all');
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'Returning Customer': return 'bg-blue-100 text-blue-800';
      case 'New': return 'bg-green-100 text-green-800';
      case 'Low Activity': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCustomerTypeIcon = (type: string) => {
    switch (type) {
      case 'VIP': return <Crown size={12} />;
      case 'Returning Customer': return <RotateCcw size={12} />;
      case 'New': return <UserPlus size={12} />;
      case 'Low Activity': return <Activity size={12} />;
      default: return <User size={12} />;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Refunded': return 'bg-orange-100 text-orange-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Cash': return <DollarSign size={14} />;
      case 'Visa':
      case 'Mastercard': return <CreditCard size={14} />;
      case 'ValU': return <CreditCard size={14} />;
      case 'Bank Transfer': return <DollarSign size={14} />;
      default: return <CreditCard size={14} />;
    }
  };

  const isInactive30Days = (lastOrderDate: string) => {
    const lastOrder = new Date(lastOrderDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastOrder < thirtyDaysAgo;
  };

  const exportCustomers = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Email,Phone,City,Orders,Quality Score,Status\n" +
      filteredCustomers.map(c => 
        `${c.name},${c.email},${c.phone},${c.city},${c.ordersCount},${c.qualityScore}%,${c.status}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1">
          <Header className="sticky top-0 z-10" />
          <main className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
              <Button 
                onClick={handleAddCustomer}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Plus size={18} /> Add Customer
              </Button>
            </div>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Customers</p>
                    <p className="text-2xl font-bold text-blue-800">{customers.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-200 rounded-full flex items-center justify-center">
                    <User size={24} className="text-blue-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Active Customers</p>
                    <p className="text-2xl font-bold text-green-800">
                      {customers.filter(c => c.status === 'Active').length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-200 rounded-full flex items-center justify-center">
                    <Activity size={24} className="text-green-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Avg Quality Score</p>
                    <p className="text-2xl font-bold text-purple-800">
                      {Math.round(customers.reduce((acc, c) => acc + c.qualityScore, 0) / customers.length)}%
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-200 rounded-full flex items-center justify-center">
                    <Crown size={24} className="text-purple-600" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 font-medium">Total Orders</p>
                    <p className="text-2xl font-bold text-orange-800">
                      {customers.reduce((acc, c) => acc + c.ordersCount, 0)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-orange-200 rounded-full flex items-center justify-center">
                    <Truck size={24} className="text-orange-600" />
                  </div>
                </div>
              </Card>
            </div>
            
            <Card>
              <div className="p-6 border-b">
                {/* Search Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="col-span-1 md:col-span-2">
                    <SearchBox 
                      placeholder="Search customers by name, email, or phone..." 
                      value={searchTerm}
                      onChange={setSearchTerm}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={exportCustomers}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download size={16} /> Export All
                    </Button>
                    {selectedCustomers.size > 0 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-2">
                            <MoreVertical size={16} /> Bulk Actions ({selectedCustomers.size})
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Send Notification</DropdownMenuItem>
                          <DropdownMenuItem>Mark as VIP</DropdownMenuItem>
                          <DropdownMenuItem>Set as Inactive</DropdownMenuItem>
                          <DropdownMenuItem>Export Selected</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
                
                {/* Basic Filters */}
                <div className="flex gap-2 flex-wrap mb-4">
                  {['All Customers', 'Active', 'Inactive', 'High Quality', 'Low Quality'].map(filter => (
                    <Badge
                      key={filter}
                      variant="outline"
                      className={`cursor-pointer transition-colors ${
                        activeFilters.includes(filter) 
                          ? 'bg-blue-100 text-blue-800 border-blue-300' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => toggleFilter(filter)}
                    >
                      {filter}
                    </Badge>
                  ))}
                </div>
                
                {/* Advanced Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="By Warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Warehouses</SelectItem>
                      <SelectItem value="Cairo Main">Cairo Main</SelectItem>
                      <SelectItem value="Alexandria Hub">Alexandria Hub</SelectItem>
                      <SelectItem value="Giza Center">Giza Center</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={cityFilter} onValueChange={setCityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="By Governorate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Governorates</SelectItem>
                      <SelectItem value="Cairo">Cairo</SelectItem>
                      <SelectItem value="Alexandria">Alexandria</SelectItem>
                      <SelectItem value="Giza">Giza</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={courierFilter} onValueChange={setCourierFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="By Courier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Couriers</SelectItem>
                      <SelectItem value="Aramex">Aramex</SelectItem>
                      <SelectItem value="Bosta">Bosta</SelectItem>
                      <SelectItem value="Mylerz">Mylerz</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <X size={16} /> Clear Filters
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedCustomers.size === filteredCustomers.length && filteredCustomers.length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCustomers(new Set(filteredCustomers.map(c => c.id)));
                            } else {
                              setSelectedCustomers(new Set());
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Quality Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <React.Fragment key={customer.id}>
                        <TableRow className="hover:bg-gray-50 transition-colors">
                          <TableCell>
                            <Checkbox
                              checked={selectedCustomers.has(customer.id)}
                              onCheckedChange={() => toggleCustomerSelection(customer.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Collapsible>
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleRowExpansion(customer.id)}
                                  className="p-0 h-8 w-8"
                                >
                                  <ChevronDown 
                                    size={16} 
                                    className={`transition-transform ${
                                      expandedRows.has(customer.id) ? 'rotate-180' : ''
                                    }`}
                                  />
                                </Button>
                              </CollapsibleTrigger>
                            </Collapsible>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium flex items-center gap-2">
                                {customer.name}
                                {isInactive30Days(customer.lastOrderDate) && (
                                  <div title="Inactive for 30+ days">
                                    <AlertTriangle size={14} className="text-red-500" />
                                  </div>
                                )}
                                {customer.ordersCount === 0 && (
                                  <div title="No orders">
                                    <AlertTriangle size={14} className="text-orange-500" />
                                  </div>
                                )}
                              </div>
                              <Badge 
                                className={`text-xs ${getCustomerTypeColor(customer.customerType)} flex items-center gap-1 w-fit`}
                              >
                                {getCustomerTypeIcon(customer.customerType)}
                                {customer.customerType}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Mail size={14} className="text-gray-500" /> {customer.email}
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <Phone size={14} className="text-gray-500" /> {customer.phone}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <MapPin size={14} /> {customer.city}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="space-y-1">
                              <div className="font-medium">{customer.ordersCount}</div>
                              <div className="text-xs text-gray-500">
                                {customer.totalOrderValue.toLocaleString()} EGP
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${getQualityScoreColor(customer.qualityScore)}`}
                                  style={{ width: `${customer.qualityScore}%` }}
                                />
                              </div>
                              <Badge 
                                variant="outline" 
                                className={
                                  customer.qualityScore >= 85 ? 'bg-green-50 text-green-700' :
                                  customer.qualityScore >= 60 ? 'bg-yellow-50 text-yellow-700' :
                                  'bg-red-50 text-red-700'
                                }
                              >
                                {customer.qualityScore}%
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={customer.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}
                            >
                              {customer.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewCustomer(customer)}
                                className="hover:bg-blue-50 hover:text-blue-600"
                              >
                                <Eye size={16} />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCustomer(customer)}
                                className="hover:bg-green-50 hover:text-green-600"
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCustomer(customer)}
                                className="hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedRows.has(customer.id) && (
                          <TableRow>
                            <TableCell colSpan={8} className="bg-gray-50 p-0">
                              <Collapsible open={expandedRows.has(customer.id)}>
                                <CollapsibleContent>
                                  <div className="p-6">
                                    <div className="mb-4 flex items-center gap-2">
                                      <Package size={18} className="text-gray-600" />
                                      <h4 className="text-lg font-semibold text-gray-800">Recent Shipments</h4>
                                    </div>
                                    
                                    {customer.orders.length === 0 ? (
                                      <div className="text-center py-8 text-gray-500">
                                        <Package size={48} className="mx-auto mb-2 text-gray-300" />
                                        <p>No recent shipments for this customer.</p>
                                      </div>
                                    ) : (
                                      <div className="bg-white rounded-lg border overflow-hidden">
                                        <Table>
                                          <TableHeader>
                                            <TableRow className="bg-gray-50">
                                              <TableHead className="font-semibold">Order Number</TableHead>
                                              <TableHead className="font-semibold">Value</TableHead>
                                              <TableHead className="font-semibold">Payment Method</TableHead>
                                              <TableHead className="font-semibold">Status</TableHead>
                                              <TableHead className="font-semibold">Brand</TableHead>
                                              <TableHead className="font-semibold">Courier</TableHead>
                                              <TableHead className="font-semibold">City</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {customer.orders.map((order) => (
                                              <TableRow key={order.id} className="hover:bg-gray-50">
                                                <TableCell className="font-medium text-blue-600">
                                                  {order.orderNumber}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                  {order.amount} EGP
                                                </TableCell>
                                                <TableCell>
                                                  <div className="flex items-center gap-2">
                                                    {getPaymentMethodIcon(order.paymentMethod)}
                                                    <span className="text-sm">{order.paymentMethod}</span>
                                                  </div>
                                                </TableCell>
                                                <TableCell>
                                                  <Badge 
                                                    className={`${getOrderStatusColor(order.status)} text-xs`}
                                                  >
                                                    {order.status}
                                                  </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm font-medium">
                                                  {order.brandName}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                  <div className="flex items-center gap-1">
                                                    <Truck size={14} className="text-gray-500" />
                                                    {order.courier}
                                                  </div>
                                                </TableCell>
                                                <TableCell>
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <div className="flex items-center gap-1 cursor-help">
                                                        <MapPin size={14} className="text-gray-500" />
                                                        <span className="text-sm">{order.city}</span>
                                                      </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      <p className="text-sm">{order.fullAddress}</p>
                                                    </TooltipContent>
                                                  </Tooltip>
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    )}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </main>
        </div>

        <CustomerModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCustomer(null);
          }}
          onSave={handleSaveCustomer}
          customer={editingCustomer}
        />

        <DeleteCustomerModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingCustomer(null);
          }}
          onConfirm={confirmDelete}
          customerName={deletingCustomer?.name || ''}
        />

        <CustomerProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => {
            setIsProfileModalOpen(false);
            setProfileCustomer(null);
          }}
          customer={profileCustomer}
        />
      </div>
    </TooltipProvider>
  );
};

export default CustomersPage;
