import React, { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  Plus,
  Filter,
  X
} from 'lucide-react';
import { DatePicker } from '@/components/crm/DatePicker';
import { StatCard } from '@/components/crm/StatCard';
import { TicketTable } from '@/components/crm/TicketTable';
import { CreateTicketModal } from '@/components/crm/CreateTicketModal';
import { StatusTabs } from '@/components/crm/StatusTabs';
import { Ticket, TicketFormData } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Sample ticket data
const mockTickets: Ticket[] = [
  {
    id: '1',
    ticketId: 'TIC-2025-001',
    orderNumber: 'ORD-2025-10021',
    referenceNumber: 'REF-2025-001',
    issueType: 'Incorrect Phone Number',
    shippingCompany: 'Aramex',
    dateCreated: '2025-01-15 14:30',
    issueCategory: 'Customer Error',
    description: 'Customer provided incorrect phone number, delivery attempted but failed',
    priority: 'High',
    status: 'Not Responded',
    customerName: 'Ahmed Mohamed',
    phone: '+20 123 456 7890',
    attachments: ['screenshot.jpg'],
    createdBy: 'system'
  },
  {
    id: '2',
    ticketId: 'TIC-2025-002',
    orderNumber: 'ORD-2025-10022',
    referenceNumber: 'REF-2025-002',
    issueType: 'Delivery Delay',
    shippingCompany: 'DHL',
    dateCreated: '2025-01-15 15:45',
    issueCategory: 'Shipping Error',
    description: 'Package has been delayed due to weather conditions',
    priority: 'Medium',
    status: 'Responded',
    customerName: 'Sarah Ahmed',
    phone: '+20 123 456 7891',
    lastResponse: '2025-01-15 16:00',
    createdBy: 'cs_agent_1'
  },
  {
    id: '3',
    ticketId: 'TIC-2025-003',
    orderNumber: 'ORD-2025-10023',
    referenceNumber: 'REF-2025-003',
    issueType: 'Damaged Package',
    shippingCompany: 'FedEx',
    dateCreated: '2025-01-15 16:20',
    issueCategory: 'Shipping Error',
    description: 'Package arrived damaged, contents may be affected',
    priority: 'High',
    status: 'Not Responded',
    customerName: 'Mahmoud Ali',
    phone: '+20 123 456 7892',
    attachments: ['damage_photo1.jpg', 'damage_photo2.jpg'],
    createdBy: 'system'
  },
  {
    id: '4',
    ticketId: 'TIC-2025-004',
    orderNumber: 'ORD-2025-10024',
    referenceNumber: 'REF-2025-004',
    issueType: 'Wrong Address',
    shippingCompany: 'UPS',
    dateCreated: '2025-01-14 09:15',
    issueCategory: 'Customer Error',
    description: 'Customer provided incorrect delivery address',
    priority: 'Medium',
    status: 'Resolved',
    customerName: 'Fatima Hassan',
    phone: '+20 123 456 7893',
    lastResponse: '2025-01-14 10:30',
    createdBy: 'cs_agent_2'
  },
  {
    id: '5',
    ticketId: 'TIC-2025-005',
    orderNumber: 'ORD-2025-10025',
    referenceNumber: 'REF-2025-005',
    issueType: 'Customer Unavailable',
    shippingCompany: 'Mylerz',
    dateCreated: '2025-01-14 10:30',
    issueCategory: 'Customer Error',
    description: 'Multiple delivery attempts failed - customer unavailable',
    priority: 'Low',
    status: 'Responded',
    customerName: 'Omar Khalid',
    phone: '+20 123 456 7894',
    lastResponse: '2025-01-14 11:00',
    createdBy: 'system'
  }
];

const CrmCustomerService = () => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(mockTickets);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('dateCreated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Filter states
  const [filters, setFilters] = useState({
    orderNumber: '',
    referenceNumber: '',
    ticketId: '',
    issueType: '',
    shippingCompany: '',
    issueCategory: '',
    priority: '',
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined
  });

  const issueTypes = [
    'Incorrect Phone Number',
    'Delivery Delay',
    'Damaged Package',
    'Wrong Address',
    'Customer Unavailable',
    'Payment Issue',
    'Package Lost',
    'Delivery Refused',
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

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    let filtered = tickets;

    // Apply filters
    if (filters.orderNumber) {
      filtered = filtered.filter(ticket => 
        ticket.orderNumber.toLowerCase().includes(filters.orderNumber.toLowerCase())
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
    if (filters.issueType) {
      filtered = filtered.filter(ticket => ticket.issueType === filters.issueType);
    }
    if (filters.shippingCompany) {
      filtered = filtered.filter(ticket => ticket.shippingCompany === filters.shippingCompany);
    }
    if (filters.issueCategory) {
      filtered = filtered.filter(ticket => ticket.issueCategory === filters.issueCategory);
    }
    if (filters.priority) {
      filtered = filtered.filter(ticket => ticket.priority === filters.priority);
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

    // Apply tab filter
    if (activeTab === 'responded') {
      filtered = filtered.filter(ticket => ticket.status === 'Responded' || ticket.status === 'Resolved');
    } else if (activeTab === 'not-responded') {
      filtered = filtered.filter(ticket => ticket.status === 'Not Responded');
    }

    setFilteredTickets(filtered);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      orderNumber: '',
      referenceNumber: '',
      ticketId: '',
      issueType: '',
      shippingCompany: '',
      issueCategory: '',
      priority: '',
      fromDate: undefined,
      toDate: undefined
    });
    setFilteredTickets(tickets);
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    
    const sorted = [...filteredTickets].sort((a, b) => {
      const aValue = a[field as keyof Ticket];
      const bValue = b[field as keyof Ticket];
      
      if (aValue < bValue) return newOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return newOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredTickets(sorted);
  };

  const handleCreateTicket = async (formData: TicketFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTicket: Ticket = {
      id: Date.now().toString(),
      ticketId: `TIC-2025-${String(tickets.length + 1).padStart(3, '0')}`,
      orderNumber: formData.orderNumber,
      referenceNumber: formData.referenceNumber,
      issueType: formData.issueType,
      shippingCompany: formData.shippingCompany,
      dateCreated: new Date().toISOString().slice(0, 19).replace('T', ' '),
      issueCategory: formData.issueCategory,
      description: formData.description,
      priority: formData.priority,
      status: 'Not Responded',
      customerName: 'Unknown', // Would be fetched from order data
      phone: 'Unknown', // Would be fetched from order data
      attachments: formData.attachments?.map(file => file.name) || [],
      createdBy: 'current_user'
    };
    
    setTickets(prev => [newTicket, ...prev]);
    setFilteredTickets(prev => [newTicket, ...prev]);
  };

  const handleViewTicket = (id: string) => {
    console.log('Viewing ticket:', id);
    // Implement ticket detail view
  };

  const handleRespondToTicket = (id: string) => {
    console.log('Responding to ticket:', id);
    // Implement ticket response functionality
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    let filtered = tickets;

    if (tab === 'responded') {
      filtered = filtered.filter(ticket => ticket.status === 'Responded' || ticket.status === 'Resolved');
    } else if (tab === 'not-responded') {
      filtered = filtered.filter(ticket => ticket.status === 'Not Responded');
    }

    setFilteredTickets(filtered);
    setCurrentPage(1);
  };

  const stats = [
    {
      title: 'Total Tickets',
      value: tickets.length,
      icon: <AlertTriangle className="text-blue-600" />,
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Responded',
      value: tickets.filter(t => t.status === 'Responded' || t.status === 'Resolved').length,
      icon: <CheckCircle className="text-green-600" />,
      bgColor: 'bg-green-50'
    },
    {
      title: 'Not Responded',
      value: tickets.filter(t => t.status === 'Not Responded').length,
      icon: <Clock className="text-red-600" />,
      bgColor: 'bg-red-50'
    }
  ];

  const tabs = [
    { id: 'all', label: 'All', count: tickets.length },
    { id: 'responded', label: 'Responded', count: tickets.filter(t => t.status === 'Responded' || t.status === 'Resolved').length },
    { id: 'not-responded', label: 'Not Responded', count: tickets.filter(t => t.status === 'Not Responded').length }
  ];

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold">CRM Customer Service</h1>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Ticket
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Filters</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Date From</Label>
              <DatePicker
                date={filters.fromDate}
                setDate={(date) => setFilters(prev => ({ ...prev, fromDate: date }))}
                placeholder="Select start date"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Date To</Label>
              <DatePicker
                date={filters.toDate}
                setDate={(date) => setFilters(prev => ({ ...prev, toDate: date }))}
                placeholder="Select end date"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Order Number</Label>
              <Input
                value={filters.orderNumber}
                onChange={(e) => handleFilterChange('orderNumber', e.target.value)}
                placeholder="Enter order number"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Reference Number</Label>
              <Input
                value={filters.referenceNumber}
                onChange={(e) => handleFilterChange('referenceNumber', e.target.value)}
                placeholder="Enter reference number"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Ticket ID</Label>
              <Input
                value={filters.ticketId}
                onChange={(e) => handleFilterChange('ticketId', e.target.value)}
                placeholder="Enter ticket ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Issue Type</Label>
              <Select value={filters.issueType} onValueChange={(value) => handleFilterChange('issueType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {issueTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Shipping Company</Label>
              <Select value={filters.shippingCompany} onValueChange={(value) => handleFilterChange('shippingCompany', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Companies</SelectItem>
                  {shippingCompanies.map(company => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Issue Category</Label>
              <Select value={filters.issueCategory} onValueChange={(value) => handleFilterChange('issueCategory', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {issueCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priorities</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90"
            >
              <Search className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              bgColor={stat.bgColor}
            />
          ))}
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-lg shadow">
          <StatusTabs
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            tabs={tabs}
          />
          
          <TicketTable
            tickets={filteredTickets}
            onView={handleViewTicket}
            onRespond={handleRespondToTicket}
            onSort={handleSort}
            sortField={sortField}
            sortOrder={sortOrder}
          />
          
          {/* Pagination */}
          <div className="py-4 px-6 border-t">
            <nav className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button 
                  variant="outline" 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(p => Math.max(1, p-1))}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentPage(p => p+1)}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of tickets
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <Button
                      variant="outline"
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p-1))}
                    >
                      Previous
                    </Button>
                    {[1, 2, 3].map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        className="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium"
                      onClick={() => setCurrentPage(p => p+1)}
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Create Ticket Modal */}
        <CreateTicketModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTicket}
        />
      </div>
    </PageLayout>
  );
};

export default CrmCustomerService;