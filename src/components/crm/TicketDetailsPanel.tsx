
import React, { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetClose 
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  User, 
  Package, 
  Building, 
  AlertCircle, 
  Clock, 
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  MessageSquare,
  X,
  Download
} from 'lucide-react';
import { Ticket, OrderData } from '@/types';

interface TicketDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onRespond?: (ticketId: string) => void;
  onStatusUpdate?: (ticketId: string, status: string) => void;
}

export const TicketDetailsPanel: React.FC<TicketDetailsPanelProps> = ({
  isOpen,
  onClose,
  ticket,
  onRespond,
  onStatusUpdate
}) => {
  const [activeTab, setActiveTab] = useState('ticket');

  if (!ticket) return null;

  // Mock order data for the Order Details tab
  const orderData: OrderData = {
    orderNumber: ticket.orderNumber,
    customerName: ticket.customerName,
    customerPhone: ticket.phone,
    customerEmail: 'customer@email.com',
    shippingCompany: ticket.shippingCompany,
    shippingAddress: '123 Main St, Cairo, Egypt',
    totalAmount: 250.00,
    paymentMethod: 'Cash',
    orderDate: ticket.dateCreated,
    status: 'In Transit',
    items: [
      { id: '1', name: 'Sample Product', quantity: 1, price: 250.00, sku: 'PROD-001' }
    ]
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Open</Badge>;
      case 'responded':
        return <Badge variant="default" className="bg-green-100 text-green-800">Responded</Badge>;
      case 'closed':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:w-[800px] sm:max-w-[90vw] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold">
              Ticket {ticket.ticketId}
            </SheetTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(ticket.status)}
              {getPriorityBadge(ticket.priority)}
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ticket">Ticket Details</TabsTrigger>
              <TabsTrigger value="order">Order Details</TabsTrigger>
            </TabsList>

            <TabsContent value="ticket" className="mt-6 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Order Number:</span>
                        <span className="text-sm font-semibold text-blue-600">{ticket.orderNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">AWB:</span>
                        <span className="text-sm">{ticket.awb}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Reference:</span>
                        <span className="text-sm">{ticket.referenceNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Shipping Company:</span>
                        <span className="text-sm">{ticket.shippingCompany}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Created:</span>
                        <span className="text-sm">{formatDate(ticket.dateCreated)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Created By:</span>
                        <span className="text-sm">{ticket.createdBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Status:</span>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Priority:</span>
                        {getPriorityBadge(ticket.priority)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Issue Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Issue Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Issue Type</h4>
                      <Badge variant="outline" className="text-sm">{ticket.issueType}</Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Issue Category</h4>
                      <Badge variant="outline" className="text-sm">{ticket.issueCategory}</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Description</h4>
                    <div className="bg-muted/50 p-4 rounded-md">
                      <p className="text-sm leading-relaxed">{ticket.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm">{ticket.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Phone:</span>
                    <span className="text-sm">{ticket.phone}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Attachments */}
              {ticket.attachments && ticket.attachments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Attachments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {ticket.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{attachment}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {ticket.status === 'Open' && onRespond && (
                  <Button 
                    onClick={() => onRespond(ticket.id)}
                    className="flex-1"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Respond to Ticket
                  </Button>
                )}
                
                {onStatusUpdate && (
                  <div className="flex gap-2">
                    {ticket.status !== 'Responded' && (
                      <Button 
                        variant="outline"
                        onClick={() => onStatusUpdate(ticket.id, 'Responded')}
                      >
                        Mark as Responded
                      </Button>
                    )}
                    {ticket.status !== 'Closed' && (
                      <Button 
                        variant="outline"
                        onClick={() => onStatusUpdate(ticket.id, 'Closed')}
                      >
                        Close Ticket
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="order" className="mt-6 space-y-6">
              {/* Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Order Number:</span>
                        <span className="text-sm font-semibold text-blue-600">{orderData.orderNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Order Date:</span>
                        <span className="text-sm">{formatDate(orderData.orderDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Payment Method:</span>
                        <span className="text-sm">{orderData.paymentMethod}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Shipping Company:</span>
                        <span className="text-sm">{orderData.shippingCompany}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Status:</span>
                        <Badge variant="outline">{orderData.status}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Total Amount:</span>
                        <span className="text-sm font-semibold">${orderData.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm">{orderData.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Phone:</span>
                    <span className="text-sm">{orderData.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm">{orderData.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Address:</span>
                    <span className="text-sm">{orderData.shippingAddress}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orderData.items.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{item.name}</span>
                            <Badge variant="outline" className="text-xs">{item.sku}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Quantity: {item.quantity}
                          </div>
                        </div>
                        <div className="text-sm font-semibold">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Amount:</span>
                    <span className="text-lg font-bold">${orderData.totalAmount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};
