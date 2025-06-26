
export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  city: string;
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'returned' | 'canceled';
  amount: number;
  codAmount?: number;
  weight?: number;
  courierCompany?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt?: string;
  deliveryDate?: string;
  notes?: string;
}
