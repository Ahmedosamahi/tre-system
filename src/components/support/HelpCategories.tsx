
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  BookOpen, 
  Truck, 
  CreditCard, 
  AlertTriangle, 
  Settings 
} from 'lucide-react';

interface HelpCategoriesProps {
  onCategoryClick: (categoryId: string) => void;
}

const categories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of using our platform',
    icon: BookOpen,
    color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
  },
  {
    id: 'shipping-delivery',
    title: 'Shipping & Delivery',
    description: 'Track orders and manage shipments',
    icon: Truck,
    color: 'bg-green-50 hover:bg-green-100 border-green-200'
  },
  {
    id: 'financial-billing',
    title: 'Financial & Billing',
    description: 'Payment methods and billing questions',
    icon: CreditCard,
    color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
  },
  {
    id: 'technical-issues',
    title: 'Technical Issues',
    description: 'Troubleshooting and technical support',
    icon: AlertTriangle,
    color: 'bg-orange-50 hover:bg-orange-100 border-orange-200'
  },
  {
    id: 'account-settings',
    title: 'Account & Settings',
    description: 'Manage your account and preferences',
    icon: Settings,
    color: 'bg-gray-50 hover:bg-gray-100 border-gray-200'
  }
];

export const HelpCategories = ({ onCategoryClick }: HelpCategoriesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {categories.map((category) => (
        <Card
          key={category.id}
          className={`p-6 cursor-pointer transition-all duration-200 border-2 ${category.color}`}
          onClick={() => onCategoryClick(category.id)}
        >
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <category.icon className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">{category.title}</h3>
            <p className="text-sm text-gray-600">{category.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
