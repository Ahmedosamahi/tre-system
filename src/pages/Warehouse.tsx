
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchBox } from '@/components/ui/SearchBox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, Star, Building2 } from 'lucide-react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { WarehouseModal } from '@/components/warehouse/WarehouseModal';
import { DeleteConfirmationModal } from '@/components/warehouse/DeleteConfirmationModal';

interface Warehouse {
  id: string;
  name: string;
  manager: string;
  address: string;
  type: 'Main' | 'Virtual';
  isPrimary: boolean;
}

const WarehousePage = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    {
      id: '1',
      name: 'Cairo Main Distribution Center',
      manager: 'Ahmed Hassan',
      address: '15 Industrial Area, New Cairo, Cairo Governorate',
      type: 'Main',
      isPrimary: true
    },
    {
      id: '2',
      name: 'Alexandria Hub',
      manager: 'Fatma Mahmoud',
      address: '8 Port Street, Alexandria, Alexandria Governorate',
      type: 'Main',
      isPrimary: false
    },
    {
      id: '3',
      name: 'Giza Virtual Storage',
      manager: 'Mohamed Ali',
      address: 'Virtual Location - Giza Network',
      type: 'Virtual',
      isPrimary: false
    },
    {
      id: '4',
      name: 'Mansoura Regional Center',
      manager: 'Nour Abdel Rahman',
      address: '22 Delta Road, Mansoura, Dakahlia Governorate',
      type: 'Main',
      isPrimary: false
    }
  ]);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    warehouse?: Warehouse;
  }>({
    isOpen: false,
    mode: 'add'
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    warehouse?: Warehouse;
  }>({
    isOpen: false
  });

  const [searchTerm, setSearchTerm] = useState('');

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddWarehouse = () => {
    setModalState({
      isOpen: true,
      mode: 'add'
    });
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      warehouse
    });
  };

  const handleDeleteWarehouse = (warehouse: Warehouse) => {
    setDeleteModal({
      isOpen: true,
      warehouse
    });
  };

  const handleSaveWarehouse = (warehouseData: Omit<Warehouse, 'id'>) => {
    if (modalState.mode === 'add') {
      const newWarehouse: Warehouse = {
        ...warehouseData,
        id: Date.now().toString()
      };
      
      let updatedWarehouses = [...warehouses];
      
      if (newWarehouse.isPrimary) {
        updatedWarehouses = updatedWarehouses.map(w => ({ ...w, isPrimary: false }));
      }
      
      setWarehouses([...updatedWarehouses, newWarehouse]);
    } else if (modalState.warehouse) {
      let updatedWarehouses = warehouses.map(w =>
        w.id === modalState.warehouse!.id ? { ...modalState.warehouse!, ...warehouseData } : w
      );
      
      if (warehouseData.isPrimary) {
        updatedWarehouses = updatedWarehouses.map(w =>
          w.id === modalState.warehouse!.id ? w : { ...w, isPrimary: false }
        );
      }
      
      setWarehouses(updatedWarehouses);
    }
  };

  const confirmDelete = () => {
    if (deleteModal.warehouse) {
      setWarehouses(warehouses.filter(w => w.id !== deleteModal.warehouse!.id));
      setDeleteModal({ isOpen: false });
    }
  };

  const setPrimaryWarehouse = (warehouseId: string) => {
    setWarehouses(warehouses.map(w => ({
      ...w,
      isPrimary: w.id === warehouseId
    })));
  };

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
              <Plus size={18} /> 
              Add New Warehouse
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
                  <Building2 size={24} />
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
                  <Building2 size={24} />
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
                  <Building2 size={24} />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Primary Warehouse</p>
                  <p className="text-sm font-medium text-gray-800 mt-1">
                    {warehouses.find(w => w.isPrimary)?.name || 'None Set'}
                  </p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                  <Star size={24} />
                </div>
              </div>
            </Card>
          </div>
          
          <Card>
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Warehouse Management</h2>
                <div className="w-80">
                  <SearchBox 
                    placeholder="Search warehouses..." 
                    value={searchTerm}
                    onChange={setSearchTerm}
                  />
                </div>
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
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWarehouses.map((warehouse) => (
                    <TableRow key={warehouse.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {warehouse.isPrimary && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                          {warehouse.name}
                        </div>
                      </TableCell>
                      <TableCell>{warehouse.manager}</TableCell>
                      <TableCell className="max-w-xs truncate" title={warehouse.address}>
                        {warehouse.address}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={warehouse.type === 'Main' ? 'border-green-500 text-green-700' : 'border-purple-500 text-purple-700'}
                        >
                          {warehouse.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {warehouse.isPrimary ? (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              Primary
                            </Badge>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPrimaryWarehouse(warehouse.id)}
                              className="text-xs"
                            >
                              Set Primary
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditWarehouse(warehouse)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteWarehouse(warehouse)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:border-red-200"
                          >
                            <Trash2 className="h-4 w-4" />
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
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'add' })}
        onSave={handleSaveWarehouse}
        warehouse={modalState.warehouse}
        mode={modalState.mode}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={confirmDelete}
        warehouseName={deleteModal.warehouse?.name || ''}
      />
    </div>
  );
};

export default WarehousePage;
