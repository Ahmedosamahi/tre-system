
import React, { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Card } from '@/components/ui/card';
import { CreateOrderButton } from '@/components/orders/CreateOrderButton';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Package } from 'lucide-react';
import { useCreateOrderModals } from '@/hooks/useCreateOrderModals';

// Define the order type
interface Order {
  id: string;
  reference: string;
  customer: string;
  destination: string;
  date: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'returned';
  shippingCompany: string;
}

// Helper function to map order status to StatusBadge status
const mapOrderStatusToBadgeStatus = (orderStatus: Order['status']): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
  switch (orderStatus) {
    case 'pending':
      return 'warning';
    case 'in-transit':
      return 'info';
    case 'delivered':
      return 'success';
    case 'returned':
      return 'danger';
    default:
      return 'default';
  }
};

const Orders = () => {
  // Use the initial orders or load from localStorage if available
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [
      {
        id: '1001',
        reference: 'ORD-2025-001',
        customer: 'John Smith',
        destination: 'Cairo, Egypt',
        date: '2025-04-28',
        status: 'pending',
        shippingCompany: 'Aramex',
      },
      {
        id: '1002',
        reference: 'ORD-2025-002',
        customer: 'Sarah Ahmed',
        destination: 'Alexandria, Egypt',
        date: '2025-04-27',
        status: 'in-transit',
        shippingCompany: 'FedEx',
      },
      {
        id: '1003',
        reference: 'ORD-2025-003',
        customer: 'Mohamed Hassan',
        destination: 'Giza, Egypt',
        date: '2025-04-25',
        status: 'delivered',
        shippingCompany: 'Bosta',
      }
    ];
  });

  // Listen for custom events for new orders
  React.useEffect(() => {
    const handleNewOrder = (event: CustomEvent) => {
      const newOrder = event.detail;
      setOrders(prevOrders => {
        const updatedOrders = [...prevOrders, newOrder];
        // Save to localStorage
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        return updatedOrders;
      });
    };

    // Add event listener
    window.addEventListener('newOrder' as any, handleNewOrder as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('newOrder' as any, handleNewOrder as EventListener);
    };
  }, []);

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-brand" />
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        </div>
        <div className="flex gap-4">
          <CreateOrderButton />
        </div>
      </div>
      
      <Card className="p-6">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>List of all orders</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Shipping Company</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.reference}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.destination}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.shippingCompany}</TableCell>
                    <TableCell>
                      <StatusBadge status={mapOrderStatusToBadgeStatus(order.status)}>{order.status}</StatusBadge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="min-h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No orders found. Create your first order.</p>
          </div>
        )}
      </Card>
    </PageLayout>
  );
};

export default Orders;
