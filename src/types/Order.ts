
export interface Order {
  id: number;
  orderNumber: string;
  customer: {
    id: number;
    name: string;
  };
  date: string;
  total: number;
  status: string;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
}
