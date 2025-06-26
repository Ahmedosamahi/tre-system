import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Filter, MoreHorizontal, Download, Printer, ChevronLeft, ChevronRight } from "lucide-react";
import { CreateOrderButton } from "@/components/orders/CreateOrderButton";
import { OrderDetailsSidebar } from "@/components/orders/OrderDetailsSidebar";
import { Order } from "@/types/Order";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const itemsPerPage = 10;

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

  const totalPages = Math.ceil(mockOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = mockOrders.slice(startIndex, endIndex);

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
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="w-12"></TableHead>
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
              <TableCell className="font-mono text-sm">{order.orderNumber}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(order.status)} className="capitalize">
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(order.createdDate).toLocaleDateString()}</TableCell>
              <TableCell>{order.valueOfGoods} EGP</TableCell>
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground">Manage and track your orders</p>
          </div>
          <CreateOrderButton />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">-2% from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,156</div>
              <p className="text-xs text-muted-foreground">+15% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">93.7%</div>
              <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-80"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedOrders.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Bulk Actions ({selectedOrders.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Export Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Printer className="h-4 w-4 mr-2" />
                    Print AWB
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Invoice
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Orders Table with Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Orders (1,234)</TabsTrigger>
            <TabsTrigger value="pending">Pending (45)</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed (123)</TabsTrigger>
            <TabsTrigger value="dispatched">Dispatched (234)</TabsTrigger>
            <TabsTrigger value="delivered">Delivered (789)</TabsTrigger>
            <TabsTrigger value="returned">Returned (23)</TabsTrigger>
            <TabsTrigger value="canceled">Canceled (20)</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <OrderTable orders={currentOrders} />
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <OrderTable orders={currentOrders.filter(order => order.status === 'pending')} />
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            <OrderTable orders={currentOrders.filter(order => order.status === 'confirmed')} />
          </TabsContent>

          <TabsContent value="dispatched" className="space-y-4">
            <OrderTable orders={currentOrders.filter(order => order.status === 'dispatched')} />
          </TabsContent>

          <TabsContent value="delivered" className="space-y-4">
            <OrderTable orders={currentOrders.filter(order => order.status === 'delivered')} />
          </TabsContent>

          <TabsContent value="returned" className="space-y-4">
            <OrderTable orders={currentOrders.filter(order => order.status === 'returned')} />
          </TabsContent>

          <TabsContent value="canceled" className="space-y-4">
            <OrderTable orders={currentOrders.filter(order => order.status === 'canceled')} />
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, mockOrders.length)} of {mockOrders.length} orders
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
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
