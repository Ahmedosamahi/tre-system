
import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Download, Printer, MoreHorizontal } from "lucide-react";
import { CreateOrderButton } from "@/components/orders/CreateOrderButton";
import { OrderDetailsSidebar } from "@/components/orders/OrderDetailsSidebar";
import { Order } from "@/types/Order";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock data - sample orders
  const mockOrders: Order[] = [
    {
      id: "1",
      orderNumber: "ORD-2025-10001",
      status: "pending",
      createdDate: "2025-05-07T10:00:00Z",
      lastUpdated: "2025-06-26T11:42:00Z",
      customerName: "Ahmed Mohamed",
      customerPhone: "+201012345678",
      customerAddress: "123 El Nasr St, Nasr City, Cairo, Cairo",
      items: [
        { id: "1", sku: "SKU001", description: "Men's T-Shirt", quantity: 1, price: 150 },
        { id: "2", sku: "SKU002", description: "Women's Scarf", quantity: 1, price: 100 }
      ],
      serviceType: "Delivery",
      weight: 1.5,
      courier: "Aramex",
      deliveryAttempts: 0,
      warehouse: "Cairo Main",
      awb: "AWB0012345",
      reference: "REF-001",
      paymentMethod: "Cash",
      paymentStatus: "pending",
      valueOfGoods: 300,
      codAmount: 250,
      statusHistory: [
        {
          id: "1",
          fromStatus: "Created",
          toStatus: "Pending",
          timestamp: "2025-05-07T10:00:00Z",
          userId: "user1",
          userName: "Ahmed Mohamed"
        }
      ],
      comments: [],
      tags: ["Urgent"]
    }
  ];

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsSidebarOpen(true);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setSelectedOrder(updatedOrder);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "confirmed":
        return "default";
      case "dispatched":
        return "default";
      case "delivered":
        return "default";
      case "returned":
        return "destructive";
      case "canceled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === mockOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(mockOrders.map(order => order.id));
    }
  };

  const OrderTable = ({ orders }: { orders: Order[] }) => (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedOrders.length === orders.length && orders.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Order Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Courier</TableHead>
            <TableHead>Attempts</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow 
              key={order.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleOrderClick(order)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedOrders.includes(order.id)}
                  onCheckedChange={() => handleSelectOrder(order.id)}
                />
              </TableCell>
              <TableCell className="font-mono text-sm">
                <div>{order.orderNumber}</div>
                <div className="text-xs text-gray-500">AWB: {order.awb}</div>
                <div className="text-xs text-gray-500">Ref: {order.reference}</div>
              </TableCell>
              <TableCell>
                <div>{order.customerName}</div>
                <div className="text-xs text-gray-500">{order.customerPhone}</div>
                <div className="text-xs text-gray-500">{order.customerAddress}</div>
              </TableCell>
              <TableCell>{new Date(order.createdDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(order.status)} className="capitalize">
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{order.courier || "-"}</TableCell>
              <TableCell>{order.deliveryAttempts}</TableCell>
              <TableCell>
                <div>{order.valueOfGoods} EGP</div>
                <div className="text-xs text-gray-500">COD: {order.codAmount} EGP</div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(order.paymentStatus)} className="capitalize">
                  {order.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Order</DropdownMenuItem>
                    <DropdownMenuItem>Print AWB</DropdownMenuItem>
                    <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Orders</h1>
          <CreateOrderButton />
        </div>

        {/* Top Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              Bulk Actions
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print AWB
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print Invoice
            </Button>
            <Button variant="outline" size="sm">
              Show Filters
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-80"
            />
          </div>
        </div>

        {/* Orders Table with Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-12">
            <TabsTrigger value="all" className="text-xs">All <span className="ml-1 bg-blue-500 text-white px-1 rounded text-xs">176</span></TabsTrigger>
            <TabsTrigger value="pending" className="text-xs">Pending Orders <span className="ml-1 bg-blue-500 text-white px-1 rounded text-xs">10</span></TabsTrigger>
            <TabsTrigger value="confirmed" className="text-xs">Confirmed/Approved <span className="ml-1 bg-blue-500 text-white px-1 rounded text-xs">10</span></TabsTrigger>
            <TabsTrigger value="dispatched" className="text-xs">Dispatched <span className="ml-1 bg-blue-500 text-white px-1 rounded text-xs">10</span></TabsTrigger>
            <TabsTrigger value="picked-up" className="text-xs">Picked-Up <span className="ml-1 bg-blue-500 text-white px-1 rounded text-xs">10</span></TabsTrigger>
            <TabsTrigger value="delivering" className="text-xs">Delivering <span className="ml-1 bg-blue-500 text-white px-1 rounded text-xs">10</span></TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs">Delivered - Signed <span className="ml-1 bg-blue-500 text-white px-1 rounded text-xs">10</span></TabsTrigger>
            <TabsTrigger value="returning" className="text-xs">Returning <span className="ml-1 bg-blue-500 text-white px-1 rounded text-xs">10</span></TabsTrigger>
            <TabsTrigger value="returned" className="text-xs">Returned <span className="ml-1 bg-blue-500 text-white px-1 rounded text-xs">10</span></TabsTrigger>
            <TabsTrigger value="canceled" className="text-xs">Canceled <span className="ml-1 bg-blue-500 text-white px-1 rounded text-xs">10</span></TabsTrigger>
            <TabsTrigger value="pending-refund" className="text-xs">Pending Refund <span className="ml-1 bg-blue-500 text-white px-1 rounded text-xs">10</span></TabsTrigger>
            <TabsTrigger value="refunded" className="text-xs">Refunded <span className="ml-1 bg-blue-500 text-white px-1 rounded text-xs">10</span></TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <OrderTable orders={mockOrders} />
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <OrderTable orders={mockOrders.filter(order => order.status === 'pending')} />
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            <OrderTable orders={mockOrders.filter(order => order.status === 'confirmed')} />
          </TabsContent>

          <TabsContent value="dispatched" className="space-y-4">
            <OrderTable orders={mockOrders.filter(order => order.status === 'dispatched')} />
          </TabsContent>

          <TabsContent value="picked-up" className="space-y-4">
            <OrderTable orders={[]} />
          </TabsContent>

          <TabsContent value="delivering" className="space-y-4">
            <OrderTable orders={[]} />
          </TabsContent>

          <TabsContent value="delivered" className="space-y-4">
            <OrderTable orders={mockOrders.filter(order => order.status === 'delivered')} />
          </TabsContent>

          <TabsContent value="returning" className="space-y-4">
            <OrderTable orders={[]} />
          </TabsContent>

          <TabsContent value="returned" className="space-y-4">
            <OrderTable orders={mockOrders.filter(order => order.status === 'returned')} />
          </TabsContent>

          <TabsContent value="canceled" className="space-y-4">
            <OrderTable orders={mockOrders.filter(order => order.status === 'canceled')} />
          </TabsContent>

          <TabsContent value="pending-refund" className="space-y-4">
            <OrderTable orders={[]} />
          </TabsContent>

          <TabsContent value="refunded" className="space-y-4">
            <OrderTable orders={[]} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Details Sidebar */}
      <OrderDetailsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        order={selectedOrder}
        onUpdateOrder={handleUpdateOrder}
      />
    </PageLayout>
  );
};

export default Orders;
