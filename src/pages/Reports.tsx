
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Clock, Download, FileText, BarChart2, PieChart, TrendingUp } from 'lucide-react';

// Sample report data
const availableReports = [
  {
    id: 1,
    name: 'Monthly Orders Summary',
    description: 'Summary of all orders processed in the current month',
    type: 'Orders',
    lastGenerated: '2025-04-21T14:30:00Z',
    formats: ['PDF', 'CSV', 'XLSX']
  },
  {
    id: 2,
    name: 'Courier Performance Analysis',
    description: 'Comparative analysis of all courier services',
    type: 'Couriers',
    lastGenerated: '2025-04-20T09:15:00Z',
    formats: ['PDF', 'XLSX']
  },
  {
    id: 3,
    name: 'COD Collection Report',
    description: 'Cash on delivery collections and settlements',
    type: 'Financial',
    lastGenerated: '2025-04-22T11:45:00Z',
    formats: ['PDF', 'CSV']
  },
  {
    id: 4,
    name: 'Customer Order History',
    description: 'Detailed order history by customer',
    type: 'Customers',
    lastGenerated: '2025-04-18T16:20:00Z',
    formats: ['PDF', 'CSV', 'XLSX']
  },
  {
    id: 5,
    name: 'Inventory Stock Levels',
    description: 'Current inventory levels and stock movements',
    type: 'Warehouse',
    lastGenerated: '2025-04-23T08:30:00Z',
    formats: ['PDF', 'CSV']
  },
  {
    id: 6,
    name: 'Returns Analysis',
    description: 'Analysis of returned orders and reasons',
    type: 'Returns',
    lastGenerated: '2025-04-19T15:10:00Z',
    formats: ['PDF', 'XLSX']
  }
];

const reportIcons: Record<string, React.ReactNode> = {
  'Orders': <FileText size={18} className="text-brand" />,
  'Couriers': <TrendingUp size={18} className="text-info" />,
  'Financial': <BarChart2 size={18} className="text-success" />,
  'Customers': <PieChart size={18} className="text-warning" />,
  'Warehouse': <BarChart2 size={18} className="text-info" />,
  'Returns': <TrendingUp size={18} className="text-danger" />
};

const ReportsPage = () => {
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);
  
  const filteredReports = selectedReportType 
    ? availableReports.filter(report => report.type === selectedReportType)
    : availableReports;
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header className="sticky top-0 z-10" />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
            <Button className="bg-brand text-white hover:bg-brand-dark flex items-center gap-2">
              <FileText size={18} /> Generate Custom Report
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-info-light rounded-full flex items-center justify-center text-info">
                <FileText size={24} />
              </div>
              <div>
                <div className="text-2xl font-semibold">25</div>
                <div className="text-sm text-gray-500">Available Reports</div>
              </div>
            </Card>
            
            <Card className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-success-light rounded-full flex items-center justify-center text-success">
                <Clock size={24} />
              </div>
              <div>
                <div className="text-2xl font-semibold">12</div>
                <div className="text-sm text-gray-500">Scheduled Reports</div>
              </div>
            </Card>
            
            <Card className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-warning-light rounded-full flex items-center justify-center text-warning">
                <Download size={24} />
              </div>
              <div>
                <div className="text-2xl font-semibold">48</div>
                <div className="text-sm text-gray-500">Downloaded This Month</div>
              </div>
            </Card>
          </div>
          
          <Tabs defaultValue="all-reports" className="mb-6">
            <TabsList>
              <TabsTrigger value="all-reports">All Reports</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
              <TabsTrigger value="custom">Custom Reports</TabsTrigger>
              <TabsTrigger value="templates">Report Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all-reports">
              <Card>
                <div className="p-6 border-b">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button 
                      variant={selectedReportType === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedReportType(null)}
                    >
                      All Types
                    </Button>
                    {Array.from(new Set(availableReports.map(report => report.type))).map(type => (
                      <Button
                        key={type}
                        variant={selectedReportType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedReportType(type)}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Last Generated</TableHead>
                        <TableHead>Available Formats</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.name}</TableCell>
                          <TableCell>{report.description}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {reportIcons[report.type]}
                              {report.type}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} className="text-gray-500" />
                              {new Date(report.lastGenerated).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock size={12} />
                              {new Date(report.lastGenerated).toLocaleTimeString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {report.formats.map(format => (
                                <span 
                                  key={format} 
                                  className="px-2 py-1 bg-gray-100 rounded text-xs font-medium"
                                >
                                  {format}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <Download size={14} /> Download
                              </Button>
                              <Button variant="outline" size="sm">Generate New</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="scheduled">
              <Card className="p-6">
                <div className="min-h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Scheduled reports view will be implemented here</p>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="custom">
              <Card className="p-6">
                <div className="min-h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Custom reports view will be implemented here</p>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="templates">
              <Card className="p-6">
                <div className="min-h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Report templates view will be implemented here</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;
