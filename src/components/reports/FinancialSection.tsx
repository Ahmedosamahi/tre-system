
import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Eye, TrendingUp, DollarSign, CreditCard } from 'lucide-react';

const cashCycleData = [
  { month: 'Jan', collected: 45000, fees: 3500, net: 41500 },
  { month: 'Feb', collected: 52000, fees: 4200, net: 47800 },
  { month: 'Mar', collected: 48000, fees: 3800, net: 44200 },
  { month: 'Apr', collected: 58000, fees: 4600, net: 53400 },
  { month: 'May', collected: 61000, fees: 4900, net: 56100 },
  { month: 'Jun', collected: 55000, fees: 4400, net: 50600 }
];

const cashOutData = [
  { id: 'TXN-001', date: '2024-01-15', amount: 12500, status: 'Completed', type: 'Monthly Payout' },
  { id: 'TXN-002', date: '2024-01-10', amount: 8750, status: 'Completed', type: 'Weekly Payout' },
  { id: 'TXN-003', date: '2024-01-08', amount: 15200, status: 'Processing', type: 'Special Payout' },
  { id: 'TXN-004', date: '2024-01-05', amount: 9800, status: 'Completed', type: 'Weekly Payout' },
  { id: 'TXN-005', date: '2024-01-01', amount: 22400, status: 'Completed', type: 'Monthly Payout' }
];

const orderValueData = [
  { type: 'Cash Orders', count: 8450, value: 385000, avg: 45.6 },
  { type: 'Card Orders', count: 4250, value: 298000, avg: 70.1 },
  { type: 'Online Payment', count: 3150, value: 245000, avg: 77.8 }
];

export const FinancialSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Financial Summary</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Average Order Value</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">EGP 58.4</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">+12.5%</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">EGP 928K</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">+8.2%</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Net Profit</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">EGP 293K</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">+15.1%</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Cash Cycle Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Cash Cycle Analysis</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cashCycleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="collected" stroke="#3B82F6" strokeWidth={3} name="Collected" />
              <Line type="monotone" dataKey="fees" stroke="#EF4444" strokeWidth={2} name="Fees" />
              <Line type="monotone" dataKey="net" stroke="#10B981" strokeWidth={3} name="Net" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash-out History */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Cash-out History</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cashOutData.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>EGP {transaction.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.status === 'Completed' ? 'default' : 'secondary'}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Payment Methods Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Orders by Payment Method</h3>
          <div className="space-y-4">
            {orderValueData.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{item.type}</h4>
                  <span className="text-sm text-gray-500">Avg: EGP {item.avg}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{item.count} orders</span>
                  <span className="font-semibold">EGP {item.value.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(item.value / 385000) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
