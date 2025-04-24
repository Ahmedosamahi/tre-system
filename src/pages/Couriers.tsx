
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Progress } from "@/components/ui/progress";
import { SearchBox } from '@/components/ui/SearchBox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Check, Settings, BarChart, Link } from 'lucide-react';

// Sample courier data
const couriers = [
  {
    id: 1,
    name: 'FedEx',
    zones: ['North America', 'Europe', 'Asia'],
    deliveryRate: 94.2,
    avgDeliveryTime: '2.3 days',
    onTimeRate: 92.5,
    isConnected: true,
    status: 'active',
    lastSync: '2025-04-22T10:15:00Z'
  },
  {
    id: 2,
    name: 'DHL',
    zones: ['Global'],
    deliveryRate: 91.8,
    avgDeliveryTime: '3.1 days',
    onTimeRate: 89.5,
    isConnected: true,
    status: 'active',
    lastSync: '2025-04-22T08:30:00Z'
  },
  {
    id: 3,
    name: 'UPS',
    zones: ['North America', 'Europe'],
    deliveryRate: 93.5,
    avgDeliveryTime: '2.5 days',
    onTimeRate: 91.2,
    isConnected: true,
    status: 'active',
    lastSync: '2025-04-21T14:45:00Z'
  },
  {
    id: 4,
    name: 'USPS',
    zones: ['United States'],
    deliveryRate: 89.7,
    avgDeliveryTime: '3.5 days',
    onTimeRate: 87.3,
    isConnected: false,
    status: 'inactive',
    lastSync: '2025-04-15T09:20:00Z'
  },
  {
    id: 5,
    name: 'Royal Mail',
    zones: ['United Kingdom', 'Europe'],
    deliveryRate: 90.5,
    avgDeliveryTime: '2.8 days',
    onTimeRate: 88.9,
    isConnected: true,
    status: 'active',
    lastSync: '2025-04-20T11:30:00Z'
  }
];

const CouriersPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header className="sticky top-0 z-10" />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Couriers</h1>
            <div className="flex gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart size={18} /> Performance
              </Button>
              <Button className="bg-brand text-white hover:bg-brand-dark flex items-center gap-2">
                <Plus size={18} /> Add Courier
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl font-semibold mb-1">92.8%</div>
                <div className="text-sm text-gray-500 mb-3">Average Delivery Rate</div>
                <Progress value={92.8} className="w-full h-2" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl font-semibold mb-1">2.7 days</div>
                <div className="text-sm text-gray-500 mb-3">Average Delivery Time</div>
                <Progress value={70} className="w-full h-2" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl font-semibold mb-1">5/6</div>
                <div className="text-sm text-gray-500 mb-3">Connected Couriers</div>
                <Progress value={83} className="w-full h-2" />
              </div>
            </Card>
          </div>
          
          <Tabs defaultValue="couriers" className="mb-6">
            <TabsList>
              <TabsTrigger value="couriers">Couriers</TabsTrigger>
              <TabsTrigger value="zones">Delivery Zones</TabsTrigger>
              <TabsTrigger value="rates">Shipping Rates</TabsTrigger>
              <TabsTrigger value="settings">Integration Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="couriers">
              <Card>
                <div className="p-6 border-b">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <SearchBox placeholder="Search couriers..." />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <Badge variant="outline" className="bg-white cursor-pointer">All Couriers</Badge>
                    <Badge variant="outline" className="bg-white cursor-pointer">Connected</Badge>
                    <Badge variant="outline" className="bg-white cursor-pointer">Not Connected</Badge>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Courier</TableHead>
                        <TableHead>Zones Covered</TableHead>
                        <TableHead className="text-right">Delivery Rate</TableHead>
                        <TableHead className="text-right">Average Time</TableHead>
                        <TableHead className="text-right">On-Time Rate</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Sync</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {couriers.map((courier) => (
                        <TableRow key={courier.id}>
                          <TableCell className="font-medium">{courier.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {courier.zones.map(zone => (
                                <Badge key={zone} variant="outline" className="text-xs">{zone}</Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              <span className="mr-2">{courier.deliveryRate}%</span>
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-success" 
                                  style={{width: `${courier.deliveryRate}%`}}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{courier.avgDeliveryTime}</TableCell>
                          <TableCell className="text-right">{courier.onTimeRate}%</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              courier.isConnected 
                                ? 'bg-success-light text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {courier.isConnected ? 'Connected' : 'Not Connected'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(courier.lastSync).toLocaleDateString()} {new Date(courier.lastSync).toLocaleTimeString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {courier.isConnected ? (
                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                  <Settings size={14} /> Configure
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm" className="flex items-center gap-1 text-info">
                                  <Link size={14} /> Connect API
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="zones">
              <Card className="p-6">
                <div className="min-h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Delivery zones management will be implemented here</p>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="rates">
              <Card className="p-6">
                <div className="min-h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Shipping rates management will be implemented here</p>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card className="p-6">
                <div className="min-h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Integration settings will be implemented here</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default CouriersPage;
