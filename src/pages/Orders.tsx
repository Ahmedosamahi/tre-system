import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types/Order';
import { User } from '../types/User';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown, Undo } from 'lucide-react';

// Mock data for orders (replace with actual API calls)
const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'ORD-20240101-001',
    customer: { id: 101, name: 'John Doe' },
    date: '2024-01-01',
    total: 150.00,
    status: 'Shipped',
    items: [{ id: 1, name: 'Product A', quantity: 2, price: 25.00 }],
  },
  {
    id: 2,
    orderNumber: 'ORD-20240105-002',
    customer: { id: 102, name: 'Jane Smith' },
    date: '2024-01-05',
    total: 200.00,
    status: 'Delivered',
    items: [{ id: 2, name: 'Product B', quantity: 1, price: 100.00 }],
  },
  {
    id: 3,
    orderNumber: 'ORD-20240110-003',
    customer: { id: 101, name: 'John Doe' },
    date: '2024-01-10',
    total: 75.00,
    status: 'Pending',
    items: [{ id: 3, name: 'Product C', quantity: 3, price: 25.00 }],
  },
  {
    id: 4,
    orderNumber: 'ORD-20240115-004',
    customer: { id: 103, name: 'Alice Johnson' },
    date: '2024-01-15',
    total: 300.00,
    status: 'Shipped',
    items: [{ id: 4, name: 'Product D', quantity: 2, price: 150.00 }],
  },
  {
    id: 5,
    orderNumber: 'ORD-20240120-005',
    customer: { id: 102, name: 'Jane Smith' },
    date: '2024-01-20',
    total: 120.00,
    status: 'Delivered',
    items: [{ id: 5, name: 'Product E', quantity: 4, price: 30.00 }],
  },
  {
    id: 6,
    orderNumber: 'ORD-20240125-006',
    customer: { id: 104, name: 'Bob Williams' },
    date: '2024-01-25',
    total: 90.00,
    status: 'Pending',
    items: [{ id: 6, name: 'Product F', quantity: 1, price: 90.00 }],
  },
  {
    id: 7,
    orderNumber: 'ORD-20240130-007',
    customer: { id: 101, name: 'John Doe' },
    date: '2024-01-30',
    total: 225.00,
    status: 'Shipped',
    items: [{ id: 7, name: 'Product G', quantity: 3, price: 75.00 }],
  },
  {
    id: 8,
    orderNumber: 'ORD-20240205-008',
    customer: { id: 103, name: 'Alice Johnson' },
    date: '2024-02-05',
    total: 180.00,
    status: 'Delivered',
    items: [{ id: 8, name: 'Product H', quantity: 2, price: 90.00 }],
  },
  {
    id: 9,
    orderNumber: 'ORD-20240210-009',
    customer: { id: 102, name: 'Jane Smith' },
    date: '2024-02-10',
    total: 140.00,
    status: 'Pending',
    items: [{ id: 9, name: 'Product I', quantity: 7, price: 20.00 }],
  },
  {
    id: 10,
    orderNumber: 'ORD-20240215-010',
    customer: { id: 104, name: 'Bob Williams' },
    date: '2024-02-15',
    total: 350.00,
    status: 'Shipped',
    items: [{ id: 10, name: 'Product J', quantity: 5, price: 70.00 }],
  },
  // Add more orders as needed
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  // Function to handle status change
  const handleStatusChange = (orderId: number, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Function to handle bulk revert
  const handleBulkRevert = () => {
    if (selectedOrders.length === 0) return;
    
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (selectedOrders.includes(order.id)) {
          // Revert logic based on current status
          let revertedStatus = order.status;
          switch (order.status) {
            case 'Pending':
              revertedStatus = 'Pending'; // Already at initial status
              break;
            case 'Confirmed':
              revertedStatus = 'Pending';
              break;
            case 'Dispatched':
              revertedStatus = 'Confirmed';
              break;
            case 'Canceled':
              revertedStatus = 'Pending'; // Allow reactivation from canceled
              break;
            default:
              revertedStatus = order.status; // No change for other statuses
          }
          return { ...order, status: revertedStatus };
        }
        return order;
      })
    );
    setSelectedOrders([]);
  };

  // Function to handle individual order selection
  const handleOrderSelection = (orderId: number, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  // Function to handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(currentOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  // Check if revert button should be available for current tab
  const isRevertAvailable = () => {
    const allowedTabs = ['All', 'Pending', 'Confirmed', 'Dispatched', 'Canceled'];
    return allowedTabs.includes(statusFilter);
  };

  const filteredOrders = orders.filter((order) => {
    const searchMatch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter === 'All' ? true : order.status === statusFilter;
    return searchMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  // Get current orders
  const indexOfLastOrder = currentPage * rowsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Status tabs
  const statusTabs = [
    'All', 'Pending', 'Confirmed', 'Dispatched', 'Picked-Up', 
    'Delivering', 'Delivered', 'Returning', 'Returned', 
    'Canceled', 'Pending Refund', 'Refunded'
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 border-b">
        {statusTabs.map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status);
              setCurrentPage(1);
              setSelectedOrders([]);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
              statusFilter === status
                ? 'text-blue-600 border-blue-600 bg-blue-50'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {status} ({orders.filter(order => status === 'All' ? true : order.status === status).length})
          </button>
        ))}
      </div>

      {/* Search and Bulk Actions */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Search order number or customer name"
          className="border rounded px-3 py-2 flex-1 max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedOrders.length} selected
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isRevertAvailable() && (
                  <DropdownMenuItem onClick={handleBulkRevert} className="flex items-center gap-2">
                    <Undo className="h-4 w-4" />
                    Revert Orders
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>Export Selected</DropdownMenuItem>
                <DropdownMenuItem>Delete Selected</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Order Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === currentOrders.length && currentOrders.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded"
                />
              </th>
              <th className="px-4 py-2 text-left">Order Number</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={(e) => handleOrderSelection(order.id, e.target.checked)}
                    className="rounded"
                  />
                </td>
                <td className="border px-4 py-2">
                  <Link to={`/orders/${order.id}`} className="text-blue-500 hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="border px-4 py-2">{order.customer.name}</td>
                <td className="border px-4 py-2">{order.date}</td>
                <td className="border px-4 py-2">${order.total.toFixed(2)}</td>
                <td className="border px-4 py-2">
                  <Select
                    value={order.status}
                    onValueChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="Dispatched">Dispatched</SelectItem>
                      <SelectItem value="Picked-Up">Picked-Up</SelectItem>
                      <SelectItem value="Delivering">Delivering</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Returning">Returning</SelectItem>
                      <SelectItem value="Returned">Returned</SelectItem>
                      <SelectItem value="Canceled">Canceled</SelectItem>
                      <SelectItem value="Pending Refund">Pending Refund</SelectItem>
                      <SelectItem value="Refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="border px-4 py-2">
                  <Link to={`/orders/${order.id}`} className="text-blue-500 hover:underline">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-t">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Show</span>
          <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">
            from {filteredOrders.length} orders
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
