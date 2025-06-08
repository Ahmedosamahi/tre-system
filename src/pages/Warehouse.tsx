
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchBox } from '@/components/ui/SearchBox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Filter, BarChart, Box, ArrowUp, ArrowDown } from 'lucide-react';

// Sample inventory data
const inventory = [
  {
    id: 'SKU1001',
    name: 'Premium T-Shirt',
    category: 'Apparel',
    inStock: 145,
    committed: 23,
    available: 122,
    reorderLevel: 50,
    location: 'A-12-3',
    lastUpdated: '2025-04-20'
  },
  {
    id: 'SKU1002',
    name: 'Wireless Earbuds',
    category: 'Electronics',
    inStock: 78,
    committed: 15,
    available: 63,
    reorderLevel: 25,
    location: 'B-03-5',
    lastUpdated: '2025-04-21'
  },
  {
    id: 'SKU1003',
    name: 'Leather Wallet',
    category: 'Accessories',
    inStock: 210,
    committed: 45,
    available: 165,
    reorderLevel: 100,
    location: 'A-05-2',
    lastUpdated: '2025-04-22'
  },
  {
    id: 'SKU1004',
    name: 'Smart Watch',
    category: 'Electronics',
    inStock: 32,
    committed: 12,
    available: 20,
    reorderLevel: 30,
    location: 'B-01-4',
    lastUpdated: '2025-04-19'
  },
  {
    id: 'SKU1005',
    name: 'Yoga Mat',
    category: 'Sports',
    inStock: 95,
    committed: 18,
    available: 77,
    reorderLevel: 40,
    location: 'C-08-1',
    lastUpdated: '2025-04-21'
  }
];

const WarehousePage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header className="sticky top-0 z-10" />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Warehouse</h1>
            <div className="flex gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart size={18} /> Stock Reports
              </Button>
              <Button className="bg-brand text-white hover:bg-brand-dark flex items-center gap-2">
                <Plus size={18} /> Add Item
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total SKUs</p>
                  <p className="text-2xl font-semibold">1,254</p>
                </div>
                <div className="h-12 w-12 bg-info-light rounded-full flex items-center justify-center text-info">
                  <Box size={24} />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">In Stock</p>
                  <p className="text-2xl font-semibold">8,721</p>
                </div>
                <div className="h-12 w-12 bg-success-light rounded-full flex items-center justify-center text-success">
                  <ArrowUp size={24} />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Low Stock</p>
                  <p className="text-2xl font-semibold">23</p>
                </div>
                <div className="h-12 w-12 bg-warning-light rounded-full flex items-center justify-center text-warning">
                  <ArrowDown size={24} />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Out of Stock</p>
                  <p className="text-2xl font-semibold">12</p>
                </div>
                <div className="h-12 w-12 bg-danger-light rounded-full flex items-center justify-center text-danger">
                  <ArrowDown size={24} />
                </div>
              </div>
            </Card>
          </div>
          
          <Tabs defaultValue="inventory" className="mb-6">
            <TabsList>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="movements">Stock Movements</TabsTrigger>
              <TabsTrigger value="bundles">Product Bundles</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inventory">
              <Card>
                <div className="p-6 border-b">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <SearchBox placeholder="Search by SKU, name, category..." />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
                        <Filter size={16} /> Filter
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <Badge variant="outline" className="bg-white cursor-pointer">All Items</Badge>
                    <Badge variant="outline" className="bg-white cursor-pointer">Low Stock</Badge>
                    <Badge variant="outline" className="bg-white cursor-pointer">Out of Stock</Badge>
                    <Badge variant="outline" className="bg-white cursor-pointer">Electronics</Badge>
                    <Badge variant="outline" className="bg-white cursor-pointer">Apparel</Badge>
                    <Badge variant="outline" className="bg-white cursor-pointer">Accessories</Badge>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">In Stock</TableHead>
                        <TableHead className="text-right">Committed</TableHead>
                        <TableHead className="text-right">Available</TableHead>
                        <TableHead className="text-right">Reorder Level</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right">{item.inStock}</TableCell>
                          <TableCell className="text-right">{item.committed}</TableCell>
                          <TableCell className="text-right font-medium">{item.available}</TableCell>
                          <TableCell className="text-right">{item.reorderLevel}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="movements">
              <Card className="p-6">
                <div className="min-h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Stock movements view will be implemented here</p>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="bundles">
              <Card className="p-6">
                <div className="min-h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Product bundles view will be implemented here</p>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="categories">
              <Card className="p-6">
                <div className="min-h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Categories management view will be implemented here</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default WarehousePage;
