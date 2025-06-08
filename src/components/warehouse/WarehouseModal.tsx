
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, X } from 'lucide-react';

interface Warehouse {
  id: string;
  name: string;
  manager: string;
  address: string;
  type: 'Main' | 'Virtual';
  isPrimary: boolean;
}

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (warehouse: Omit<Warehouse, 'id'>) => void;
  warehouse?: Warehouse;
  mode: 'add' | 'edit';
}

export const WarehouseModal: React.FC<WarehouseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  warehouse,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    manager: '',
    address: '',
    type: 'Main' as 'Main' | 'Virtual',
    isPrimary: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (warehouse && mode === 'edit') {
      setFormData({
        name: warehouse.name,
        manager: warehouse.manager,
        address: warehouse.address,
        type: warehouse.type,
        isPrimary: warehouse.isPrimary
      });
    } else {
      setFormData({
        name: '',
        manager: '',
        address: '',
        type: 'Main',
        isPrimary: false
      });
    }
    setErrors({});
  }, [warehouse, mode, isOpen]);

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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSave(formData);
    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            {mode === 'add' ? 'Add New Warehouse' : 'Edit Warehouse'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                Warehouse Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter warehouse name"
                className={`${errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'} transition-colors duration-150`}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manager" className="text-sm font-semibold text-gray-700">
                Responsible Manager *
              </Label>
              <Input
                id="manager"
                value={formData.manager}
                onChange={(e) => handleInputChange('manager', e.target.value)}
                placeholder="Enter manager name"
                className={`${errors.manager ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'} transition-colors duration-150`}
              />
              {errors.manager && <p className="text-sm text-red-600">{errors.manager}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
              Full Address *
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter complete address"
              rows={3}
              className={`${errors.address ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'} transition-colors duration-150`}
            />
            {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Google Map Location</Label>
            <div className="h-56 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-200 flex items-center justify-center hover:border-blue-300 transition-colors duration-200">
              <div className="text-center text-blue-600">
                <MapPin className="mx-auto h-10 w-10 mb-3" />
                <p className="font-medium">Map Integration</p>
                <p className="text-sm text-blue-500 mt-1">Click to set location on map</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Warehouse Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
              className="flex gap-8"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="Main" id="main" className="border-blue-300 text-blue-600" />
                <Label htmlFor="main" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Main Warehouse
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="Virtual" id="virtual" className="border-blue-300 text-blue-600" />
                <Label htmlFor="virtual" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Virtual Warehouse
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <input
              type="checkbox"
              id="isPrimary"
              checked={formData.isPrimary}
              onChange={(e) => handleInputChange('isPrimary', e.target.checked)}
              className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-yellow-300 rounded"
            />
            <Label htmlFor="isPrimary" className="text-sm font-medium text-yellow-800 cursor-pointer">
              Set as Primary Warehouse
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-150 hover:scale-105"
            >
              {mode === 'add' ? 'Add Warehouse' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
