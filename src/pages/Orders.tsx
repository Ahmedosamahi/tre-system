import React, { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Order } from '../types/Order';
import { User } from '../types/User';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Filter, Download, Plus, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

const mockOrders: Order[] = [
  // Sample mock data
  {
    id: '1',
    orderNumber: '1001',
    customerName: 'John Doe',
    customerPhone: '123-456-7890',
    address: '123 Main St',
    city: 'Anytown',
    status: 'pending',
    amount: 100,
    createdAt: new Date().toISOString(),
  },
  // Add more mock orders as needed
];

const Orders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'dispatched': return 'default';
      case 'delivered': return 'default';
      case 'returned': return 'secondary';
      case 'canceled': return 'destructive';
      default: return 'default';
    }
  };

  const allOrders = mockOrders; // Replace with actual data fetching logic
  const pendingOrders = allOrders.filter(order => order.status === 'pending');
  const confirmedOrders = allOrders.filter(order => order.status === 'confirmed');
  const dispatchedOrders = allOrders.filter(order => order.status === 'dispatched');
  const deliveredOrders = allOrders.filter(order => order.status === 'delivered');
  const returnedOrders = allOrders.filter(order => order.status === 'returned');
  const canceledOrders = allOrders.filter(order => order.status === 'canceled');

  const getCurrentPageOrders = (orders: Order[]) => {
    // Implement pagination logic if needed
    return orders;
  };

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold">Orders</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({mockOrders.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({confirmedOrders.length})</TabsTrigger>
          <TabsTrigger value="dispatched">Dispatched ({dispatchedOrders.length})</TabsTrigger>
          <TabsTrigger value="delivered">Delivered ({deliveredOrders.length})</TabsTrigger>
          <TabsTrigger value="returned">Returned ({returnedOrders.length})</TabsTrigger>
          <TabsTrigger value="canceled">Canceled ({canceledOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="p-4 text-left">
                        <Checkbox
                          checked={selectedOrders.length === allOrders.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedOrders(allOrders.map(order => order.id));
                            } else {
                              setSelectedOrders([]);
                            }
                          }}
                        />
                      </th>
                      <th className="p-4 text-left font-medium">Order #</th>
                      <th className="p-4 text-left font-medium">Customer</th>
                      <th className="p-4 text-left font-medium">Address</th>
                      <th className="p-4 text-left font-medium">Status</th>
                      <th className="p-4 text-left font-medium">Amount</th>
                      <th className="p-4 text-left font-medium">Date</th>
                      <th className="p-4 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCurrentPageOrders(allOrders).map((order) => (
                      <tr key={order.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedOrders([...selectedOrders, order.id]);
                              } else {
                                setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                              }
                            }}
                          />
                        </td>
                        <td className="p-4 font-medium">{order.orderNumber}</td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                          </div>
                        </td>
                        <td className="p-4 text-sm">{order.address}, {order.city}</td>
                        <td className="p-4">
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4 font-medium">${order.amount}</td>
                        <td className="p-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Order</DropdownMenuItem>
                              <DropdownMenuItem>Track Order</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Cancel Order</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Orders;
