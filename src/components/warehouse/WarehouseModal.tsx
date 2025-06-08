
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
import { MapPin } from 'lucide-react';

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
  }, [warehouse, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.manager || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            {mode === 'add' ? 'Add New Warehouse' : 'Edit Warehouse'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Warehouse Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter warehouse name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manager" className="text-sm font-medium">
                Responsible Manager *
              </Label>
              <Input
                id="manager"
                value={formData.manager}
                onChange={(e) => handleInputChange('manager', e.target.value)}
                placeholder="Enter manager name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Full Address *
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter complete address"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Google Map Location</Label>
            <div className="h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">Map integration placeholder</p>
                <p className="text-xs">Click to set location</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Warehouse Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Main" id="main" />
                <Label htmlFor="main" className="text-sm">Main Warehouse</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Virtual" id="virtual" />
                <Label htmlFor="virtual" className="text-sm">Virtual Warehouse</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPrimary"
              checked={formData.isPrimary}
              onChange={(e) => handleInputChange('isPrimary', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <Label htmlFor="isPrimary" className="text-sm">
              Set as Primary Warehouse
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {mode === 'add' ? 'Add Warehouse' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
