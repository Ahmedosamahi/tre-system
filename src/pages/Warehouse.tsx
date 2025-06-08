
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
import { Plus, Edit, Trash2, Star, Building2, MapPin } from 'lucide-react';
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
        <main className="p-8">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Warehouses</h1>
              <p className="text-gray-600 mt-1">Manage your warehouse locations and settings</p>
            </div>
            <Button 
              onClick={handleAddWarehouse}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Plus size={20} /> 
              Add New Warehouse
            </Button>
          </div>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Warehouses</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{warehouses.length}</p>
                </div>
                <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 size={28} className="text-blue-600" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Main Warehouses</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {warehouses.filter(w => w.type === 'Main').length}
                  </p>
                </div>
                <div className="h-14 w-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <Building2 size={28} className="text-green-600" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Virtual Warehouses</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {warehouses.filter(w => w.type === 'Virtual').length}
                  </p>
                </div>
                <div className="h-14 w-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Building2 size={28} className="text-purple-600" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Primary Warehouse</p>
                  <p className="text-sm font-semibold text-gray-900 mt-2">
                    {warehouses.find(w => w.isPrimary)?.name || 'None Set'}
                  </p>
                </div>
                <div className="h-14 w-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Star size={28} className="text-yellow-600" />
                </div>
              </div>
            </Card>
          </div>
          
          {/* Main Content Card */}
          <Card className="border-0 shadow-sm">
            <div className="p-6 border-b bg-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Warehouse Management</h2>
                <div className="w-80">
                  <SearchBox 
                    placeholder="Search warehouses..." 
                    value={searchTerm}
                    onChange={setSearchTerm}
                    className="border-gray-200"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-b-lg">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-100">
                    <TableHead className="font-semibold text-gray-700">Warehouse Name</TableHead>
                    <TableHead className="font-semibold text-gray-700">Manager Name</TableHead>
                    <TableHead className="font-semibold text-gray-700">Address</TableHead>
                    <TableHead className="font-semibold text-gray-700">Type</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWarehouses.map((warehouse) => (
                    <TableRow key={warehouse.id} className="hover:bg-gray-50 transition-colors duration-150 border-gray-100">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {warehouse.isPrimary && (
                            <Star className="h-5 w-5 text-yellow-500 fill-current" />
                          )}
                          <span className="text-gray-900">{warehouse.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">{warehouse.manager}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="truncate text-gray-600" title={warehouse.address}>
                            {warehouse.address}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${
                            warehouse.type === 'Main' 
                              ? 'border-green-200 text-green-700 bg-green-50' 
                              : 'border-purple-200 text-purple-700 bg-purple-50'
                          } font-medium`}
                        >
                          {warehouse.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {warehouse.isPrimary ? (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 font-medium">
                              Primary
                            </Badge>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPrimaryWarehouse(warehouse.id)}
                              className="text-xs hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors duration-150"
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
                            className="h-9 w-9 p-0 hover:bg-blue-50 hover:border-blue-200 transition-colors duration-150"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteWarehouse(warehouse)}
                            className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:border-red-200 hover:bg-red-50 transition-colors duration-150"
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
