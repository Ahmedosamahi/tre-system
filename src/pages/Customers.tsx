
import React from 'react';
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
import { Filter, Plus, MapPin, Star, Phone, Eye, Edit, Mail } from 'lucide-react';

// Sample customers data
const customers = [
  {
    id: 'CUST001',
    name: 'John Anderson',
    email: 'john.anderson@example.com',
    phone: '+1 555-123-4567',
    city: 'New York',
    state: 'NY',
    orders: 24,
    totalSpent: 1845.75,
    status: 'loyal',
    lastOrder: '2025-04-18'
  },
  {
    id: 'CUST002',
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone: '+1 555-234-5678',
    city: 'Los Angeles',
    state: 'CA',
    orders: 18,
    totalSpent: 1250.50,
    status: 'active',
    lastOrder: '2025-04-20'
  },
  {
    id: 'CUST003',
    name: 'Robert Smith',
    email: 'robert.smith@example.com',
    phone: '+1 555-345-6789',
    city: 'Chicago',
    state: 'IL',
    orders: 7,
    totalSpent: 523.89,
    status: 'new',
    lastOrder: '2025-04-22'
  },
  {
    id: 'CUST004',
    name: 'Emily Johnson',
    email: 'emily.j@example.com',
    phone: '+1 555-456-7890',
    city: 'Houston',
    state: 'TX',
    orders: 4,
    totalSpent: 195.45,
    status: 'at-risk',
    lastOrder: '2025-02-15'
  },
  {
    id: 'CUST005',
    name: 'David Wilson',
    email: 'david.w@example.com',
    phone: '+1 555-567-8901',
    city: 'Miami',
    state: 'FL',
    orders: 31,
    totalSpent: 2450.00,
    status: 'loyal',
    lastOrder: '2025-04-21'
  }
];

const statusColors: Record<string, string> = {
  'loyal': 'bg-success-light text-green-800',
  'active': 'bg-info-light text-blue-800',
  'new': 'bg-warning-light text-yellow-800',
  'at-risk': 'bg-danger-light text-red-800'
};

const CustomersPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header className="sticky top-0 z-10" />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
            <Button className="bg-brand text-white hover:bg-brand-dark flex items-center gap-2">
              <Plus size={18} /> Add Customer
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="p-6">
              <div className="flex flex-col items-center justify-center">
                <div className="text-2xl font-semibold">458</div>
                <div className="text-sm text-gray-500">Total Customers</div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex flex-col items-center justify-center">
                <div className="text-2xl font-semibold text-success">87</div>
                <div className="text-sm text-gray-500">Loyal Customers</div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex flex-col items-center justify-center">
                <div className="text-2xl font-semibold text-warning">45</div>
                <div className="text-sm text-gray-500">New This Month</div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex flex-col items-center justify-center">
                <div className="text-2xl font-semibold text-danger">23</div>
                <div className="text-sm text-gray-500">At Risk</div>
              </div>
            </Card>
          </div>
          
          <Card className="mb-6">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <SearchBox placeholder="Search by name, email, customer ID..." />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
                    <Filter size={16} /> Filter
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2 flex-wrap">
                <Badge variant="outline" className="bg-white cursor-pointer">All Customers</Badge>
                <Badge variant="outline" className="bg-white cursor-pointer">Loyal</Badge>
                <Badge variant="outline" className="bg-white cursor-pointer">Active</Badge>
                <Badge variant="outline" className="bg-white cursor-pointer">New</Badge>
                <Badge variant="outline" className="bg-white cursor-pointer">At Risk</Badge>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.id}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail size={14} className="text-gray-500" /> {customer.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone size={14} className="text-gray-500" /> {customer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-gray-500" />
                          {customer.city}, {customer.state}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[customer.status]}`}>
                          {customer.status === 'loyal' && <Star size={12} className="mr-1" />}
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{customer.orders}</TableCell>
                      <TableCell className="text-right font-medium">${customer.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>{new Date(customer.lastOrder).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye size={16} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit size={16} />
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

export default CustomersPage;
