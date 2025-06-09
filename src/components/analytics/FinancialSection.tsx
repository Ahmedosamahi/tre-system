
import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MoreHorizontal, Download, FileText, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const cashCycleData = [
  { month: 'Jan', collected: 45000, fees: 3200, netValue: 41800 },
  { month: 'Feb', collected: 52000, fees: 3640, netValue: 48360 },
  { month: 'Mar', collected: 48000, fees: 3360, netValue: 44640 },
  { month: 'Apr', collected: 58000, fees: 4060, netValue: 53940 },
  { month: 'May', collected: 62000, fees: 4340, netValue: 57660 },
  { month: 'Jun', collected: 67000, fees: 4690, netValue: 62310 }
];

const cashOutData = [
  { id: 'TXN-001', date: '2024-01-15', merchant: 'Tech Store Ltd', amount: 12500, status: 'Completed' },
  { id: 'TXN-002', date: '2024-01-14', merchant: 'Fashion Hub', amount: 8900, status: 'Pending' },
  { id: 'TXN-003', date: '2024-01-13', merchant: 'Electronics Plus', amount: 15600, status: 'Completed' },
  { id: 'TXN-004', date: '2024-01-12', merchant: 'Home Goods Co', amount: 6700, status: 'Completed' },
  { id: 'TXN-005', date: '2024-01-11', merchant: 'Sports World', amount: 9200, status: 'Failed' }
];

const orderValueData = [
  { type: 'COD Orders', orders: 8450, avgValue: 145, totalValue: 1225250 },
  { type: 'Prepaid Orders', orders: 4397, avgValue: 187, totalValue: 822239 }
];

const ExportButton = ({ onExport }: { onExport: (format: 'excel' | 'pdf') => void }) => (
  <div className="relative group">
    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
    <div className="absolute right-0 top-8 hidden group-hover:block bg-white border rounded-md shadow-lg p-2 z-10 min-w-[120px]">
      <Button variant="ghost" size="sm" onClick={() => onExport('excel')} className="w-full justify-start gap-2 text-xs">
        <FileText className="h-3 w-3" />
        Export Excel
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onExport('pdf')} className="w-full justify-start gap-2 text-xs">
        <Download className="h-3 w-3" />
        Export PDF
      </Button>
    </div>
  </div>
);

export const FinancialSection = () => {
  const handleExport = (format: 'excel' | 'pdf') => {
    console.log(`Exporting financial data as ${format}`);
  };

  const totalCollected = cashCycleData[cashCycleData.length - 1]?.collected || 0;
  const totalFees = cashCycleData[cashCycleData.length - 1]?.fees || 0;
  const totalNet = cashCycleData[cashCycleData.length - 1]?.netValue || 0;

  return (
    <div className="space-y-6">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Collected</p>
              <p className="text-2xl font-bold text-gray-900">${totalCollected.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12.5%</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Fees</p>
              <p className="text-2xl font-bold text-gray-900">${totalFees.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">+8.2%</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Net Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalNet.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+15.3%</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Cycle Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Cash Cycle Trend</h3>
            <ExportButton onExport={handleExport} />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashCycleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="collected" stroke="#10B981" strokeWidth={2} name="Collected Cash" />
                <Line type="monotone" dataKey="fees" stroke="#EF4444" strokeWidth={2} name="Fees" />
                <Line type="monotone" dataKey="netValue" stroke="#3B82F6" strokeWidth={2} name="Net Value" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Order Value Comparison */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">COD vs Prepaid Orders</h3>
            <ExportButton onExport={handleExport} />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderValueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#3B82F6" name="Number of Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Cash-out Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Cash-out Transactions</h3>
          <ExportButton onExport={handleExport} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cashOutData.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.merchant}</TableCell>
                <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      transaction.status === 'Completed' ? 'default' :
                      transaction.status === 'Pending' ? 'secondary' : 'destructive'
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Average Order Value Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Order Value Analysis</h3>
          <ExportButton onExport={handleExport} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Type</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Average Order Value</TableHead>
              <TableHead>Total Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderValueData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.type}</TableCell>
                <TableCell>{item.orders.toLocaleString()}</TableCell>
                <TableCell>${item.avgValue}</TableCell>
                <TableCell>${item.totalValue.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
