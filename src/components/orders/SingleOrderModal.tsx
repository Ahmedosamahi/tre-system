
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Box, MapPin, Send, User } from 'lucide-react';

interface SingleOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SingleOrderModal = ({ isOpen, onClose }: SingleOrderModalProps) => {
  const [step, setStep] = useState<'details' | 'shipping'>('details');
  
  // Dummy shipping companies data
  const shippingCompanies = [
    { id: 1, name: 'Express Logistics', logo: '/lovable-uploads/9a486a82-ce61-4beb-8017-e0d55573ba2f.png', price: '$10.99', rating: 4.8 },
    { id: 2, name: 'Swift Couriers', logo: '/lovable-uploads/9a486a82-ce61-4beb-8017-e0d55573ba2f.png', price: '$8.99', rating: 4.5 },
    { id: 3, name: 'Global Shipment', logo: '/lovable-uploads/9a486a82-ce61-4beb-8017-e0d55573ba2f.png', price: '$12.99', rating: 4.9 },
  ];
  
  const goToShippingStep = () => {
    setStep('shipping');
  };
  
  const handleSubmit = () => {
    // Handle form submission
    console.log('Order submitted');
    onClose();
    setStep('details'); // Reset step for next time
  };
  
  const resetAndClose = () => {
    onClose();
    setStep('details'); // Reset step for next time
  };
  
  const renderDetailsStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">New Single Order</DialogTitle>
      </DialogHeader>
      <div className="mt-4 max-h-[70vh] overflow-y-auto pr-2">
        <Accordion type="single" collapsible defaultValue="sender" className="w-full">
          <AccordionItem value="sender">
            <AccordionTrigger className="flex items-center gap-2">
              <Send className="h-4 w-4" /> Sender Information
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Sender Name</label>
                  <Input placeholder="Enter sender name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Sender Phone</label>
                  <Input placeholder="Enter phone number" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Sender Phone 2</label>
                  <Input placeholder="Enter alternate phone" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Province</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="province1">Province 1</SelectItem>
                      <SelectItem value="province2">Province 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">City</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="city1">City 1</SelectItem>
                      <SelectItem value="city2">City 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Area</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="area1">Area 1</SelectItem>
                      <SelectItem value="area2">Area 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Shipping Address</label>
                  <Textarea placeholder="Enter complete shipping address" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="receiver">
            <AccordionTrigger className="flex items-center gap-2">
              <User className="h-4 w-4" /> Receiver Information
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Receiver Name</label>
                  <Input placeholder="Enter receiver name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Receiver Phone</label>
                  <Input placeholder="Enter phone number" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Receiver Phone 2</label>
                  <Input placeholder="Enter alternate phone" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Province</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="province1">Province 1</SelectItem>
                      <SelectItem value="province2">Province 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">City</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="city1">City 1</SelectItem>
                      <SelectItem value="city2">City 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Area</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="area1">Area 1</SelectItem>
                      <SelectItem value="area2">Area 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Shipping Address</label>
                  <Textarea placeholder="Enter complete shipping address" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="shipment">
            <AccordionTrigger className="flex items-center gap-2">
              <Box className="h-4 w-4" /> Shipment Details
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Reference Number</label>
                  <Input placeholder="Enter reference number" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Insurance Fees</label>
                  <Input type="number" placeholder="Enter insurance amount" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Goods Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select goods type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                      <SelectItem value="jewelry">Jewelry & Accessories</SelectItem>
                      <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="books">Books & Stationery</SelectItem>
                      <SelectItem value="home">Home Accessories</SelectItem>
                      <SelectItem value="crafts">Handmade Crafts</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Goods Name</label>
                  <Input placeholder="Enter goods name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Quantity</label>
                  <Input type="number" placeholder="Enter quantity" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Weight (kg)</label>
                  <Input type="number" placeholder="Enter weight" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Service Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="return">Delivery Return</SelectItem>
                      <SelectItem value="exchange">Exchange</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">COD Amount</label>
                  <Input type="number" placeholder="Enter COD amount" />
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox id="allow-open" />
                  <label htmlFor="allow-open" className="text-sm font-medium leading-none cursor-pointer">
                    Allow to open package
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Customer's Information</label>
                  <Input placeholder="Enter customer information" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Notes (Optional)</label>
                  <Textarea placeholder="Enter any additional notes" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={resetAndClose}>
          Cancel
        </Button>
        <Button onClick={goToShippingStep} className="bg-brand text-white">
          Choose Shipping Company <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  );
  
  const renderShippingStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Choose Shipping Company</DialogTitle>
      </DialogHeader>
      <div className="mt-4 max-h-[70vh] overflow-y-auto">
        <div className="space-y-4">
          {shippingCompanies.map((company) => (
            <div key={company.id} className="flex items-center border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="w-12 h-12 mr-4 flex-shrink-0">
                <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg">{company.name}</h3>
                <div className="flex items-center mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(company.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-600">{company.rating}/5</span>
                  </div>
                  <span className="mx-3 text-gray-300">|</span>
                  <span className="text-sm font-semibold text-brand">{company.price}</span>
                </div>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  name="shippingCompany" 
                  value={company.id} 
                  className="w-5 h-5 text-brand focus:ring-brand border-gray-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-between gap-3">
        <Button variant="outline" onClick={() => setStep('details')}>
          Back to Details
        </Button>
        <div className="space-x-3">
          <Button variant="outline" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-brand text-white">
            Save Order
          </Button>
        </div>
      </div>
    </>
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-2xl w-full">
        {step === 'details' ? renderDetailsStep() : renderShippingStep()}
      </DialogContent>
    </Dialog>
  );
};
