import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  Filter,
  Eye
} from 'lucide-react';
import { CreateTicketModal } from '@/components/crm/CreateTicketModal';
import { TicketDetailsPanel } from '@/components/crm/TicketDetailsPanel';
import { StatusTabs } from '@/components/crm/StatusTabs';

// Mock data for demonstration
const mockTickets = [
  {
    id: 'TK-001',
    ticketId: 'TK-001',
    orderNumber: 'ORD-2024-001',
    awb: 'AWB123456789',
    referenceNumber: 'REF001',
    issueType: 'Delivery Delay',
    shippingCompany: 'Express Logistics',
    dateCreated: '2024-01-15',
    issueCategory: 'Shipping Error',
    status: 'Open' as const,
    priority: 'High' as const,
    description: 'Package has been delayed for 3 days without any updates.',
    customerName: 'Ahmed Hassan',
    phone: '+971501234567',
    createdBy: 'support@example.com'
  },
  {
    id: 'TK-002',
    ticketId: 'TK-002',
    orderNumber: 'ORD-2024-002',
    awb: 'AWB987654321',
    referenceNumber: 'REF002',
    issueType: 'Damaged Goods',
    shippingCompany: 'Fast Delivery',
    dateCreated: '2024-01-14',
    issueCategory: 'Customer Error',
    status: 'Responded' as const,
    priority: 'Medium' as const,
    description: 'Customer received damaged package, requesting replacement.',
    customerName: 'Sarah Mohammed',
    phone: '+971509876543',
    createdBy: 'support@example.com'
  },
  {
    id: 'TK-003',
    ticketId: 'TK-003',
    orderNumber: 'ORD-2024-003',
    awb: 'AWB456789123',
    referenceNumber: 'REF003',
    issueType: 'Incorrect Customer Information',
    shippingCompany: 'Quick Ship',
    dateCreated: '2024-01-13',
    issueCategory: 'Data Entry Error',
    status: 'Closed' as const,
    priority: 'Low' as const,
    description: 'Wrong phone number provided, updated successfully.',
    customerName: 'Omar Ali',
    phone: '+971507654321',
    createdBy: 'support@example.com'
  }
];

const statusCounts = {
  all: mockTickets.length,
  open: mockTickets.filter(t => t.status === 'Open').length,
  responded: mockTickets.filter(t => t.status === 'Responded').length,
  closed: mockTickets.filter(t => t.status === 'Closed').length
};

export const TicketingIntegration = () => {
  const [selectedTicket, setSelectedTicket] = useState<typeof mockTickets[0] | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState('all');

  const handleViewTicket = (ticket: typeof mockTickets[0]) => {
    setSelectedTicket(ticket);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedTicket(null);
  };

  const handleCreateTicket = (ticketData: any) => {
    console.log('Creating ticket:', ticketData);
    // Here you would submit the ticket to the API
    setIsCreateModalOpen(false);
  };

  const statusTabs = [
    { id: 'all', label: 'All', count: statusCounts.all },
    { id: 'open', label: 'Open', count: statusCounts.open },
    { id: 'responded', label: 'Responded', count: statusCounts.responded },
    { id: 'closed', label: 'Closed', count: statusCounts.closed }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'Responded': return 'bg-blue-100 text-blue-800';
      case 'Closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <Clock className="h-4 w-4" />;
      case 'Responded': return <MessageSquare className="h-4 w-4" />;
      case 'Closed': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const filteredTickets = activeStatus === 'all' 
    ? mockTickets 
    : mockTickets.filter(ticket => ticket.status.toLowerCase() === activeStatus.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Support Tickets</h2>
          <p className="text-gray-600">Manage and track customer support requests</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Ticket
        </Button>
      </div>

      {/* Status Tabs */}
      <StatusTabs 
        activeTab={activeStatus}
        setActiveTab={setActiveStatus}
        tabs={statusTabs}
      />

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No tickets found for the selected status.</p>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(ticket.status)}
                      <Badge variant="outline" className="text-xs">
                        {ticket.id}
                      </Badge>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {ticket.issueType}
                        </h3>
                        <Badge className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Order: {ticket.orderNumber}</span>
                        <span>AWB: {ticket.awb}</span>
                        <span>Customer: {ticket.customerName}</span>
                        <span>Date: {ticket.dateCreated}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {ticket.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewTicket(ticket)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>
            Fast access to common support tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('/crm-customer-service', '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open Full CRM
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveStatus('open')}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              View Open Tickets
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Ticket
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Ticket Modal */}
      <CreateTicketModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTicket}
      />

      {/* Ticket Details Panel */}
      {selectedTicket && (
        <TicketDetailsPanel 
          ticket={selectedTicket}
          isOpen={isPanelOpen}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
};