import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Truck, 
  BarChart, 
  CreditCard, 
  MessageSquare, 
  Settings,
  ExternalLink,
  Play,
  FileText,
  HelpCircle
} from 'lucide-react';

const quickLinks = [
  {
    title: 'Create Your First Order',
    description: 'Step-by-step guide to creating and managing orders',
    icon: ShoppingCart,
    category: 'Tutorial',
    readTime: '5 min',
    isPopular: true,
    action: () => {
      // Navigate to orders page or open tutorial
      window.open('/orders', '_blank');
    }
  },
  {
    title: 'Tracking Shipments',
    description: 'Learn how to track and monitor your shipments',
    icon: Truck,
    category: 'Guide',
    readTime: '3 min',
    isPopular: true,
    action: () => {
      // Scroll to tracking section or open guide
      const element = document.getElementById('tracking-guide');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },
  {
    title: 'Understanding Reports',
    description: 'Make sense of your delivery analytics and reports',
    icon: BarChart,
    category: 'Analytics',
    readTime: '8 min',
    isPopular: false,
    action: () => {
      window.open('/reports', '_blank');
    }
  },
  {
    title: 'COD Payment Setup',
    description: 'Configure Cash on Delivery payment methods',
    icon: CreditCard,
    category: 'Financial',
    readTime: '6 min',
    isPopular: true,
    action: () => {
      window.open('/financial', '_blank');
    }
  },
  {
    title: 'Handling Support Tickets',
    description: 'Create and manage customer service tickets',
    icon: MessageSquare,
    category: 'CRM',
    readTime: '4 min',
    isPopular: false,
    action: () => {
      window.open('/crm-customer-service', '_blank');
    }
  },
  {
    title: 'API Integration',
    description: 'Connect external systems using our API',
    icon: Settings,
    category: 'Technical',
    readTime: '12 min',
    isPopular: false,
    action: () => {
      // Open API documentation
      alert('API documentation would open here');
    }
  }
];

const troubleshootingLinks = [
  {
    title: 'Order Creation Issues',
    description: 'Common problems when creating orders',
    icon: HelpCircle,
    action: () => {
      const element = document.getElementById('technical-issues');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },
  {
    title: 'Tracking Problems',
    description: 'Troubleshoot tracking and delivery issues',
    icon: Truck,
    action: () => {
      const element = document.getElementById('shipment-issues');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },
  {
    title: 'Payment Issues',
    description: 'Resolve billing and payment problems',
    icon: CreditCard,
    action: () => {
      const element = document.getElementById('financial-billing');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
];

export const QuickLinks = () => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Tutorial': return 'bg-blue-100 text-blue-800';
      case 'Guide': return 'bg-green-100 text-green-800';
      case 'Analytics': return 'bg-purple-100 text-purple-800';
      case 'Financial': return 'bg-yellow-100 text-yellow-800';
      case 'CRM': return 'bg-pink-100 text-pink-800';
      case 'Technical': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Popular Resources */}
      <div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Quick Start Resources</h2>
          <p className="text-gray-600">Get started with the most popular guides and tutorials</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => (
            <Card key={index} className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${link.isPopular ? 'ring-2 ring-blue-100' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <link.icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <Badge className={`text-xs ${getCategoryColor(link.category)}`}>
                        {link.category}
                      </Badge>
                    </div>
                  </div>
                  {link.isPopular && (
                    <Badge variant="secondary" className="text-xs">
                      Popular
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base font-semibold text-gray-800">
                  {link.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 line-clamp-2">
                  {link.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Play className="h-3 w-3" />
                    <span>{link.readTime}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={link.action}>
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Troubleshooting */}
      <div>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Common Issues</h2>
          <p className="text-gray-600">Quick fixes for the most common problems</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {troubleshootingLinks.map((link, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={link.action}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <link.icon className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{link.title}</h3>
                    <p className="text-xs text-gray-600">{link.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};