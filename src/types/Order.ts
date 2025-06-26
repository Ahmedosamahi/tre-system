
export interface OrderItem {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  price: number;
}

export interface StatusHistoryEntry {
  id: string;
  fromStatus: string;
  toStatus: string;
  timestamp: string;
  userId: string;
  userName: string;
}

export interface Comment {
  id: string;
  text: string;
  timestamp: string;
  userId: string;
  userName: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'returned' | 'canceled';
  createdDate: string;
  lastUpdated: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  serviceType: string;
  weight: number;
  courier: string;
  deliveryAttempts: number;
  warehouse: string;
  awb: string;
  reference: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  valueOfGoods: number;
  codAmount: number;
  statusHistory: StatusHistoryEntry[];
  comments: Comment[];
  tags: string[];
}
