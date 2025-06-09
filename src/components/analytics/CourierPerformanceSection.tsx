
import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { MoreHorizontal, Download, FileText } from 'lucide-react';

const courierData = [
  { name: 'Aramex', shipments: 2450, avgDelivery: 2.3, successRate: 94, returnRate: 6, cost: 25 },
  { name: 'DHL', shipments: 1890, avgDelivery: 1.8, successRate: 97, returnRate: 3, cost: 35 },
  { name: 'FedEx', shipments: 1654, avgDelivery: 2.1, successRate: 96, returnRate: 4, cost: 32 },
  { name: 'Mylerz', shipments: 3200, avgDelivery: 2.8, successRate: 89, returnRate: 11, cost: 18 },
  { name: 'UPS', shipments: 987, avgDelivery: 2.5, successRate: 92, returnRate: 8, cost: 28 }
];

const comparisonData = [
  { subject: 'Speed', Aramex: 85, DHL: 95, FedEx: 90, Mylerz: 75 },
  { subject: 'Reliability', Aramex: 94, DHL: 97, FedEx: 96, Mylerz: 89 },
  { subject: 'Cost Efficiency', Aramex: 78, DHL: 65, FedEx: 70, Mylerz: 95 },
  { subject: 'Coverage', Aramex: 88, DHL: 85, FedEx: 82, Mylerz: 92 }
];

const failureData = [
  { courier: 'Aramex', customerNotAvailable: 45, wrongAddress: 23, refused: 18, damaged: 12 },
  { courier: 'DHL', customerNotAvailable: 28, wrongAddress: 15, refused: 12, damaged: 8 },
  { courier: 'FedEx', customerNotAvailable: 32, wrongAddress: 18, refused: 14, damaged: 6 },
  { courier: 'Mylerz', customerNotAvailable: 78, wrongAddress: 45, refused: 34, damaged: 23 }
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

export const CourierPerformanceSection = () => {
  const handleExport = (format: 'excel' | 'pdf') => {
    console.log(`Exporting courier data as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Courier Performance Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Courier Performance Overview</h3>
          <ExportButton onExport={handleExport} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Courier Name</TableHead>
              <TableHead>Total Shipments</TableHead>
              <TableHead>Avg. Delivery Time</TableHead>
              <TableHead>Success Rate</TableHead>
              <TableHead>Return Rate</TableHead>
              <TableHead>Avg. Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courierData.map((courier, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{courier.name}</TableCell>
                <TableCell>{courier.shipments.toLocaleString()}</TableCell>
                <TableCell>{courier.avgDelivery} days</TableCell>
                <TableCell>
                  <Badge variant={courier.successRate >= 95 ? 'default' : courier.successRate >= 90 ? 'secondary' : 'destructive'}>
                    {courier.successRate}%
                  </Badge>
                </TableCell>
                <TableCell>{courier.returnRate}%</TableCell>
                <TableCell>${courier.cost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courier Comparison Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Courier Performance Comparison</h3>
            <ExportButton onExport={handleExport} />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={comparisonData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={0} domain={[0, 100]} />
                <Radar name="Aramex" dataKey="Aramex" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                <Radar name="DHL" dataKey="DHL" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                <Radar name="FedEx" dataKey="FedEx" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} />
                <Radar name="Mylerz" dataKey="Mylerz" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Shipment Volume by Courier */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Shipment Volume by Courier</h3>
            <ExportButton onExport={handleExport} />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courierData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="shipments" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Failed Orders by Courier */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Failed Orders Breakdown by Courier</h3>
          <ExportButton onExport={handleExport} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Courier</TableHead>
              <TableHead>Customer Not Available</TableHead>
              <TableHead>Wrong Address</TableHead>
              <TableHead>Delivery Refused</TableHead>
              <TableHead>Package Damaged</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {failureData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.courier}</TableCell>
                <TableCell>{item.customerNotAvailable}</TableCell>
                <TableCell>{item.wrongAddress}</TableCell>
                <TableCell>{item.refused}</TableCell>
                <TableCell>{item.damaged}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
