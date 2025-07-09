
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Truck, 
  Package, 
  DollarSign,
  User,
  Crown,
  RotateCcw,
  UserPlus,
  Activity,
  Warehouse
} from 'lucide-react';
import { Customer } from '@/types';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  customer
}) => {
  if (!customer) return null;

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'Returning Customer': return 'bg-blue-100 text-blue-800';
      case 'New': return 'bg-green-100 text-green-800';
      case 'Low Activity': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCustomerTypeIcon = (type: string) => {
    switch (type) {
      case 'VIP': return <Crown size={16} />;
      case 'Returning Customer': return <RotateCcw size={16} />;
      case 'New': return <UserPlus size={16} />;
      case 'Low Activity': return <Activity size={16} />;
      default: return <User size={16} />;
    }
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{customer.name}</h3>
              <p className="text-sm text-gray-500">Customer ID: {customer.id}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Type and Status */}
          <div className="flex items-center gap-4">
            <Badge className={`${getCustomerTypeColor(customer.customerType)} flex items-center gap-2`}>
              {getCustomerTypeIcon(customer.customerType)}
              {customer.customerType}
            </Badge>
            <Badge 
              variant="outline" 
              className={customer.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}
            >
              {customer.status}
            </Badge>
            <div className={`text-sm font-medium ${getQualityScoreColor(customer.qualityScore)}`}>
              Quality Score: {customer.qualityScore}%
            </div>
          </div>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{customer.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Warehouse size={16} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Warehouse</p>
                    <p className="font-medium">{customer.warehouse}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{customer.ordersCount}</div>
                  <div className="text-sm text-gray-500">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${customer.totalOrderValue.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Total Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{customer.qualityScore}%</div>
                  <div className="text-sm text-gray-500">Quality Score</div>
                  <Progress 
                    value={customer.qualityScore} 
                    className="w-full mt-2 h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Preferences & Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Preferred Courier</p>
                  <p className="font-medium">{customer.courierPreference}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Order Date</p>
                  <p className="font-medium">{new Date(customer.lastOrderDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Governorate</p>
                  <p className="font-medium">{customer.governorate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Frequent Cities</p>
                  <p className="font-medium">{customer.frequentCities.join(', ')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customer.orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          order.status === 'Delivered' ? 'bg-green-50 text-green-700' :
                          order.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                          order.status === 'In Transit' ? 'bg-blue-50 text-blue-700' :
                          'bg-yellow-50 text-yellow-700'
                        }
                      >
                        {order.status}
                      </Badge>
                      <span className="text-sm text-gray-600">{order.courier}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Edit Customer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
