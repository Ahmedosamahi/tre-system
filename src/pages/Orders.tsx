import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types/Order';
import { User } from '../types/User';

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
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Function to handle status change
  const handleStatusChange = (orderId: number, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredOrders = orders.filter((order) => {
    const searchMatch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter ? order.status === statusFilter : true;
    return searchMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  // Get current orders
  const indexOfLastOrder = currentPage * rowsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* Search and Filter */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search order number or customer name"
          className="border rounded px-2 py-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-2 py-1"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* Order Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Order Number</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  <Link to={`/orders/${order.id}`} className="text-blue-500 hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="border px-4 py-2">{order.customer.name}</td>
                <td className="border px-4 py-2">{order.date}</td>
                <td className="border px-4 py-2">${order.total.toFixed(2)}</td>
                <td className="border px-4 py-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
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
          <select 
            value={rowsPerPage} 
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-600">
            from {filteredOrders.length} orders
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
