
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Courier } from '@/types';

interface CourierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courier: Omit<Courier, 'id' | 'totalShipments' | 'avgDeliveryTime' | 'successRate' | 'avgShippingCost'>) => void;
}

const serviceOptions = [
  'COD',
  'Reverse Pickup',
  'Express',
  'Same Day',
  'Economy',
  'International',
  'Standard'
];

const countries = [
  'Egypt',
  'UAE',
  'Saudi Arabia',
  'Kuwait',
  'Jordan',
  'Lebanon',
  'Morocco',
  'Tunisia',
  'Malaysia',
  'Singapore'
];

export const CourierModal: React.FC<CourierModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    status: 'Active' as 'Active' | 'Inactive',
    isPreferred: false,
    supportedServices: [] as string[],
    returnPolicies: '',
    connectedApis: [] as string[],
    apiKey: '',
    webhookUrl: '',
    serviceRegions: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Courier name is required';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    if (!formData.apiKey.trim()) {
      newErrors.apiKey = 'API Key is required';
    }

    if (!formData.webhookUrl.trim()) {
      newErrors.webhookUrl = 'Webhook URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.webhookUrl)) {
      newErrors.webhookUrl = 'Please enter a valid URL';
    }

    if (formData.supportedServices.length === 0) {
      newErrors.supportedServices = 'Please select at least one service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const courierData = {
        name: formData.name,
        country: formData.country,
        status: formData.status,
        isPreferred: formData.isPreferred,
        supportedServices: formData.supportedServices,
        returnPolicies: formData.returnPolicies || 'Standard return policy',
        connectedApis: ['REST API'], // Default to REST API when connecting
        rating: 0
      };
      onSave(courierData);
      
      // Reset form
      setFormData({
        name: '',
        country: '',
        status: 'Active',
        isPreferred: false,
        supportedServices: [],
        returnPolicies: '',
        connectedApis: [],
        apiKey: '',
        webhookUrl: '',
        serviceRegions: ''
      });
      setErrors({});
    }
  };

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    const newServices = checked 
      ? [...formData.supportedServices, service]
      : formData.supportedServices.filter(s => s !== service);
    
    handleInputChange('supportedServices', newServices);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Connect New Courier</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Courier Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
                placeholder="Enter courier name"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="country">Country *</Label>
              <Select 
                value={formData.country} 
                onValueChange={(value) => handleInputChange('country', value)}
              >
                <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-sm text-red-500 mt-1">{errors.country}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="apiKey">API Key *</Label>
              <Input
                id="apiKey"
                type="password"
                value={formData.apiKey}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                className={errors.apiKey ? 'border-red-500' : ''}
                placeholder="Enter API key"
              />
              {errors.apiKey && (
                <p className="text-sm text-red-500 mt-1">{errors.apiKey}</p>
              )}
            </div>

            <div>
              <Label htmlFor="webhookUrl">Webhook URL *</Label>
              <Input
                id="webhookUrl"
                value={formData.webhookUrl}
                onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                className={errors.webhookUrl ? 'border-red-500' : ''}
                placeholder="https://api.courier.com/webhook"
              />
              {errors.webhookUrl && (
                <p className="text-sm text-red-500 mt-1">{errors.webhookUrl}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="serviceRegions">Service Regions</Label>
            <Input
              id="serviceRegions"
              value={formData.serviceRegions}
              onChange={(e) => handleInputChange('serviceRegions', e.target.value)}
              placeholder="e.g., Cairo, Alexandria, Giza"
            />
          </div>

          <div>
            <Label>Supported Services *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {serviceOptions.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={service}
                    checked={formData.supportedServices.includes(service)}
                    onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                  />
                  <Label htmlFor={service} className="text-sm">{service}</Label>
                </div>
              ))}
            </div>
            {errors.supportedServices && (
              <p className="text-sm text-red-500 mt-1">{errors.supportedServices}</p>
            )}
          </div>

          <div>
            <Label htmlFor="returnPolicies">Return Policies</Label>
            <Textarea
              id="returnPolicies"
              value={formData.returnPolicies}
              onChange={(e) => handleInputChange('returnPolicies', e.target.value)}
              placeholder="Describe return policies and procedures"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'Active' | 'Inactive') => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="isPreferred"
                checked={formData.isPreferred}
                onCheckedChange={(checked) => handleInputChange('isPreferred', checked as boolean)}
              />
              <Label htmlFor="isPreferred">Mark as preferred courier</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Connect Courier
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
