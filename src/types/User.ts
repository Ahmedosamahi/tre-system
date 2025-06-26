
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'courier';
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
}
