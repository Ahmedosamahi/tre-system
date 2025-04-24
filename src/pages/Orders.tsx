
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { SearchBox } from '@/components/ui/SearchBox';
import StatusBadge from '@/components/ui/StatusBadge';
import { Filter, Upload, Download, Plus, Edit, Eye, Trash } from 'lucide-react';

// Sample order data
const orders = [
  {
    id: 'ORD-3452',
    customerName: 'Sarah Johnson',
    date: '2025-04-22',
    total: 129.99,
    status: 'delivered',
    items: 3,
    address: 'New York, NY',
    courier: 'FedEx'
  },
  {
    id: 'ORD-3451',
    customerName: 'Michael Chen',
    date: '2025-04-22',
    total: 78.50,
    status: 'in-transit',
    items: 2,
    address: 'Chicago, IL',
    courier: 'DHL'
  },
  {
    id: 'ORD-3450',
    customerName: 'Emma Williams',
    date: '2025-04-21',
    total: 235.00,
    status: 'pending',
    items: 5,
    address: 'San Francisco, CA',
    courier: 'UPS'
  },
  {
    id: 'ORD-3449',
    customerName: 'James Miller',
    date: '2025-04-21',
    total: 42.99,
    status: 'returned',
    items: 1,
    address: 'Austin, TX',
    courier: 'USPS'
  },
  {
    id: 'ORD-3448',
    customerName: 'Olivia Garcia',
    date: '2025-04-20',
    total: 165.75,
    status: 'picked-up',
    items: 4,
    address: 'Miami, FL',
    courier: 'DHL'
  },
  {
    id: 'ORD-3447',
    customerName: 'Alex Johnson',
    date: '2025-04-20',
    total: 89.99,
    status: 'delivered',
    items: 2,
    address: 'Seattle, WA',
    courier: 'FedEx'
  }
];

const statusLabels: Record<string, { label: string; status: 'success' | 'info' | 'warning' | 'danger' | 'default' }> = {
  'delivered': { label: 'Delivered', status: 'success' },
  'in-transit': { label: 'In Transit', status: 'info' },
  'pending': { label: 'Pending', status: 'warning' },
  'returned': { label: 'Returned', status: 'danger' },
  'picked-up': { label: 'Picked Up', status: 'default' }
};

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header className="sticky top-0 z-10" />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Upload size={18} /> Import
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download size={18} /> Export
              </Button>
              <Button className="bg-brand text-white hover:bg-brand-dark flex items-center gap-2">
                <Plus size={18} /> New Order
              </Button>
            </div>
          </div>
          
          <Card className="mb-6">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <SearchBox placeholder="Search by order ID, customer name..." />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
                    <Filter size={16} /> Filter
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center gap-2">
                    <Download size={16} /> Export
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2 flex-wrap">
                <Badge variant="outline" className="bg-white cursor-pointer">All Orders</Badge>
                <Badge variant="outline" className="bg-white cursor-pointer">Pending</Badge>
                <Badge variant="outline" className="bg-white cursor-pointer">In Transit</Badge>
                <Badge variant="outline" className="bg-white cursor-pointer">Delivered</Badge>
                <Badge variant="outline" className="bg-white cursor-pointer">Returned</Badge>
                <Badge variant="outline" className="bg-white cursor-pointer">Picked Up</Badge>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Delivery Address</TableHead>
                    <TableHead>Courier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>{order.address}</TableCell>
                      <TableCell>{order.courier}</TableCell>
                      <TableCell>
                        <StatusBadge status={statusLabels[order.status].status}>
                          {statusLabels[order.status].label}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye size={16} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit size={16} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default OrdersPage;
