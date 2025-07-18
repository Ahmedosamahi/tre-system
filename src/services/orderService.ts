
import { OrderData } from '@/types';

// Mock order database
const mockOrders: Record<string, OrderData> = {
  'ORD-2025-10021': {
    orderNumber: 'ORD-2025-10021',
    customerName: 'Ahmed Hassan',
    customerPhone: '+201234567890',
    customerEmail: 'ahmed.hassan@email.com',
    shippingCompany: 'Aramex',
    shippingAddress: '123 Main St, Cairo, Egypt',
    totalAmount: 250.00,
    paymentMethod: 'Cash',
    orderDate: '2025-01-15',
    status: 'In Transit',
    items: [
      { id: '1', name: 'Samsung Galaxy Phone', quantity: 1, price: 250.00, sku: 'PHONE-001' }
    ]
  },
  'ORD-2025-10022': {
    orderNumber: 'ORD-2025-10022',
    customerName: 'Sara Ali',
    customerPhone: '+201234567891',
    customerEmail: 'sara.ali@email.com',
    shippingCompany: 'DHL',
    shippingAddress: '456 Garden City, Alexandria, Egypt',
    totalAmount: 150.00,
    paymentMethod: 'Visa',
    orderDate: '2025-01-14',
    status: 'Delivered',
    items: [
      { id: '2', name: 'Laptop Bag', quantity: 2, price: 75.00, sku: 'BAG-001' }
    ]
  },
  'ORD-2025-10023': {
    orderNumber: 'ORD-2025-10023',
    customerName: 'Mohamed Farid',
    customerPhone: '+201234567892',
    customerEmail: 'mohamed.farid@email.com',
    shippingCompany: 'FedEx',
    shippingAddress: '789 Downtown, Giza, Egypt',
    totalAmount: 320.00,
    paymentMethod: 'Mastercard',
    orderDate: '2025-01-13',
    status: 'Pending',
    items: [
      { id: '3', name: 'Wireless Headphones', quantity: 1, price: 320.00, sku: 'HEAD-001' }
    ]
  }
};

// Mock AWB to Order mapping
const awbToOrderMapping: Record<string, string> = {
  'AWB123456789': 'ORD-2025-10021',
  'AWB987654321': 'ORD-2025-10022',
  'AWB456789123': 'ORD-2025-10023'
};

export const fetchOrderByNumber = async (orderNumber: string): Promise<OrderData | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return mockOrders[orderNumber] || null;
};

export const fetchOrderByAWB = async (awb: string): Promise<OrderData | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const orderNumber = awbToOrderMapping[awb];
  if (orderNumber) {
    return mockOrders[orderNumber] || null;
  }
  
  return null;
};

export const fetchOrderByReference = async (referenceNumber: string): Promise<OrderData | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simple reference number search simulation
  const order = Object.values(mockOrders).find(order => 
    order.orderNumber.includes(referenceNumber.slice(-3)) // Match last 3 chars
  );
  
  return order || null;
};
