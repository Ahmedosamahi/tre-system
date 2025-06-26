import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { CreateOrderButton } from "@/components/orders/CreateOrderButton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const handleCloseOrderDetails = () => {
    setIsOrderDetailsOpen(false);
    setSelectedOrder(null);
  };

  const orders = [
    {
      id: "ORD-001",
      customer: "Ahmed Mohamed",
      status: "Pending",
      date: "2024-01-15",
      total: "250 EGP",
    },
    {
      id: "ORD-002",
      customer: "Fatima Ali",
      status: "Confirmed",
      date: "2024-01-14",
      total: "180 EGP",
    },
    {
      id: "ORD-003",
      customer: "Omar Hassan",
      status: "Shipped",
      date: "2024-01-13",
      total: "320 EGP",
    },
    {
      id: "ORD-004",
      customer: "Nour Ibrahim",
      status: "Delivered",
      date: "2024-01-12",
      total: "150 EGP",
    },
    {
      id: "ORD-005",
      customer: "Youssef Mahmoud",
      status: "Pending",
      date: "2024-01-11",
      total: "275 EGP",
    },
  ];

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">Manage and track all your orders</p>
          </div>
          <div className="flex space-x-3">
            <CreateOrderButton />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Order ID</th>
                        <th className="text-left p-4">Customer</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Date</th>
                        <th className="text-left p-4">Total</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{order.id}</td>
                          <td className="p-4">{order.customer}</td>
                          <td className="p-4">
                            <StatusBadge status={order.status === 'Delivered' ? 'success' : order.status === 'Pending' ? 'warning' : 'info'}>
                              {order.status}
                            </StatusBadge>
                          </td>
                          <td className="p-4">{order.date}</td>
                          <td className="p-4">{order.total}</td>
                          <td className="p-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Order ID</th>
                        <th className="text-left p-4">Customer</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Date</th>
                        <th className="text-left p-4">Total</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.filter(order => order.status === 'Pending').map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{order.id}</td>
                          <td className="p-4">{order.customer}</td>
                          <td className="p-4">
                            <StatusBadge status="warning">
                              {order.status}
                            </StatusBadge>
                          </td>
                          <td className="p-4">{order.date}</td>
                          <td className="p-4">{order.total}</td>
                          <td className="p-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="confirmed" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Confirmed Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Order ID</th>
                        <th className="text-left p-4">Customer</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Date</th>
                        <th className="text-left p-4">Total</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.filter(order => order.status === 'Confirmed').map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{order.id}</td>
                          <td className="p-4">{order.customer}</td>
                          <td className="p-4">
                            <StatusBadge status="info">
                              {order.status}
                            </StatusBadge>
                          </td>
                          <td className="p-4">{order.date}</td>
                          <td className="p-4">{order.total}</td>
                          <td className="p-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipped" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipped Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Order ID</th>
                        <th className="text-left p-4">Customer</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Date</th>
                        <th className="text-left p-4">Total</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.filter(order => order.status === 'Shipped').map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{order.id}</td>
                          <td className="p-4">{order.customer}</td>
                          <td className="p-4">
                            <StatusBadge status="info">
                              {order.status}
                            </StatusBadge>
                          </td>
                          <td className="p-4">{order.date}</td>
                          <td className="p-4">{order.total}</td>
                          <td className="p-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivered" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivered Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Order ID</th>
                        <th className="text-left p-4">Customer</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Date</th>
                        <th className="text-left p-4">Total</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.filter(order => order.status === 'Delivered').map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-medium">{order.id}</td>
                          <td className="p-4">{order.customer}</td>
                          <td className="p-4">
                            <StatusBadge status="success">
                              {order.status}
                            </StatusBadge>
                          </td>
                          <td className="p-4">{order.date}</td>
                          <td className="p-4">{order.total}</td>
                          <td className="p-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Sheet open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
          <SheetContent className="w-[600px] sm:max-w-[600px]">
            <SheetHeader>
              <SheetTitle>Order Details</SheetTitle>
            </SheetHeader>
            
            {selectedOrder && (
              <div className="space-y-8 mt-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                {/* Order Summary */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">ORD-2025-10001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <StatusBadge status="warning">Pending</StatusBadge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created on:</span>
                      <span className="font-medium">2025-05-07</span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">Ahmed Mohamed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">+201012345678</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium text-right">123 El Nasr St, Nasr City, Cairo, Cairo</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">SKU001: Men's T-Shirt</span>
                        <span className="text-gray-600">Qty: 1</span>
                      </div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">SKU002: Women's Scarf</span>
                        <span className="text-gray-600">Qty: 1</span>
                      </div>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-semibold">Total:</span>
                      <span className="font-semibold">2</span>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Type:</span>
                      <span className="font-medium">Delivery</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium">1.5 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Courier:</span>
                      <span className="font-medium">Aramex</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Attempts:</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Warehouse:</span>
                      <span className="font-medium">Cairo Main</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">AWB:</span>
                      <span className="font-medium">AWB0012345</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reference:</span>
                      <span className="font-medium">REF-001</span>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">Cash</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <StatusBadge status="warning">Pending</StatusBadge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Value of Goods:</span>
                      <span className="font-medium">300 EGP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">COD Amount:</span>
                      <span className="font-medium">250 EGP</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" className="w-full">
                      Edit Order
                    </Button>
                    <Button variant="outline" className="w-full">
                      Print AWB
                    </Button>
                    <Button variant="outline" className="w-full">
                      Print Invoice
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </PageLayout>
  );
};

export default Orders;
