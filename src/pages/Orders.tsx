import React, { useState, useMemo } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Order } from '@/types/Order';
import { OrderDetailsSidebar } from '@/components/orders/OrderDetailsSidebar';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Orders() {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState('all');
  const itemsPerPage = 10;

  const mockOrders: Order[] = [
    {
      id: 'ORD-2025-10001',
      status: 'Pending',
      customerName: 'Ahmed Mohamed',
      customerPhone: '+201012345678',
      customerAddress: '123 El Nasr St, Nasr City, Cairo, Cairo',
      total: 300,
      codAmount: 250,
      courier: 'Aramex',
      createdAt: '2025-05-07',
      updatedAt: '2025-05-07 11:34 AM',
    },
    {
      id: 'ORD-2025-10002',
      status: 'Confirmed',
      customerName: 'Fatima Ali',
      customerPhone: '+201098765432',
      customerAddress: '456 Tahrir Square, Downtown, Cairo, Cairo',
      total: 150,
      codAmount: 150,
      courier: 'DHL',
      createdAt: '2025-05-06',
      updatedAt: '2025-05-06 02:15 PM',
    },
    {
      id: 'ORD-2025-10003',
      status: 'Dispatched',
      customerName: 'Omar Hassan',
      customerPhone: '+201087654321',
      customerAddress: '789 Nile Corniche, Zamalek, Cairo, Cairo',
      total: 500,
      codAmount: 400,
      courier: 'FedEx',
      createdAt: '2025-05-05',
      updatedAt: '2025-05-05 10:30 AM',
    },
    {
      id: 'ORD-2025-10004',
      status: 'Delivered',
      customerName: 'Layla Ibrahim',
      customerPhone: '+201076543210',
      customerAddress: '321 Heliopolis, New Cairo, Cairo, Cairo',
      total: 200,
      codAmount: 180,
      courier: 'Aramex',
      createdAt: '2025-05-04',
      updatedAt: '2025-05-04 04:45 PM',
    },
    {
      id: 'ORD-2025-10005',
      status: 'Returned',
      customerName: 'Youssef Mahmoud',
      customerPhone: '+201065432109',
      customerAddress: '654 Maadi, Old Cairo, Cairo, Cairo',
      total: 350,
      codAmount: 300,
      courier: 'DHL',
      createdAt: '2025-05-03',
      updatedAt: '2025-05-03 09:20 AM',
    },
    {
      id: 'ORD-2025-10006',
      status: 'Canceled',
      customerName: 'Nour El-Din',
      customerPhone: '+201054321098',
      customerAddress: '987 Giza, Pyramids Area, Giza, Giza',
      total: 120,
      codAmount: 100,
      courier: '-',
      createdAt: '2025-05-02',
      updatedAt: '2025-05-02 01:10 PM',
    }
  ];

  const filteredOrders = useMemo(() => {
    return mockOrders.filter(order => {
      switch (currentTab) {
        case 'pending':
          return order.status === 'Pending';
        case 'confirmed':
          return order.status === 'Confirmed';
        case 'dispatched':
          return order.status === 'Dispatched';
        case 'delivered':
          return order.status === 'Delivered';
        case 'returned':
          return order.status === 'Returned';
        case 'canceled':
          return order.status === 'Canceled';
        case 'all':
        default:
          return true;
      }
    });
  }, [currentTab]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsSidebarOpen(true);
  };

  const handleOrderUpdate = (updatedOrder: Order) => {
    // Here you would typically update the order in your data source
    console.log('Order updated:', updatedOrder);
    setSelectedOrder(updatedOrder);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedOrder(null);
  };

  const handleBulkAction = (action: string) => {
    if (action === 'revert' && selectedOrders.length > 0) {
      console.log('Reverting orders:', selectedOrders);
      // Implement revert logic here
    }
  };

  const getOrderCounts = () => {
    return {
      all: mockOrders.length,
      pending: mockOrders.filter(o => o.status === 'Pending').length,
      confirmed: mockOrders.filter(o => o.status === 'Confirmed').length,
      dispatched: mockOrders.filter(o => o.status === 'Dispatched').length,
      delivered: mockOrders.filter(o => o.status === 'Delivered').length,
      returned: mockOrders.filter(o => o.status === 'Returned').length,
      canceled: mockOrders.filter(o => o.status === 'Canceled').length,
    };
  };

  const orderCounts = getOrderCounts();

  const canShowRevert = ['all', 'pending', 'confirmed', 'dispatched', 'canceled'].includes(currentTab);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Pending': return 'outline';
      case 'Confirmed': return 'secondary';
      case 'Dispatched': return 'default';
      case 'Delivered': return 'default';
      case 'Returned': return 'destructive';
      case 'Canceled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: 'all', label: `All (${orderCounts.all})` },
              { id: 'pending', label: `Pending (${orderCounts.pending})` },
              { id: 'confirmed', label: `Confirmed (${orderCounts.confirmed})` },
              { id: 'dispatched', label: `Dispatched (${orderCounts.dispatched})` },
              { id: 'delivered', label: `Delivered (${orderCounts.delivered})` },
              { id: 'returned', label: `Returned (${orderCounts.returned})` },
              { id: 'canceled', label: `Canceled (${orderCounts.canceled})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`${
                  currentTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-700">
                {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
              </p>
              <div className="flex space-x-2">
                {canShowRevert && (
                  <button
                    onClick={() => handleBulkAction('revert')}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                  >
                    Revert
                  </button>
                )}
                <button
                  onClick={() => setSelectedOrders([])}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(paginatedOrders.map(order => order.id));
                      } else {
                        setSelectedOrders([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleOrderClick(order)}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                          setSelectedOrders([...selectedOrders, order.id]);
                        } else {
                          setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Dispatched' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Returned' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.total} EGP
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.courier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm rounded-md ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <OrderDetailsSidebar
        order={selectedOrder}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        onOrderUpdate={handleOrderUpdate}
      />
    </PageLayout>
  );
}
