
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin } from 'lucide-react';

interface Warehouse {
  id: string;
  name: string;
  manager: string;
  address: string;
  type: 'Main' | 'Virtual';
  isPrimary: boolean;
  region: string;
}

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (warehouse: Omit<Warehouse, 'id'>) => void;
  warehouse?: Warehouse | null;
}

export const WarehouseModal: React.FC<WarehouseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  warehouse
}) => {
  const [formData, setFormData] = useState({
    name: '',
    manager: '',
    address: '',
    type: 'Main' as 'Main' | 'Virtual',
    isPrimary: false,
    region: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name,
        manager: warehouse.manager,
        address: warehouse.address,
        type: warehouse.type,
        isPrimary: warehouse.isPrimary,
        region: warehouse.region
      });
    } else {
      setFormData({
        name: '',
        manager: '',
        address: '',
        type: 'Main',
        isPrimary: false,
        region: ''
      });
    }
    setErrors({});
  }, [warehouse, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Warehouse name is required';
    }
    if (!formData.manager.trim()) {
      newErrors.manager = 'Manager name is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.region.trim()) {
      newErrors.region = 'Region is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value as 'Main' | 'Virtual'
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            {warehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
          </DialogTitle>
          <DialogDescription>
            {warehouse 
              ? 'Update the warehouse information below.' 
              : 'Fill in the details to create a new warehouse.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Warehouse Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange('name')}
                placeholder="e.g., Main Distribution Center"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="manager">Responsible Manager *</Label>
              <Input
                id="manager"
                value={formData.manager}
                onChange={handleInputChange('manager')}
                placeholder="e.g., John Smith"
                className={errors.manager ? 'border-red-500' : ''}
              />
              {errors.manager && <p className="text-red-500 text-sm">{errors.manager}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Full Address *</Label>
            <textarea
              id="address"
              value={formData.address}
              onChange={handleInputChange('address')}
              placeholder="Enter complete address with street, city, state, and ZIP code"
              className={`w-full px-3 py-2 border rounded-md resize-none ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              rows={3}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Region *</Label>
            <Input
              id="region"
              value={formData.region}
              onChange={handleInputChange('region')}
              placeholder="e.g., West Coast, East Coast, Midwest"
              className={errors.region ? 'border-red-500' : ''}
            />
            {errors.region && <p className="text-red-500 text-sm">{errors.region}</p>}
          </div>

          <div className="space-y-3">
            <Label>Warehouse Type *</Label>
            <RadioGroup value={formData.type} onValueChange={handleTypeChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Main" id="main" />
                <Label htmlFor="main" className="cursor-pointer">
                  Main Warehouse - Physical storage facility
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Virtual" id="virtual" />
                <Label htmlFor="virtual" className="cursor-pointer">
                  Virtual Warehouse - Dropshipping or external fulfillment
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Location Preview
            </Label>
            <div className="bg-white border rounded-md p-4 h-32 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Google Maps integration would go here</p>
                <p className="text-xs text-gray-400">Enter address above to see location</p>
              </div>
            </div>
          </div>
        </form>

        <DialogFooter className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {warehouse ? 'Update Warehouse' : 'Save Warehouse'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
