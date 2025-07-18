import React, { useState } from 'react';
import { TicketTable } from '@/components/crm/TicketTable';
import { CreateTicketModal } from '@/components/crm/CreateTicketModal';
import { TicketDetailsPanel } from '@/components/crm/TicketDetailsPanel';
import { RespondToTicketModal } from '@/components/crm/RespondToTicketModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  TicketIcon,
  CheckCircle,
  MessageSquare,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Ticket, TicketFormData } from '@/types';

const CrmCustomerService = () => {
  const { toast } = useToast();

  const issueTypes = [
    'Incorrect Customer Information',
    'Delivery Delay',
    'Damaged Goods',
    'Lost Shipment',
    'Incorrect Shipment',
    'Customs Issue',
    'Payment Dispute',
    'Label Error',
    'Other'
  ];

  const shippingCompanies = [
    'Aramex',
    'DHL',
    'FedEx',
    'UPS',
    'Egypt Post',
    'Mylerz',
    'Bosta',
    'Vhubs',
    'Other'
  ];

  const issueCategories = [
    'Customer Error',
    'Shipping Error',
    'System Error',
    'Product Issue',
    'Address Issue',
    'Payment Issue',
    'Other'
  ];

  const mockTickets: Ticket[] = [
    {
      id: '1',
      ticketId: 'TK-001',
      orderNumber: 'ORD-2025-10021',
      awb: 'AWB123456789',
      referenceNumber: 'REF-2025-001',
      issueType: 'Incorrect Customer Information',
      shippingCompany: 'Aramex',
      dateCreated: '2025-01-15',
      issueCategory: 'Customer Error',
      description: 'Customer provided wrong phone number, package could not be delivered',
      priority: 'Medium',
      status: 'Open',
      customerName: 'Ahmed Hassan',
      phone: '+201234567890',
      createdBy: 'System'
    },
    {
      id: '2',
      ticketId: 'TK-002',
      orderNumber: 'ORD-2025-10022',
      awb: 'AWB987654321',
      referenceNumber: 'REF-2025-002',
      issueType: 'Delivery Delay',
      shippingCompany: 'DHL',
      dateCreated: '2025-01-14',
      issueCategory: 'Shipping Error',
      description: 'Package delayed due to traffic conditions',
      priority: 'Low',
      status: 'Responded',
      customerName: 'Sara Ali',
      phone: '+201234567891',
      createdBy: 'CS Team'
    },
    {
      id: '3',
      ticketId: 'TK-003',
      orderNumber: 'ORD-2025-10023',
      awb: 'AWB456789123',
      referenceNumber: 'REF-2025-003',
      issueType: 'Damaged Goods',
      shippingCompany: 'FedEx',
      dateCreated: '2025-01-13',
      issueCategory: 'Shipping Error',
      description: 'Package arrived damaged, customer requesting replacement',
      priority: 'High',
      status: 'Closed',
      customerName: 'Mohamed Farid',
      phone: '+201234567892',
      createdBy: 'CS Team'
    },
    {
      id: '4',
      ticketId: 'TK-004',
      orderNumber: 'ORD-2025-10024',
      awb: 'AWB789123456',
      referenceNumber: 'REF-2025-004',
      issueType: 'Lost Shipment',
      shippingCompany: 'UPS',
      dateCreated: '2025-01-12',
      issueCategory: 'Shipping Error',
      description: 'Package lost during transit, customer requesting investigation',
      priority: 'High',
      status: 'Open',
      customerName: 'Fatima Nour',
      phone: '+201234567893',
      createdBy: 'CS Team'
    },
    {
      id: '5',
      ticketId: 'TK-005',
      orderNumber: 'ORD-2025-10025',
      awb: 'AWB321654987',
      referenceNumber: 'REF-2025-005',
      issueType: 'Payment Dispute',
      shippingCompany: 'Bosta',
      dateCreated: '2025-01-11',
      issueCategory: 'Payment Issue',
      description: 'COD payment amount discrepancy reported by courier',
      priority: 'Medium',
      status: 'Closed',
      customerName: 'Omar Khaled',
      phone: '+201234567894',
      createdBy: 'System'
    }
  ];

  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'responded' | 'not-responded' | 'closed'>('all');
  const [sortField, setSortField] = useState('dateCreated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    orderNumber: '',
    awb: '',
    referenceNumber: '',
    ticketId: '',
    issueType: 'all',
    shippingCompany: 'all',
    issueCategory: 'all',
    priority: 'all',
    status: undefined as string | undefined,
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined
  });

  const filteredTickets = tickets.filter(ticket => {
    let filtered = [ticket];

    if (filters.orderNumber) {
      filtered = filtered.filter(ticket => 
        ticket.orderNumber.toLowerCase().includes(filters.orderNumber.toLowerCase())
      );
    }
    if (filters.awb) {
      filtered = filtered.filter(ticket => 
        ticket.awb.toLowerCase().includes(filters.awb.toLowerCase())
      );
    }
    if (filters.referenceNumber) {
      filtered = filtered.filter(ticket => 
        ticket.referenceNumber.toLowerCase().includes(filters.referenceNumber.toLowerCase())
      );
    }
    if (filters.ticketId) {
      filtered = filtered.filter(ticket => 
        ticket.ticketId.toLowerCase().includes(filters.ticketId.toLowerCase())
      );
    }
    if (filters.issueType && filters.issueType !== 'all') {
      filtered = filtered.filter(ticket => ticket.issueType === filters.issueType);
    }
    if (filters.shippingCompany && filters.shippingCompany !== 'all') {
      filtered = filtered.filter(ticket => ticket.shippingCompany === filters.shippingCompany);
    }
    if (filters.issueCategory && filters.issueCategory !== 'all') {
      filtered = filtered.filter(ticket => ticket.issueCategory === filters.issueCategory);
    }
    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === filters.priority);
    }
    if (filters.status) {
      filtered = filtered.filter(ticket => ticket.status === filters.status);
    }
    if (filters.fromDate) {
      filtered = filtered.filter(ticket => 
        new Date(ticket.dateCreated) >= filters.fromDate!
      );
    }
    if (filters.toDate) {
      filtered = filtered.filter(ticket => 
        new Date(ticket.dateCreated) <= filters.toDate!
      );
    }

    return filtered.length > 0;
  });

  const totalTickets = filteredTickets.length;
  const respondedTickets = filteredTickets.filter(ticket => ticket.status === 'Responded').length;
  const notRespondedTickets = filteredTickets.filter(ticket => ticket.status === 'Open').length;
  const closedTickets = filteredTickets.filter(ticket => ticket.status === 'Closed').length;

  const getTabFilteredTickets = () => {
    switch (activeTab) {
      case 'responded':
        return filteredTickets.filter(ticket => ticket.status === 'Responded');
      case 'not-responded':
        return filteredTickets.filter(ticket => ticket.status === 'Open');
      case 'closed':
        return filteredTickets.filter(ticket => ticket.status === 'Closed');
      default:
        return filteredTickets;
    }
  };

  const tabFilteredTickets = getTabFilteredTickets();

  const handleSort = (field: string) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
  };

  const handleClearFilters = () => {
    setFilters({
      orderNumber: '',
      awb: '',
      referenceNumber: '',
      ticketId: '',
      issueType: 'all',
      shippingCompany: 'all',
      issueCategory: 'all',
      priority: 'all',
      status: undefined,
      fromDate: undefined,
      toDate: undefined
    });
  };

  const handleCreateTicket = async (formData: TicketFormData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTicket: Ticket = {
      id: Date.now().toString(),
      ticketId: `TK-${String(tickets.length + 1).padStart(3, '0')}`,
      orderNumber: formData.orderNumber,
      awb: formData.awb || `AWB${Date.now()}`,
      referenceNumber: formData.referenceNumber,
      issueType: formData.issueType,
      shippingCompany: formData.shippingCompany,
      dateCreated: new Date().toISOString().split('T')[0],
      issueCategory: formData.issueCategory,
      description: formData.description,
      priority: formData.priority,
      status: 'Open',
      customerName: 'New Customer',
      phone: '+201234567890',
      attachments: formData.attachments?.map(file => file.name) || [],
      createdBy: 'Current User'
    };
    
    setTickets(prev => [newTicket, ...prev]);
    toast({
      title: 'Success',
      description: 'Ticket created successfully',
      variant: 'default'
    });
  };

  const handleView = (id: string) => {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      setSelectedTicket(ticket);
      setIsPanelOpen(true);
    }
  };

  const handleRespond = (id: string) => {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      setSelectedTicket(ticket);
      setIsRespondModalOpen(true);
    }
  };

  const handleRespondSubmit = (ticketId: string, response: string, newStatus: string) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: newStatus as 'Open' | 'Responded' | 'Closed' }
          : ticket
      )
    );
    
    toast({
      title: 'Success',
      description: `Ticket ${ticketId} updated successfully`,
      variant: 'default'
    });
  };

  const handleStatusUpdate = (ticketId: string, status: string) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: status as 'Open' | 'Responded' | 'Closed' }
          : ticket
      )
    );
    
    toast({
      title: 'Success',
      description: `Ticket status updated to ${status}`,
      variant: 'default'
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">CRM Customer Service</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Ticket
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Filters</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number</Label>
              <Input
                id="orderNumber"
                value={filters.orderNumber}
                onChange={(e) => setFilters({...filters, orderNumber: e.target.value})}
                placeholder="Enter order number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="awb">AWB Number</Label>
              <Input
                id="awb"
                value={filters.awb}
                onChange={(e) => setFilters({...filters, awb: e.target.value})}
                placeholder="Enter AWB number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="referenceNumber">Reference Number</Label>
              <Input
                id="referenceNumber"
                value={filters.referenceNumber}
                onChange={(e) => setFilters({...filters, referenceNumber: e.target.value})}
                placeholder="Enter reference number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ticketId">Ticket ID</Label>
              <Input
                id="ticketId"
                value={filters.ticketId}
                onChange={(e) => setFilters({...filters, ticketId: e.target.value})}
                placeholder="Enter ticket ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issueType">Issue Type</Label>
              <Select value={filters.issueType} onValueChange={(value) => setFilters({...filters, issueType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {issueTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shippingCompany">Shipping Company</Label>
              <Select value={filters.shippingCompany} onValueChange={(value) => setFilters({...filters, shippingCompany: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {shippingCompanies.map(company => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issueCategory">Issue Category</Label>
              <Select value={filters.issueCategory} onValueChange={(value) => setFilters({...filters, issueCategory: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {issueCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={filters.priority} onValueChange={(value) => setFilters({...filters, priority: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status || 'all'} onValueChange={(value) => setFilters({...filters, status: value === 'all' ? undefined : value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Responded">Responded</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.fromDate ? format(filters.fromDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.fromDate}
                    onSelect={(date) => setFilters({...filters, fromDate: date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.toDate ? format(filters.toDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.toDate}
                    onSelect={(date) => setFilters({...filters, toDate: date})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tickets</p>
                <p className="text-2xl font-bold">{totalTickets}</p>
              </div>
              <TicketIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Responded</p>
                <p className="text-2xl font-bold text-green-600">{respondedTickets}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-2xl font-bold text-red-600">{notRespondedTickets}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Closed</p>
                <p className="text-2xl font-bold text-blue-600">{closedTickets}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'responded' | 'not-responded' | 'closed')}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({totalTickets})</TabsTrigger>
            <TabsTrigger value="responded">Responded ({respondedTickets})</TabsTrigger>
            <TabsTrigger value="not-responded">Open ({notRespondedTickets})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({closedTickets})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <TicketTable 
              tickets={tabFilteredTickets} 
              onView={handleView}
              onRespond={handleRespond}
              onSort={handleSort}
              sortField={sortField}
              sortOrder={sortOrder}
            />
          </TabsContent>
          
          <TabsContent value="responded">
            <TicketTable 
              tickets={tabFilteredTickets} 
              onView={handleView}
              onRespond={handleRespond}
              onSort={handleSort}
              sortField={sortField}
              sortOrder={sortOrder}
            />
          </TabsContent>
          
          <TabsContent value="not-responded">
            <TicketTable 
              tickets={tabFilteredTickets} 
              onView={handleView}
              onRespond={handleRespond}
              onSort={handleSort}
              sortField={sortField}
              sortOrder={sortOrder}
            />
          </TabsContent>
          
          <TabsContent value="closed">
            <TicketTable 
              tickets={tabFilteredTickets} 
              onView={handleView}
              onRespond={handleRespond}
              onSort={handleSort}
              sortField={sortField}
              sortOrder={sortOrder}
            />
          </TabsContent>
        </Tabs>
      </Card>

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTicket}
      />
      
      <TicketDetailsPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        ticket={selectedTicket}
        onRespond={handleRespond}
        onStatusUpdate={handleStatusUpdate}
      />
      
      <RespondToTicketModal
        isOpen={isRespondModalOpen}
        onClose={() => setIsRespondModalOpen(false)}
        ticket={selectedTicket}
        onSubmit={handleRespondSubmit}
      />
    </div>
  );
};

export default CrmCustomerService;
