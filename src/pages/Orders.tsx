import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Order } from '../types/Order';
import { User } from '../types/User';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Search, Filter, Download, Plus, MoreHorizontal, Eye, Edit, Trash2, Package, Truck, CheckCircle, XCircle, Clock, AlertCircle, Undo2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const mockData: Order[] = [
  {
    id: 1,
    customer: { id: 1, name: "John Doe", phone: "123-456-7890" },
    status: "Pending",
    total: 120.5,
    items: [{ id: 1, name: "Item A", quantity: 2 }],
    delivery: { address: "123 Main St" },
  },
  {
    id: 2,
    customer: { id: 2, name: "Jane Smith", phone: "987-654-3210" },
    status: "Confirmed",
    total: 75.0,
    items: [{ id: 2, name: "Item B", quantity: 1 }],
    delivery: { address: "456 Elm St" },
  },
  {
    id: 3,
    customer: { id: 3, name: "Alice Johnson", phone: "555-123-4567" },
    status: "Dispatched",
    total: 200.0,
    items: [{ id: 3, name: "Item C", quantity: 3 }],
    delivery: { address: "789 Oak St" },
  },
  {
    id: 4,
    customer: { id: 4, name: "Bob Brown", phone: "444-555-6666" },
    status: "Delivered",
    total: 150.0,
    items: [{ id: 4, name: "Item D", quantity: 1 }],
    delivery: { address: "321 Pine St" },
  },
  {
    id: 5,
    customer: { id: 5, name: "Carol White", phone: "333-222-1111" },
    status: "Canceled",
    total: 50.0,
    items: [{ id: 5, name: "Item E", quantity: 2 }],
    delivery: { address: "654 Maple St" },
  },
];

const statusOrder = ["Pending", "Confirmed", "Dispatched", "Delivered", "Returned", "Canceled"];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Pending":
      return "secondary";
    case "Confirmed":
      return "info";
    case "Dispatched":
      return "warning";
    case "Delivered":
      return "success";
    case "Returned":
      return "destructive";
    case "Canceled":
      return "outline";
    default:
      return "default";
  }
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>(mockData);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const getOrdersByStatus = (status: string) => {
    if (status === "all") return orders;
    return orders.filter(order => order.status.toLowerCase() === status.toLowerCase());
  };

  const getOrdersCountByStatus = (status: string) => {
    return getOrdersByStatus(status).length;
  };

  const getTotalOrdersCount = () => {
    return orders.length;
  };

  const getCurrentPageOrders = () => {
    const filteredOrders = getOrdersByStatus(activeTab);
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(getOrdersByStatus(activeTab).length / itemsPerPage);

  const handleBulkAction = (action: string) => {
    if (selectedOrders.length === 0) {
      toast.error("Please select orders to perform bulk action");
      return;
    }

    switch (action) {
      case 'delete':
        const updatedOrders = orders.filter(order => !selectedOrders.includes(order.id));
        setOrders(updatedOrders);
        setSelectedOrders([]);
        toast.success(`${selectedOrders.length} orders deleted successfully`);
        break;
      case 'export':
        const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id));
        console.log('Exporting orders:', selectedOrdersData);
        toast.success(`${selectedOrders.length} orders exported successfully`);
        break;
      case 'revert':
        handleRevertOrders();
        break;
      default:
        toast.error("Unknown bulk action");
    }
  };

  const handleRevertOrders = () => {
    const updatedOrders = orders.map(order => {
      if (selectedOrders.includes(order.id)) {
        // Revert logic based on current status
        let newStatus = order.status;
        switch (order.status) {
          case 'Confirmed':
            newStatus = 'Pending';
            break;
          case 'Dispatched':
            newStatus = 'Confirmed';
            break;
          case 'Canceled':
            newStatus = 'Pending';
            break;
          default:
            return order; // No revert for other statuses
        }
        return { ...order, status: newStatus };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    setSelectedOrders([]);
    toast.success(`${selectedOrders.length} orders reverted successfully`);
  };

  const isRevertAvailable = () => {
    return ['all', 'pending', 'confirmed', 'dispatched', 'canceled'].includes(activeTab);
  };

  const renderBulkActions = () => {
    if (selectedOrders.length === 0) return null;

    return (
      <div className="flex items-center gap-2 p-4 bg-blue-50 border-b">
        <span className="text-sm text-gray-600">
          {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Bulk Actions <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border shadow-lg z-50">
            <DropdownMenuItem onClick={() => handleBulkAction('export')}>
              <Download className="mr-2 h-4 w-4" />
              Export Selected
            </DropdownMenuItem>
            {isRevertAvailable() && (
              <DropdownMenuItem onClick={() => handleBulkAction('revert')}>
                <Undo2 className="mr-2 h-4 w-4" />
                Revert
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={() => handleBulkAction('delete')}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setSelectedOrders([])}
        >
          Clear Selection
        </Button>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex gap-2">
          <Input placeholder="Search orders..." />
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Orders Management</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Order
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="all">All ({getTotalOrdersCount()})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({getOrdersCountByStatus('Pending')})</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed ({getOrdersCountByStatus('Confirmed')})</TabsTrigger>
              <TabsTrigger value="dispatched">Dispatched ({getOrdersCountByStatus('Dispatched')})</TabsTrigger>
              <TabsTrigger value="delivered">Delivered ({getOrdersCountByStatus('Delivered')})</TabsTrigger>
              <TabsTrigger value="returned">Returned ({getOrdersCountByStatus('Returned')})</TabsTrigger>
              <TabsTrigger value="canceled">Canceled ({getOrdersCountByStatus('Canceled')})</TabsTrigger>
            </TabsList>

            {renderBulkActions()}

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                      checked={selectedOrders.length === getCurrentPageOrders().length && getCurrentPageOrders().length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedOrders(getCurrentPageOrders().map(order => order.id));
                        } else {
                          setSelectedOrders([]);
                        }
                      }}
                    />
                    <span className="text-sm font-medium">Select All</span>
                  </div>
                  <div className="space-y-4">
                    {getCurrentPageOrders().map((order) => (
                      <div key={order.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedOrders([...selectedOrders, order.id]);
                            } else {
                              setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                            }
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate">
                                Order #{order.id}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {order.customer.name} • {order.customer.phone}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={getStatusVariant(order.status)}>
                                {order.status}
                              </Badge>
                              <span className="text-sm font-medium text-gray-900">
                                ${order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''} • {order.delivery.address}
                            </p>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white border shadow-lg z-50">
                                  <DropdownMenuItem>
                                    <Package className="mr-2 h-4 w-4" />
                                    Track Package
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Truck className="mr-2 h-4 w-4" />
                                    Update Status
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                      checked={selectedOrders.length === getCurrentPageOrders().length && getCurrentPageOrders().length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedOrders(getCurrentPageOrders().map(order => order.id));
                        } else {
                          setSelectedOrders([]);
                        }
                      }}
                    />
                    <span className="text-sm font-medium">Select All</span>
                  </div>
                  <div className="space-y-4">
                    {getCurrentPageOrders().map((order) => (
                      <div key={order.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedOrders([...selectedOrders, order.id]);
                            } else {
                              setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                            }
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate">
                                Order #{order.id}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {order.customer.name} • {order.customer.phone}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={getStatusVariant(order.status)}>
                                {order.status}
                              </Badge>
                              <span className="text-sm font-medium text-gray-900">
                                ${order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''} • {order.delivery.address}
                            </p>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white border shadow-lg z-50">
                                  <DropdownMenuItem>
                                    <Package className="mr-2 h-4 w-4" />
                                    Track Package
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Truck className="mr-2 h-4 w-4" />
                                    Update Status
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="confirmed" className="space-y-4">
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                      checked={selectedOrders.length === getCurrentPageOrders().length && getCurrentPageOrders().length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedOrders(getCurrentPageOrders().map(order => order.id));
                        } else {
                          setSelectedOrders([]);
                        }
                      }}
                    />
                    <span className="text-sm font-medium">Select All</span>
                  </div>
                  <div className="space-y-4">
                    {getCurrentPageOrders().map((order) => (
                      <div key={order.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedOrders([...selectedOrders, order.id]);
                            } else {
                              setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                            }
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate">
                                Order #{order.id}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {order.customer.name} • {order.customer.phone}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={getStatusVariant(order.status)}>
                                {order.status}
                              </Badge>
                              <span className="text-sm font-medium text-gray-900">
                                ${order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''} • {order.delivery.address}
                            </p>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white border shadow-lg z-50">
                                  <DropdownMenuItem>
                                    <Package className="mr-2 h-4 w-4" />
                                    Track Package
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Truck className="mr-2 h-4 w-4" />
                                    Update Status
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dispatched" className="space-y-4">
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                      checked={selectedOrders.length === getCurrentPageOrders().length && getCurrentPageOrders().length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedOrders(getCurrentPageOrders().map(order => order.id));
                        } else {
                          setSelectedOrders([]);
                        }
                      }}
                    />
                    <span className="text-sm font-medium">Select All</span>
                  </div>
                  <div className="space-y-4">
                    {getCurrentPageOrders().map((order) => (
                      <div key={order.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedOrders([...selectedOrders, order.id]);
                            } else {
                              setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                            }
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate">
                                Order #{order.id}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {order.customer.name} • {order.customer.phone}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={getStatusVariant(order.status)}>
                                {order.status}
                              </Badge>
                              <span className="text-sm font-medium text-gray-900">
                                ${order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''} • {order.delivery.address}
                            </p>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white border shadow-lg z-50">
                                  <DropdownMenuItem>
                                    <Package className="mr-2 h-4 w-4" />
                                    Track Package
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Truck className="mr-2 h-4 w-4" />
                                    Update Status
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="delivered" className="space-y-4">
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                      checked={selectedOrders.length === getCurrentPageOrders().length && getCurrentPageOrders().length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedOrders(getCurrentPageOrders().map(order => order.id));
                        } else {
                          setSelectedOrders([]);
                        }
                      }}
                    />
                    <span className="text-sm font-medium">Select All</span>
                  </div>
                  <div className="space-y-4">
                    {getCurrentPageOrders().map((order) => (
                      <div key={order.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedOrders([...selectedOrders, order.id]);
                            } else {
                              setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                            }
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate">
                                Order #{order.id}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {order.customer.name} • {order.customer.phone}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={getStatusVariant(order.status)}>
                                {order.status}
                              </Badge>
                              <span className="text-sm font-medium text-gray-900">
                                ${order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''} • {order.delivery.address}
                            </p>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white border shadow-lg z-50">
                                  <DropdownMenuItem>
                                    <Package className="mr-2 h-4 w-4" />
                                    Track Package
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Truck className="mr-2 h-4 w-4" />
                                    Update Status
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="returned" className="space-y-4">
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                      checked={selectedOrders.length === getCurrentPageOrders().length && getCurrentPageOrders().length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedOrders(getCurrentPageOrders().map(order => order.id));
                        } else {
                          setSelectedOrders([]);
                        }
                      }}
                    />
                    <span className="text-sm font-medium">Select All</span>
                  </div>
                  <div className="space-y-4">
                    {getCurrentPageOrders().map((order) => (
                      <div key={order.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedOrders([...selectedOrders, order.id]);
                            } else {
                              setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                            }
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate">
                                Order #{order.id}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {order.customer.name} • {order.customer.phone}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={getStatusVariant(order.status)}>
                                {order.status}
                              </Badge>
                              <span className="text-sm font-medium text-gray-900">
                                ${order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''} • {order.delivery.address}
                            </p>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white border shadow-lg z-50">
                                  <DropdownMenuItem>
                                    <Package className="mr-2 h-4 w-4" />
                                    Track Package
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Truck className="mr-2 h-4 w-4" />
                                    Update Status
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="canceled" className="space-y-4">
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                      checked={selectedOrders.length === getCurrentPageOrders().length && getCurrentPageOrders().length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedOrders(getCurrentPageOrders().map(order => order.id));
                        } else {
                          setSelectedOrders([]);
                        }
                      }}
                    />
                    <span className="text-sm font-medium">Select All</span>
                  </div>
                  <div className="space-y-4">
                    {getCurrentPageOrders().map((order) => (
                      <div key={order.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedOrders([...selectedOrders, order.id]);
                            } else {
                              setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                            }
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate">
                                Order #{order.id}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {order.customer.name} • {order.customer.phone}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={getStatusVariant(order.status)}>
                                {order.status}
                              </Badge>
                              <span className="text-sm font-medium text-gray-900">
                                ${order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''} • {order.delivery.address}
                            </p>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white border shadow-lg z-50">
                                  <DropdownMenuItem>
                                    <Package className="mr-2 h-4 w-4" />
                                    Track Package
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Truck className="mr-2 h-4 w-4" />
                                    Update Status
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={String(itemsPerPage)}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top" className="bg-white border shadow-lg z-50">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={String(pageSize)}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Go to first page</span>
                  {"<<"}
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Go to previous page</span>
                  {"<"}
                </Button>
                <div className="flex items-center space-x-1">
                  <Input
                    className="h-8 w-12 text-center"
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = Number(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        setCurrentPage(page);
                      }
                    }}
                  />
                  <span className="text-sm text-gray-500">of {totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Go to next page</span>
                  {">"}
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Go to last page</span>
                  {">>"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
