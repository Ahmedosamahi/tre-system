
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
import { Plus, Edit, Trash2, ChevronDown, Mail, Phone, User } from 'lucide-react';
import { Customer } from '@/types';
import { CustomerModal } from '@/components/customers/CustomerModal';
import { DeleteCustomerModal } from '@/components/customers/DeleteCustomerModal';

// Sample customer data
const initialCustomers: Customer[] = [
  {
    id: 'CUST001',
    name: 'John Anderson',
    email: 'john.anderson@example.com',
    phone: '+1 555-123-4567',
    address: '123 Main St, New York, NY 10001',
    ordersCount: 24,
    qualityScore: 95,
    status: 'Active',
    orders: [
      { id: 'ORD001', date: '2025-04-18', status: 'Delivered', courier: 'Bosta', amount: 89.99 },
      { id: 'ORD002', date: '2025-04-15', status: 'Delivered', courier: 'Aramex', amount: 156.50 },
      { id: 'ORD003', date: '2025-04-10', status: 'Rejected', courier: 'Mylerz', amount: 78.25 }
    ]
  },
  {
    id: 'CUST002',
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone: '+1 555-234-5678',
    address: '456 Oak Ave, Los Angeles, CA 90210',
    ordersCount: 18,
    qualityScore: 88,
    status: 'Active',
    orders: [
      { id: 'ORD004', date: '2025-04-20', status: 'Delivered', courier: 'Bosta', amount: 125.00 },
      { id: 'ORD005', date: '2025-04-17', status: 'In Transit', courier: 'Aramex', amount: 89.99 }
    ]
  },
  {
    id: 'CUST003',
    name: 'Robert Smith',
    email: 'robert.smith@example.com',
    phone: '+1 555-345-6789',
    address: '789 Pine St, Chicago, IL 60601',
    ordersCount: 7,
    qualityScore: 71,
    status: 'Active',
    orders: [
      { id: 'ORD006', date: '2025-04-22', status: 'Delivered', courier: 'Mylerz', amount: 67.50 }
    ]
  },
  {
    id: 'CUST004',
    name: 'Emily Johnson',
    email: 'emily.j@example.com',
    phone: '+1 555-456-7890',
    address: '321 Elm St, Houston, TX 77001',
    ordersCount: 4,
    qualityScore: 45,
    status: 'Inactive',
    orders: [
      { id: 'ORD007', date: '2025-02-15', status: 'Rejected', courier: 'Aramex', amount: 195.45 }
    ]
  }
];

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getQualityScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getQualityScoreBadge = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'danger';
  };

  const getStatusBadge = (status: string) => {
    return status === 'Delivered' ? 'success' : 
           status === 'Rejected' ? 'danger' :
           status === 'In Transit' ? 'info' : 'warning';
  };

  return (
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <p className="text-2xl font-semibold">{customers.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <User size={24} />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Customers</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {customers.filter(c => c.status === 'Active').length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <User size={24} />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Quality Score</p>
                  <p className="text-2xl font-semibold">
                    {Math.round(customers.reduce((acc, c) => acc + c.qualityScore, 0) / customers.length)}%
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <User size={24} />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-semibold">
                    {customers.reduce((acc, c) => acc + c.ordersCount, 0)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  <User size={24} />
                </div>
              </div>
            </Card>
          </div>
          
          <Card>
            <div className="p-6 border-b">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <SearchBox 
                    placeholder="Search customers by name, email, or phone..." 
                    value={searchTerm}
                    onChange={setSearchTerm}
                  />
                </div>
              </div>
              
              <div className="mt-4 flex gap-2 flex-wrap">
                <Badge variant="outline" className="bg-white cursor-pointer">All Customers</Badge>
                <Badge variant="outline" className="bg-white cursor-pointer">Active</Badge>
                <Badge variant="outline" className="bg-white cursor-pointer">Inactive</Badge>
                <Badge variant="outline" className="bg-white cursor-pointer">High Quality</Badge>
                <Badge variant="outline" className="bg-white cursor-pointer">Low Quality</Badge>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
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
                        <TableCell className="font-medium">{customer.name}</TableCell>
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
                        <TableCell className="text-center font-medium">{customer.ordersCount}</TableCell>
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
                                customer.qualityScore >= 90 ? 'bg-green-50 text-green-700' :
                                customer.qualityScore >= 70 ? 'bg-yellow-50 text-yellow-700' :
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
                              onClick={() => handleEditCustomer(customer)}
                              className="hover:bg-blue-50 hover:text-blue-600"
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
                          <TableCell colSpan={7} className="bg-gray-50 p-0">
                            <Collapsible open={expandedRows.has(customer.id)}>
                              <CollapsibleContent>
                                <div className="p-4">
                                  <h4 className="font-medium mb-3">Recent Orders</h4>
                                  <div className="grid gap-2">
                                    {customer.orders.map((order) => (
                                      <div key={order.id} className="flex items-center justify-between bg-white p-3 rounded border">
                                        <div className="flex items-center gap-4">
                                          <span className="font-medium">{order.id}</span>
                                          <span className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</span>
                                          <Badge variant="outline" className={
                                            order.status === 'Delivered' ? 'bg-green-50 text-green-700' :
                                            order.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                                            order.status === 'In Transit' ? 'bg-blue-50 text-blue-700' :
                                            'bg-yellow-50 text-yellow-700'
                                          }>
                                            {order.status}
                                          </Badge>
                                          <span className="text-sm">{order.courier}</span>
                                        </div>
                                        <span className="font-medium">${order.amount.toFixed(2)}</span>
                                      </div>
                                    ))}
                                  </div>
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
    </div>
  );
};

export default CustomersPage;
