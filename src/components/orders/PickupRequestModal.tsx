
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PickupRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PickupRequestModal = ({ isOpen, onClose }: PickupRequestModalProps) => {
  const [date, setDate] = useState<Date>();
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  
  // Dummy shipping companies data
  const shippingCompanies = [
    { id: '1', name: 'Express Logistics', logo: '/lovable-uploads/9a486a82-ce61-4beb-8017-e0d55573ba2f.png', pendingShipments: 12 },
    { id: '2', name: 'Swift Couriers', logo: '/lovable-uploads/9a486a82-ce61-4beb-8017-e0d55573ba2f.png', pendingShipments: 0 },
    { id: '3', name: 'Global Shipment', logo: '/lovable-uploads/9a486a82-ce61-4beb-8017-e0d55573ba2f.png', pendingShipments: 5 },
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
    console.log({
      selectedCompany,
      date,
      isRecurring,
      selectedDays: isRecurring ? selectedDays : [],
    });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full">
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
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Pickup Time</h3>
                <Select>
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
                <div className="mt-4 pl-6">
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
            disabled={!selectedCompany || !date}
          >
            Submit Pickup Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
