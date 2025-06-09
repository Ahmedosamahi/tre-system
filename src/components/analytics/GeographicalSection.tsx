
import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { MoreHorizontal, Download, FileText } from 'lucide-react';

const topCitiesData = [
  { name: 'Cairo', orders: 4250, percentage: 35, growth: '+12%' },
  { name: 'Giza', orders: 2890, percentage: 24, growth: '+8%' },
  { name: 'Alexandria', orders: 2100, percentage: 17, growth: '+15%' },
  { name: 'Mansoura', orders: 1420, percentage: 12, growth: '+6%' },
  { name: 'Tanta', orders: 980, percentage: 8, growth: '+10%' },
  { name: 'Others', orders: 480, percentage: 4, growth: '+5%' }
];

const topAreasData = [
  { area: 'Nasr City', city: 'Cairo', orders: 850 },
  { area: 'Maadi', city: 'Cairo', orders: 720 },
  { area: 'Dokki', city: 'Giza', orders: 680 },
  { area: 'Heliopolis', city: 'Cairo', orders: 650 },
  { area: 'Zamalek', city: 'Cairo', orders: 520 },
  { area: 'Mohandessin', city: 'Giza', orders: 480 },
  { area: 'Smouha', city: 'Alexandria', orders: 420 },
  { area: 'New Cairo', city: 'Cairo', orders: 380 }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

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

export const GeographicalSection = () => {
  const handleExport = (format: 'excel' | 'pdf') => {
    console.log(`Exporting geographical data as ${format}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cities Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top Cities Distribution</h3>
            <ExportButton onExport={handleExport} />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topCitiesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="orders"
                >
                  {topCitiesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Cities Bar Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Orders by City</h3>
            <ExportButton onExport={handleExport} />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCitiesData.slice(0, 5)}>
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

      {/* Top Cities Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top Cities Performance</h3>
          <ExportButton onExport={handleExport} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>City</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Growth</TableHead>
              <TableHead>Visual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCitiesData.map((city, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{city.name}</TableCell>
                <TableCell>{city.orders.toLocaleString()}</TableCell>
                <TableCell>{city.percentage}%</TableCell>
                <TableCell className="text-green-600 font-medium">{city.growth}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${city.percentage * 2.5}%` }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Top Areas Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top Areas with Most Orders</h3>
          <ExportButton onExport={handleExport} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Area</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Density</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topAreasData.map((area, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{area.area}</TableCell>
                <TableCell>{area.city}</TableCell>
                <TableCell>{area.orders}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(area.orders / 850) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {Math.round((area.orders / 850) * 100)}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
