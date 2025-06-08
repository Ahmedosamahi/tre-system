
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SearchBox } from '@/components/ui/SearchBox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, MapPin, Star } from 'lucide-react';
import { WarehouseModal } from '@/components/warehouse/WarehouseModal';
import { DeleteConfirmationModal } from '@/components/warehouse/DeleteConfirmationModal';

// Sample warehouse data
const initialWarehouses = [
  {
    id: '1',
    name: 'Main Distribution Center',
    manager: 'John Smith',
    address: '123 Industrial Blvd, Los Angeles, CA 90210',
    type: 'Main' as const,
    isPrimary: true,
    region: 'West Coast'
  },
  {
    id: '2',
    name: 'East Coast Hub',
    manager: 'Sarah Johnson',
    address: '456 Logistics Way, New York, NY 10001',
    type: 'Main' as const,
    isPrimary: false,
    region: 'East Coast'
  },
  {
    id: '3',
    name: 'Virtual Dropship Center',
    manager: 'Mike Davis',
    address: '789 Commerce St, Chicago, IL 60601',
    type: 'Virtual' as const,
    isPrimary: false,
    region: 'Midwest'
  },
  {
    id: '4',
    name: 'Southern Distribution',
    manager: 'Lisa Wilson',
    address: '321 Shipping Lane, Dallas, TX 75201',
    type: 'Main' as const,
    isPrimary: false,
    region: 'South'
  }
];

type Warehouse = typeof initialWarehouses[0];

const WarehousePage = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [deletingWarehouse, setDeletingWarehouse] = useState<Warehouse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddWarehouse = () => {
    setEditingWarehouse(null);
    setIsModalOpen(true);
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setIsModalOpen(true);
  };

  const handleDeleteWarehouse = (warehouse: Warehouse) => {
    setDeletingWarehouse(warehouse);
    setIsDeleteModalOpen(true);
  };

  const handleSaveWarehouse = (warehouseData: Omit<Warehouse, 'id'>) => {
    if (editingWarehouse) {
      // Edit existing warehouse
      setWarehouses(prev => prev.map(w => 
        w.id === editingWarehouse.id 
          ? { ...warehouseData, id: editingWarehouse.id }
          : w
      ));
    } else {
      // Add new warehouse
      const newWarehouse: Warehouse = {
        ...warehouseData,
        id: Math.random().toString(36).substr(2, 9)
      };
      setWarehouses(prev => [...prev, newWarehouse]);
    }
    setIsModalOpen(false);
    setEditingWarehouse(null);
  };

  const confirmDelete = () => {
    if (deletingWarehouse) {
      setWarehouses(prev => prev.filter(w => w.id !== deletingWarehouse.id));
    }
    setIsDeleteModalOpen(false);
    setDeletingWarehouse(null);
  };

  const handleSetPrimary = (warehouseId: string) => {
    setWarehouses(prev => prev.map(w => ({
      ...w,
      isPrimary: w.id === warehouseId
    })));
  };

  const groupedWarehouses = filteredWarehouses.reduce((acc, warehouse) => {
    const region = warehouse.region;
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(warehouse);
    return acc;
  }, {} as Record<string, Warehouse[]>);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header className="sticky top-0 z-10" />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Warehouses</h1>
            <Button 
              onClick={handleAddWarehouse}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus size={18} /> Add New Warehouse
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Warehouses</p>
                  <p className="text-2xl font-semibold">{warehouses.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <MapPin size={24} />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Main Warehouses</p>
                  <p className="text-2xl font-semibold">
                    {warehouses.filter(w => w.type === 'Main').length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <MapPin size={24} />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Virtual Warehouses</p>
                  <p className="text-2xl font-semibold">
                    {warehouses.filter(w => w.type === 'Virtual').length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <MapPin size={24} />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Regions</p>
                  <p className="text-2xl font-semibold">
                    {Object.keys(groupedWarehouses).length}
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
                    placeholder="Search warehouses by name, manager, or address..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mt-4 flex gap-2 flex-wrap">
                <Badge variant="outline" className="bg-white cursor-pointer">All Warehouses</Badge>
                <Badge variant="outline" className="bg-white cursor-pointer">Main</Badge>
                <Badge variant="outline" className="bg-white cursor-pointer">Virtual</Badge>
                <Badge variant="outline" className="bg-white cursor-pointer">West Coast</Badge>
                <Badge variant="outline" className="bg-white cursor-pointer">East Coast</Badge>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Warehouse Name</TableHead>
                    <TableHead>Manager Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Primary</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWarehouses.map((warehouse) => (
                    <TableRow 
                      key={warehouse.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {warehouse.isPrimary && (
                            <Star size={16} className="text-yellow-500 fill-current" />
                          )}
                          {warehouse.name}
                        </div>
                      </TableCell>
                      <TableCell>{warehouse.manager}</TableCell>
                      <TableCell className="max-w-xs truncate">{warehouse.address}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={warehouse.type === 'Main' ? 'bg-green-50 text-green-700' : 'bg-purple-50 text-purple-700'}
                        >
                          {warehouse.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={warehouse.isPrimary ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleSetPrimary(warehouse.id)}
                          className={warehouse.isPrimary ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                        >
                          {warehouse.isPrimary ? 'Primary' : 'Set Primary'}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditWarehouse(warehouse)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteWarehouse(warehouse)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </main>
      </div>

      <WarehouseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingWarehouse(null);
        }}
        onSave={handleSaveWarehouse}
        warehouse={editingWarehouse}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingWarehouse(null);
        }}
        onConfirm={confirmDelete}
        warehouseName={deletingWarehouse?.name || ''}
      />
    </div>
  );
};

export default WarehousePage;
