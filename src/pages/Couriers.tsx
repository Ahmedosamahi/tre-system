
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { SearchBox } from '@/components/ui/SearchBox';
import { Switch } from '@/components/ui/switch';
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
import { 
  Plus, 
  Star, 
  ChevronDown, 
  Truck, 
  Filter,
  MapPin,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Courier } from '@/types';
import { CourierModal } from '@/components/couriers/CourierModal';

// Sample courier data
const initialCouriers: Courier[] = [
  {
    id: 'COR001',
    name: 'Bosta',
    country: 'Egypt',
    status: 'Active',
    totalShipments: 15420,
    avgDeliveryTime: 2.5,
    successRate: 94.5,
    avgShippingCost: 25.50,
    isPreferred: true,
    supportedServices: ['COD', 'Reverse Pickup', 'Express', 'Same Day'],
    returnPolicies: '30-day return policy with free pickup',
    connectedApis: ['REST API', 'Webhook'],
    rating: 4.8
  },
  {
    id: 'COR002',
    name: 'Aramex',
    country: 'UAE',
    status: 'Active',
    totalShipments: 28750,
    avgDeliveryTime: 3.2,
    successRate: 91.2,
    avgShippingCost: 32.75,
    isPreferred: false,
    supportedServices: ['COD', 'Express', 'International'],
    returnPolicies: '15-day return policy',
    connectedApis: ['REST API', 'SOAP API'],
    rating: 4.6
  },
  {
    id: 'COR003',
    name: 'Mylerz',
    country: 'Egypt',
    status: 'Active',
    totalShipments: 8920,
    avgDeliveryTime: 4.1,
    successRate: 87.8,
    avgShippingCost: 22.00,
    isPreferred: false,
    supportedServices: ['COD', 'Standard'],
    returnPolicies: '7-day return policy',
    connectedApis: ['REST API'],
    rating: 4.2
  },
  {
    id: 'COR004',
    name: 'J&T Express',
    country: 'Malaysia',
    status: 'Inactive',
    totalShipments: 0,
    avgDeliveryTime: 0,
    successRate: 0,
    avgShippingCost: 0,
    isPreferred: false,
    supportedServices: ['COD', 'Express', 'Economy'],
    returnPolicies: 'Coming soon',
    connectedApis: [],
    rating: 0
  }
];

const CouriersPage = () => {
  const [couriers, setCouriers] = useState<Courier[]>(initialCouriers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  const filteredCouriers = couriers.filter(courier => {
    const matchesSearch = courier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         courier.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || courier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConnectCourier = () => {
    setIsModalOpen(true);
  };

  const handleSaveCourier = (courierData: Omit<Courier, 'id' | 'totalShipments' | 'avgDeliveryTime' | 'successRate' | 'avgShippingCost'>) => {
    const newCourier: Courier = {
      ...courierData,
      id: `COR${String(couriers.length + 1).padStart(3, '0')}`,
      totalShipments: 0,
      avgDeliveryTime: 0,
      successRate: 0,
      avgShippingCost: 0
    };
    setCouriers(prev => [...prev, newCourier]);
    setIsModalOpen(false);
  };

  const toggleCourierStatus = (courierId: string) => {
    setCouriers(prev => prev.map(courier => 
      courier.id === courierId 
        ? { ...courier, status: courier.status === 'Active' ? 'Inactive' : 'Active' }
        : courier
    ));
  };

  const togglePreferred = (courierId: string) => {
    setCouriers(prev => prev.map(courier => 
      courier.id === courierId 
        ? { ...courier, isPreferred: !courier.isPreferred }
        : courier
    ));
  };

  const toggleRowExpansion = (courierId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courierId)) {
        newSet.delete(courierId);
      } else {
        newSet.add(courierId);
      }
      return newSet;
    });
  };

  const getSuccessRateBadge = (rate: number) => {
    if (rate >= 90) return 'success';
    if (rate >= 70) return 'warning';
    return 'danger';
  };

  const getDeliveryTimeColor = (days: number) => {
    if (days <= 2) return 'bg-green-500';
    if (days <= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header className="sticky top-0 z-10" />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Couriers</h1>
            <Button 
              onClick={handleConnectCourier}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus size={18} /> Connect Courier
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Couriers</p>
                  <p className="text-2xl font-semibold">{couriers.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <Truck size={24} />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Couriers</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {couriers.filter(c => c.status === 'Active').length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <TrendingUp size={24} />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Success Rate</p>
                  <p className="text-2xl font-semibold">
                    {Math.round(couriers.filter(c => c.status === 'Active').reduce((acc, c) => acc + c.successRate, 0) / couriers.filter(c => c.status === 'Active').length)}%
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <TrendingUp size={24} />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Countries</p>
                  <p className="text-2xl font-semibold">
                    {new Set(couriers.map(c => c.country)).size}
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  <MapPin size={24} />
                </div>
              </div>
            </Card>
          </div>
          
          <Card>
            <div className="p-6 border-b">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <SearchBox 
                    placeholder="Search couriers by name or country..." 
                    value={searchTerm}
                    onChange={setSearchTerm}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
                    <Filter size={16} /> Filter
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2 flex-wrap">
                {['All', 'Active', 'Inactive'].map((status) => (
                  <Badge 
                    key={status}
                    variant="outline" 
                    className={`cursor-pointer ${statusFilter === status ? 'bg-blue-50 text-blue-700' : 'bg-white'}`}
                    onClick={() => setStatusFilter(status as 'All' | 'Active' | 'Inactive')}
                  >
                    {status}
                  </Badge>
                ))}
                <Badge variant="outline" className="bg-white cursor-pointer">Preferred</Badge>
                <Badge variant="outline" className="bg-white cursor-pointer">High Success Rate</Badge>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Courier</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Shipments</TableHead>
                    <TableHead>Delivery Time</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Avg Cost</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCouriers.map((courier) => (
                    <React.Fragment key={courier.id}>
                      <TableRow className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRowExpansion(courier.id)}
                                className="p-0 h-8 w-8"
                              >
                                <ChevronDown 
                                  size={16} 
                                  className={`transition-transform ${
                                    expandedRows.has(courier.id) ? 'rotate-180' : ''
                                  }`}
                                />
                              </Button>
                            </CollapsibleTrigger>
                          </Collapsible>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {courier.isPreferred && (
                              <Star size={16} className="text-yellow-500 fill-current" />
                            )}
                            <span className="font-medium">{courier.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{courier.country}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={courier.status === 'Active'}
                              onCheckedChange={() => toggleCourierStatus(courier.id)}
                            />
                            <Badge 
                              variant="outline" 
                              className={courier.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}
                            >
                              {courier.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {courier.totalShipments.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {courier.avgDeliveryTime > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
                                <div 
                                  className={`h-2 rounded-full ${getDeliveryTimeColor(courier.avgDeliveryTime)}`}
                                  style={{ width: `${Math.min((5 - courier.avgDeliveryTime) / 5 * 100, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm">{courier.avgDeliveryTime}d</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {courier.successRate > 0 ? (
                            <Badge 
                              variant="outline" 
                              className={
                                courier.successRate >= 90 ? 'bg-green-50 text-green-700' :
                                courier.successRate >= 70 ? 'bg-yellow-50 text-yellow-700' :
                                'bg-red-50 text-red-700'
                              }
                            >
                              {courier.successRate}%
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {courier.avgShippingCost > 0 ? `$${courier.avgShippingCost.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => togglePreferred(courier.id)}
                              className={`hover:bg-yellow-50 hover:text-yellow-600 ${
                                courier.isPreferred ? 'bg-yellow-50 text-yellow-600' : ''
                              }`}
                            >
                              <Star size={16} className={courier.isPreferred ? 'fill-current' : ''} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedRows.has(courier.id) && (
                        <TableRow>
                          <TableCell colSpan={9} className="bg-gray-50 p-0">
                            <Collapsible open={expandedRows.has(courier.id)}>
                              <CollapsibleContent>
                                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Supported Services</h4>
                                    <div className="flex flex-wrap gap-1">
                                      {courier.supportedServices.map((service) => (
                                        <Badge key={service} variant="outline" className="text-xs">
                                          {service}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Return Policies</h4>
                                    <p className="text-sm text-gray-600">{courier.returnPolicies}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Connected APIs</h4>
                                    <div className="flex flex-wrap gap-1">
                                      {courier.connectedApis.length > 0 ? courier.connectedApis.map((api) => (
                                        <Badge key={api} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                          {api}
                                        </Badge>
                                      )) : (
                                        <span className="text-sm text-gray-400">No APIs connected</span>
                                      )}
                                    </div>
                                    {courier.rating && courier.rating > 0 && (
                                      <div className="mt-2">
                                        <span className="text-sm text-gray-600">Rating: </span>
                                        <span className="font-medium">{courier.rating}/5.0</span>
                                      </div>
                                    )}
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

      <CourierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCourier}
      />
    </div>
  );
};

export default CouriersPage;
