import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Customer } from '@/types';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, 'id' | 'orders'>) => void;
  customer?: Customer | null;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  customer
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    governorate: '',
    warehouse: '',
    courierPreference: '',
    customerType: 'New' as Customer['customerType'],
    status: 'Active' as Customer['status'],
    ordersCount: 0,
    qualityScore: 100,
    totalOrderValue: 0,
    lastOrderDate: new Date().toISOString().split('T')[0],
    frequentCities: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        governorate: customer.governorate,
        warehouse: customer.warehouse,
        courierPreference: customer.courierPreference,
        customerType: customer.customerType,
        status: customer.status,
        ordersCount: customer.ordersCount,
        qualityScore: customer.qualityScore,
        totalOrderValue: customer.totalOrderValue,
        lastOrderDate: customer.lastOrderDate,
        frequentCities: customer.frequentCities
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        governorate: '',
        warehouse: '',
        courierPreference: '',
        customerType: 'New',
        status: 'Active',
        ordersCount: 0,
        qualityScore: 100,
        totalOrderValue: 0,
        lastOrderDate: new Date().toISOString().split('T')[0],
        frequentCities: []
      });
    }
    setErrors({});
  }, [customer, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.governorate.trim()) {
      newErrors.governorate = 'Governorate is required';
    }

    if (!formData.warehouse.trim()) {
      newErrors.warehouse = 'Warehouse is required';
    }

    if (!formData.courierPreference.trim()) {
      newErrors.courierPreference = 'Courier preference is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {customer ? 'Edit Customer' : 'Add New Customer'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter city"
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>

            {/* Governorate */}
            <div className="space-y-2">
              <Label htmlFor="governorate">Governorate *</Label>
              <Select value={formData.governorate} onValueChange={(value) => handleInputChange('governorate', value)}>
                <SelectTrigger className={errors.governorate ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select governorate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cairo">Cairo</SelectItem>
                  <SelectItem value="Alexandria">Alexandria</SelectItem>
                  <SelectItem value="Giza">Giza</SelectItem>
                  <SelectItem value="Luxor">Luxor</SelectItem>
                  <SelectItem value="Aswan">Aswan</SelectItem>
                  <SelectItem value="Port Said">Port Said</SelectItem>
                  <SelectItem value="Suez">Suez</SelectItem>
                  <SelectItem value="Ismailia">Ismailia</SelectItem>
                  <SelectItem value="Mansoura">Mansoura</SelectItem>
                  <SelectItem value="Tanta">Tanta</SelectItem>
                </SelectContent>
              </Select>
              {errors.governorate && <p className="text-red-500 text-sm">{errors.governorate}</p>}
            </div>

            {/* Warehouse */}
            <div className="space-y-2">
              <Label htmlFor="warehouse">Warehouse *</Label>
              <Select value={formData.warehouse} onValueChange={(value) => handleInputChange('warehouse', value)}>
                <SelectTrigger className={errors.warehouse ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cairo Main">Cairo Main</SelectItem>
                  <SelectItem value="Alexandria Hub">Alexandria Hub</SelectItem>
                  <SelectItem value="Giza Center">Giza Center</SelectItem>
                  <SelectItem value="Mansoura Branch">Mansoura Branch</SelectItem>
                  <SelectItem value="Luxor Station">Luxor Station</SelectItem>
                </SelectContent>
              </Select>
              {errors.warehouse && <p className="text-red-500 text-sm">{errors.warehouse}</p>}
            </div>

            {/* Courier Preference */}
            <div className="space-y-2">
              <Label htmlFor="courierPreference">Courier Preference *</Label>
              <Select value={formData.courierPreference} onValueChange={(value) => handleInputChange('courierPreference', value)}>
                <SelectTrigger className={errors.courierPreference ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select courier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aramex">Aramex</SelectItem>
                  <SelectItem value="Bosta">Bosta</SelectItem>
                  <SelectItem value="Mylerz">Mylerz</SelectItem>
                  <SelectItem value="DHL">DHL</SelectItem>
                  <SelectItem value="FedEx">FedEx</SelectItem>
                </SelectContent>
              </Select>
              {errors.courierPreference && <p className="text-red-500 text-sm">{errors.courierPreference}</p>}
            </div>

            {/* Customer Type */}
            <div className="space-y-2">
              <Label htmlFor="customerType">Customer Type</Label>
              <Select value={formData.customerType} onValueChange={(value: Customer['customerType']) => handleInputChange('customerType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Returning Customer">Returning Customer</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Low Activity">Low Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: Customer['status']) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter full address"
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {customer ? 'Update Customer' : 'Add Customer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
