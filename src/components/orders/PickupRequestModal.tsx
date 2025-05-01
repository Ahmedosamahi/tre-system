import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarIcon, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface PickupRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PickupRequestModal = ({ isOpen, onClose }: PickupRequestModalProps) => {
  // Log outside of JSX to avoid TypeScript errors
  console.log("PickupRequestModal rendering with isOpen:", isOpen);
  
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  
  // Updated shipping companies data with new uploaded images
  const shippingCompanies = [
    { id: '1', name: 'Aramex', logo: '/lovable-uploads/9a486a82-ce61-4beb-8017-e0d55573ba2f.png', pendingShipments: 12 },
    { id: '2', name: 'FedEx', logo: '/lovable-uploads/d596548d-f4b9-4003-a6a9-e24cd0ab7e3c.png', pendingShipments: 5 },
    { id: '3', name: 'Bosta', logo: '/lovable-uploads/9a486a82-ce61-4beb-8017-e0d55573ba2f.png', pendingShipments: 0 },
    { id: '4', name: 'ShipBlu', logo: '/lovable-uploads/d596548d-f4b9-4003-a6a9-e24cd0ab7e3c.png', pendingShipments: 7 },
  ];
  
  const weekdays = [
    { id: 'sun', label: 'Sunday' },
    { id: 'mon', label: 'Monday' },
    { id: 'tue', label: 'Tuesday' },
    { id: 'wed', label: 'Wednesday' },
    { id: 'thu', label: 'Thursday' },
    { id: 'fri', label: 'Friday' },
    { id: 'sat', label: 'Saturday' },
  ];
  
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  
  const handleDayToggle = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId)
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    );
  };
  
  const handleSubmit = () => {
    if (!selectedCompany) {
      toast({
        title: "Selection Required",
        description: "Please select a shipping company to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (!date) {
      toast({
        title: "Date Required",
        description: "Please select a pickup date.",
        variant: "destructive",
      });
      return;
    }
    
    if (!time) {
      toast({
        title: "Time Required",
        description: "Please select a pickup time.",
        variant: "destructive",
      });
      return;
    }
    
    if (isRecurring && selectedDays.length === 0) {
      toast({
        title: "Days Required",
        description: "Please select at least one day for recurring pickup.",
        variant: "destructive",
      });
      return;
    }
    
    console.log({
      selectedCompany,
      date,
      time,
      isRecurring,
      selectedDays: isRecurring ? selectedDays : [],
    });
    
    // Create a new pickup order
    const selectedCompanyData = shippingCompanies.find(company => company.id === selectedCompany);
    
    if (selectedCompanyData && selectedCompanyData.pendingShipments > 0) {
      // Create orders for pickup
      for (let i = 0; i < Math.min(selectedCompanyData.pendingShipments, 3); i++) {
        const newOrder = {
          id: `pickup-${Date.now()}-${i}`,
          reference: `PICKUP-${Date.now().toString().slice(-6)}-${i}`,
          customer: `Pickup Customer ${i+1}`,
          destination: 'To be picked up',
          date: date.toISOString().split('T')[0],
          status: 'pending' as const,
          shippingCompany: selectedCompanyData.name,
        };
        
        // Dispatch custom event to add the order to the list
        const event = new CustomEvent('newOrder', { detail: newOrder });
        window.dispatchEvent(event);
      }
    }
    
    toast({
      title: "Pickup Request Submitted",
      description: isRecurring 
        ? "Your recurring pickup has been scheduled." 
        : "Your pickup request has been submitted.",
    });
    
    onClose();
    
    // Reset form state
    setDate(undefined);
    setTime('');
    setIsRecurring(false);
    setSelectedCompany(null);
    setSelectedDays([]);
  };
  
  const handleSaveRecurringSettings = () => {
    if (selectedDays.length === 0) {
      toast({
        title: "Days Required",
        description: "Please select at least one day for recurring pickup.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Settings Saved",
      description: "Your recurring pickup settings have been saved.",
    });
  };
  
  // Log outside of JSX to avoid TypeScript errors
  console.log("Rendering PickupRequestModal content");
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-2xl w-full z-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Schedule Pickup Request</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Select Shipping Company</h3>
              <div className="space-y-3">
                {shippingCompanies.map((company) => (
                  <div 
                    key={company.id} 
                    onClick={() => setSelectedCompany(company.id)}
                    className={cn(
                      "flex items-center border rounded-lg p-4 hover:bg-gray-50 cursor-pointer",
                      selectedCompany === company.id ? "border-brand bg-brand/5" : "border-gray-200"
                    )}
                  >
                    <div className="w-12 h-12 mr-4 flex-shrink-0">
                      <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{company.name}</h3>
                      {company.pendingShipments > 0 ? (
                        <span className="inline-flex items-center px-2 py-1 mt-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Pending Shipments: {company.pendingShipments}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 mt-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          No pending shipments
                        </span>
                      )}
                    </div>
                    <div className="ml-auto">
                      <input 
                        type="radio" 
                        name="shippingCompanyPickup" 
                        checked={selectedCompany === company.id}
                        onChange={() => setSelectedCompany(company.id)}
                        className="w-5 h-5 text-brand focus:ring-brand border-gray-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Pickup Date</h3>
                <div className="flex flex-col space-y-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                        disabled={(date) => date < new Date()} // Disable past dates
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Pickup Time</h3>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9:00 AM - 12:00 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12:00 PM - 3:00 PM)</SelectItem>
                    <SelectItem value="evening">Evening (3:00 PM - 6:00 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="recurring" 
                  checked={isRecurring} 
                  onCheckedChange={() => setIsRecurring(!isRecurring)} 
                />
                <label 
                  htmlFor="recurring" 
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Schedule Recurring Pickup
                </label>
              </div>
              
              {isRecurring && (
                <div className="mt-4 pl-6 border-l-2 border-gray-200">
                  <h4 className="text-sm font-medium mb-3">Select Days of Week</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {weekdays.map((day) => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`day-${day.id}`} 
                          checked={selectedDays.includes(day.id)}
                          onCheckedChange={() => handleDayToggle(day.id)}
                        />
                        <label 
                          htmlFor={`day-${day.id}`} 
                          className="text-sm leading-none cursor-pointer"
                        >
                          {day.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={handleSaveRecurringSettings}
                    >
                      Save Recurring Settings
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            className="bg-brand text-white" 
            onClick={handleSubmit}
            disabled={!selectedCompany || !date || !time || (isRecurring && selectedDays.length === 0)}
          >
            <Truck className="mr-2 h-4 w-4" />
            Submit Pickup Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
