
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PeriodDropdown, { defaultPeriods } from '../components/dashboard/PeriodDropdown';
import { SearchBox } from '@/components/ui/SearchBox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Filter, ArrowUp, ArrowDown, DollarSign, CircleDollarSign, Check } from 'lucide-react';

// Sample financial data
const codTransactions = [
  {
    id: 'TXN-3452',
    orderId: 'ORD-9876',
    date: '2025-04-22T09:15:00Z',
    customerName: 'Emily Johnson',
    courier: 'FedEx',
    amount: 129.99,
    status: 'collected',
    paidOut: true,
    paidDate: '2025-04-23T14:30:00Z'
  },
  {
    id: 'TXN-3451',
    orderId: 'ORD-9875',
    date: '2025-04-22T10:45:00Z',
    customerName: 'Michael Chen',
    courier: 'DHL',
    amount: 78.50,
    status: 'collected',
    paidOut: false,
    paidDate: null
  },
  {
    id: 'TXN-3450',
    orderId: 'ORD-9874',
    date: '2025-04-21T14:20:00Z',
    customerName: 'Sarah Williams',
    courier: 'UPS',
    amount: 235.00,
    status: 'in-transit',
    paidOut: false,
    paidDate: null
  },
  {
    id: 'TXN-3449',
    orderId: 'ORD-9873',
    date: '2025-04-21T16:50:00Z',
    customerName: 'Robert Taylor',
    courier: 'FedEx',
    amount: 55.75,
    status: 'returned',
    paidOut: false,
    paidDate: null
  },
  {
    id: 'TXN-3448',
    orderId: 'ORD-9872',
    date: '2025-04-20T11:30:00Z',
    customerName: 'Jennifer Miller',
    courier: 'DHL',
    amount: 149.99,
    status: 'collected',
    paidOut: true,
    paidDate: '2025-04-21T15:45:00Z'
  }
];

const statusClasses: Record<string, string> = {
  'collected': 'bg-success-light text-green-800',
  'in-transit': 'bg-info-light text-blue-800',
  'returned': 'bg-danger-light text-red-800'
};

const FinancialPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  
  // Check if sidebar is collapsed from localStorage
  React.useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setSidebarCollapsed(savedState === 'true');
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div 
        className="flex-1 transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarCollapsed ? '5rem' : '16rem' }}
      >
        <Header className="sticky top-0 z-10" />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Financial</h1>
            <div className="flex gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Download size={18} /> Export Reports
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total COD</p>
                  <p className="text-2xl font-semibold">$45,892.50</p>
                </div>
                <div className="h-12 w-12 bg-info-light rounded-full flex items-center justify-center text-info">
                  <CircleDollarSign size={24} />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">COD Collected</p>
                  <p className="text-2xl font-semibold">$32,456.75</p>
                </div>
                <div className="h-12 w-12 bg-success-light rounded-full flex items-center justify-center text-success">
                  <ArrowUp size={24} />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Collection</p>
                  <p className="text-2xl font-semibold">$10,225.00</p>
                </div>
                <div className="h-12 w-12 bg-warning-light rounded-full flex items-center justify-center text-warning">
                  <DollarSign size={24} />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Shipping Costs</p>
                  <p className="text-2xl font-semibold">$3,210.75</p>
                </div>
                <div className="h-12 w-12 bg-danger-light rounded-full flex items-center justify-center text-danger">
                  <ArrowDown size={24} />
                </div>
              </div>
            </Card>
          </div>
          
          <Tabs defaultValue="cod" className="mb-6">
            <TabsList>
              <TabsTrigger value="cod">COD Transactions</TabsTrigger>
              <TabsTrigger value="payouts">Courier Payouts</TabsTrigger>
              <TabsTrigger value="shipping">Shipping Costs</TabsTrigger>
              <TabsTrigger value="returns">Return Fees</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cod">
              <Card>
                <div className="p-6 border-b">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-medium">Cash On Delivery Transactions</h3>
                    <PeriodDropdown
                      periods={defaultPeriods}
                      selectedPeriod="30d"
                      onPeriodChange={() => {}}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <SearchBox placeholder="Search transactions..." />
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
                    <Badge variant="outline" className="bg-white cursor-pointer">All Transactions</Badge>
                    <Badge variant="outline" className="bg-white cursor-pointer">Collected</Badge>
                    <Badge variant="outline" className="bg-white cursor-pointer">In Transit</Badge>
                    <Badge variant="outline" className="bg-white cursor-pointer">Returned</Badge>
                    <Badge variant="outline" className="bg-white cursor-pointer">Paid Out</Badge>
                    <Badge variant="outline" className="bg-white cursor-pointer">Pending Payout</Badge>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Courier</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Paid to Merchant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {codTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.id}</TableCell>
                          <TableCell>{transaction.orderId}</TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>{transaction.customerName}</TableCell>
                          <TableCell>{transaction.courier}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[transaction.status]}`}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${transaction.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {transaction.paidOut ? (
                              <div className="flex items-center gap-1">
                                <Check size={16} className="text-success" />
                                <span className="text-sm">{new Date(transaction.paidDate!).toLocaleDateString()}</span>
                              </div>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100">Pending</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="payouts">
              <Card className="p-6">
                <div className="min-h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Courier payouts view will be implemented here</p>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="shipping">
              <Card className="p-6">
                <div className="min-h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Shipping costs view will be implemented here</p>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="returns">
              <Card className="p-6">
                <div className="min-h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Return fees view will be implemented here</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default FinancialPage;
