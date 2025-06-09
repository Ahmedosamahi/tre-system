
import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const successRateData = [
  { name: 'Delivered', value: 78, color: '#10B981' },
  { name: 'Failed', value: 15, color: '#EF4444' },
  { name: 'Returned', value: 7, color: '#F59E0B' }
];

const deliveryTimeData = [
  { name: '1 Day', orders: 4200, percentage: 45 },
  { name: '2 Days', orders: 3100, percentage: 33 },
  { name: '3+ Days', orders: 2050, percentage: 22 }
];

const failureReasonsData = [
  { reason: 'Customer Not Available', count: 245, percentage: 32 },
  { reason: 'Wrong Address', count: 189, percentage: 25 },
  { reason: 'Refused Delivery', count: 156, percentage: 20 },
  { reason: 'Customer Postponed', count: 98, percentage: 13 },
  { reason: 'Package Damaged', count: 76, percentage: 10 }
];

const slaBreachData = [
  { city: 'Cairo', total: 1200, breached: 84, rate: '7.0%' },
  { city: 'Giza', total: 890, breached: 71, rate: '8.0%' },
  { city: 'Alexandria', total: 750, breached: 45, rate: '6.0%' },
  { city: 'Mansoura', total: 420, breached: 38, rate: '9.0%' },
  { city: 'Tanta', total: 315, breached: 28, rate: '8.9%' }
];

export const DeliveryPerformanceSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Delivery Performance</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Success Rate Donut Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Delivery Success Rate</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={successRateData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {successRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Delivery Time Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Delivery Time Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Failure Reasons Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Reasons for Unsuccessful Deliveries</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reason</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {failureReasonsData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.reason}</TableCell>
                <TableCell>{item.count}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{item.percentage}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* SLA Breach per City */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">SLA Breach per City</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>City</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Breached</TableHead>
              <TableHead>Breach Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slaBreachData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.city}</TableCell>
                <TableCell>{item.total}</TableCell>
                <TableCell>{item.breached}</TableCell>
                <TableCell>
                  <Badge variant={parseFloat(item.rate) > 8 ? 'destructive' : 'secondary'}>
                    {item.rate}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
