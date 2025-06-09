
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOnboardingContext } from './OnboardingProvider';
import { UserSetupData } from '@/hooks/useOnboarding';
import { Package, Phone, MapPin, Truck, Zap } from 'lucide-react';

const availableCouriers = [
  'DHL Express',
  'FedEx',
  'UPS',
  'Aramex',
  'Local Courier',
  'PostNet',
];

export const StepOneModal: React.FC = () => {
  const { completeSetup, skipOnboarding } = useOnboardingContext();
  
  const [formData, setFormData] = useState<UserSetupData>({
    businessName: '',
    contactPhone: '',
    pickupAddress: '',
    preferredCourier: '',
    sameDayDelivery: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    completeSetup(formData);
    setIsLoading(false);
  };

  const isFormValid = formData.businessName && formData.contactPhone && formData.pickupAddress && formData.preferredCourier;

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-blue-600" />
          </div>
          <DialogTitle className="text-2xl font-bold">Let's get your workspace ready</DialogTitle>
          <p className="text-gray-600">Set up your business details to start shipping efficiently with TREDO</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessName" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Business Name
              </Label>
              <Input
                id="businessName"
                placeholder="Enter your business name"
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contact Phone
              </Label>
              <Input
                id="contactPhone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickupAddress" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Default Pickup Address
            </Label>
            <Textarea
              id="pickupAddress"
              placeholder="Enter your business address for pickups"
              rows={3}
              value={formData.pickupAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, pickupAddress: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Preferred Courier
            </Label>
            <Select
              value={formData.preferredCourier}
              onValueChange={(value) => setFormData(prev => ({ ...prev, preferredCourier: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your preferred courier service" />
              </SelectTrigger>
              <SelectContent>
                {availableCouriers.map((courier) => (
                  <SelectItem key={courier} value={courier}>
                    {courier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-orange-500" />
              <div>
                <Label htmlFor="sameDayDelivery" className="font-medium">Same-Day Delivery</Label>
                <p className="text-sm text-gray-600">Enable expedited delivery options for urgent shipments</p>
              </div>
            </div>
            <Switch
              id="sameDayDelivery"
              checked={formData.sameDayDelivery}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sameDayDelivery: checked }))}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={skipOnboarding}
              className="flex-1"
            >
              Skip Setup
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : 'Save & Continue'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
