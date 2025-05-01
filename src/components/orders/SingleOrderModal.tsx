
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
import { toast } from '@/hooks/use-toast';

interface SingleOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SingleOrderModal = ({ isOpen, onClose }: SingleOrderModalProps) => {
  const [step, setStep] = useState<'details' | 'shipping'>('details');
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  
  // Form state (in a real app, you would use a form library like react-hook-form)
  const [formData, setFormData] = useState({
    sender: {
      name: '',
      phone: '',
      phone2: '',
      province: '',
      city: '',
      area: '',
      address: ''
    },
    receiver: {
      name: '',
      phone: '',
      phone2: '',
      province: '',
      city: '',
      area: '',
      address: ''
    },
    shipment: {
      reference: '',
      insurance: '',
      goodsType: '',
      goodsName: '',
      quantity: '',
      weight: '',
      allowOpen: false,
      serviceType: '',
      customerInfo: '',
      notes: '',
      cod: ''
    }
  });
  
  // Dummy data - in a real implementation these would come from API calls
  const provinces = ['Cairo', 'Alexandria', 'Giza', 'Sharm El Sheikh'];
  const cities = ['Downtown', 'East District', 'West District', 'North District'];
  const areas = ['Area 1', 'Area 2', 'Area 3', 'Area 4'];
  
  // Dummy shipping companies data
  const shippingCompanies = [
    { id: 1, name: 'Express Logistics', logo: '/lovable-uploads/9a486a82-ce61-4beb-8017-e0d55573ba2f.png', price: '$10.99', rating: 4.8 },
    { id: 2, name: 'Swift Couriers', logo: '/lovable-uploads/9a486a82-ce61-4beb-8017-e0d55573ba2f.png', price: '$8.99', rating: 4.5 },
    { id: 3, name: 'Global Shipment', logo: '/lovable-uploads/9a486a82-ce61-4beb-8017-e0d55573ba2f.png', price: '$12.99', rating: 4.9 },
  ];
  
  const handleInputChange = (section: 'sender' | 'receiver' | 'shipment', field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  
  const goToShippingStep = () => {
    // In a real app, you would validate the form here
    const isValid = validateForm();
    if (!isValid) {
      toast({
        title: "Form Validation",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }
    setStep('shipping');
  };
  
  const validateForm = () => {
    // Simple validation - check if required fields are filled
    const requiredSenderFields = ['name', 'phone', 'province', 'city', 'address'];
    const requiredReceiverFields = ['name', 'phone', 'province', 'city', 'address'];
    const requiredShipmentFields = ['goodsType', 'goodsName', 'quantity', 'weight', 'serviceType'];
    
    const isSenderValid = requiredSenderFields.every(field => formData.sender[field as keyof typeof formData.sender]);
    const isReceiverValid = requiredReceiverFields.every(field => formData.receiver[field as keyof typeof formData.receiver]);
    const isShipmentValid = requiredShipmentFields.every(field => formData.shipment[field as keyof typeof formData.shipment]);
    
    return isSenderValid && isReceiverValid && isShipmentValid;
  };
  
  const handleSubmit = () => {
    if (selectedCompany === null) {
      toast({
        title: "Selection Required",
        description: "Please select a shipping company to continue.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would submit the order with the selected shipping company
    console.log('Order submitted with shipping company:', selectedCompany);
    console.log('Form data:', formData);
    
    toast({
      title: "Order Created",
      description: "Your order has been created successfully.",
    });
    
    resetAndClose();
  };
  
  const resetAndClose = () => {
    // Reset all state
    setStep('details');
    setSelectedCompany(null);
    setFormData({
      sender: {
        name: '',
        phone: '',
        phone2: '',
        province: '',
        city: '',
        area: '',
        address: ''
      },
      receiver: {
        name: '',
        phone: '',
        phone2: '',
        province: '',
        city: '',
        area: '',
        address: ''
      },
      shipment: {
        reference: '',
        insurance: '',
        goodsType: '',
        goodsName: '',
        quantity: '',
        weight: '',
        allowOpen: false,
        serviceType: '',
        customerInfo: '',
        notes: '',
        cod: ''
      }
    });
    onClose();
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
                  <label className="text-sm font-medium mb-1 block">Sender Name*</label>
                  <Input 
                    placeholder="Enter sender name" 
                    value={formData.sender.name}
                    onChange={(e) => handleInputChange('sender', 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Sender Phone*</label>
                  <Input 
                    placeholder="Enter phone number"
                    value={formData.sender.phone}
                    onChange={(e) => handleInputChange('sender', 'phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Sender Phone 2</label>
                  <Input 
                    placeholder="Enter alternate phone"
                    value={formData.sender.phone2}
                    onChange={(e) => handleInputChange('sender', 'phone2', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Province*</label>
                  <Select 
                    value={formData.sender.province}
                    onValueChange={(value) => handleInputChange('sender', 'province', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map(province => (
                        <SelectItem key={province} value={province}>{province}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">City*</label>
                  <Select
                    value={formData.sender.city}
                    onValueChange={(value) => handleInputChange('sender', 'city', value)}
                    disabled={!formData.sender.province}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Area</label>
                  <Select
                    value={formData.sender.area}
                    onValueChange={(value) => handleInputChange('sender', 'area', value)}
                    disabled={!formData.sender.city}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map(area => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Shipping Address*</label>
                  <Textarea 
                    placeholder="Enter complete shipping address"
                    value={formData.sender.address}
                    onChange={(e) => handleInputChange('sender', 'address', e.target.value)}
                  />
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
                  <label className="text-sm font-medium mb-1 block">Receiver Name*</label>
                  <Input 
                    placeholder="Enter receiver name"
                    value={formData.receiver.name}
                    onChange={(e) => handleInputChange('receiver', 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Receiver Phone*</label>
                  <Input 
                    placeholder="Enter phone number"
                    value={formData.receiver.phone}
                    onChange={(e) => handleInputChange('receiver', 'phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Receiver Phone 2</label>
                  <Input 
                    placeholder="Enter alternate phone"
                    value={formData.receiver.phone2}
                    onChange={(e) => handleInputChange('receiver', 'phone2', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Province*</label>
                  <Select
                    value={formData.receiver.province}
                    onValueChange={(value) => handleInputChange('receiver', 'province', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map(province => (
                        <SelectItem key={province} value={province}>{province}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">City*</label>
                  <Select
                    value={formData.receiver.city}
                    onValueChange={(value) => handleInputChange('receiver', 'city', value)}
                    disabled={!formData.receiver.province}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Area</label>
                  <Select
                    value={formData.receiver.area}
                    onValueChange={(value) => handleInputChange('receiver', 'area', value)}
                    disabled={!formData.receiver.city}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map(area => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Shipping Address*</label>
                  <Textarea 
                    placeholder="Enter complete shipping address"
                    value={formData.receiver.address}
                    onChange={(e) => handleInputChange('receiver', 'address', e.target.value)}
                  />
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
                  <Input 
                    placeholder="Enter reference number"
                    value={formData.shipment.reference}
                    onChange={(e) => handleInputChange('shipment', 'reference', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Insurance Fees</label>
                  <Input 
                    type="number" 
                    placeholder="Enter insurance amount"
                    value={formData.shipment.insurance}
                    onChange={(e) => handleInputChange('shipment', 'insurance', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Goods Type*</label>
                  <Select
                    value={formData.shipment.goodsType}
                    onValueChange={(value) => handleInputChange('shipment', 'goodsType', value)}
                  >
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
                  <label className="text-sm font-medium mb-1 block">Goods Name*</label>
                  <Input 
                    placeholder="Enter goods name"
                    value={formData.shipment.goodsName}
                    onChange={(e) => handleInputChange('shipment', 'goodsName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Quantity*</label>
                  <Input 
                    type="number" 
                    placeholder="Enter quantity"
                    value={formData.shipment.quantity}
                    onChange={(e) => handleInputChange('shipment', 'quantity', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Weight (kg)*</label>
                  <Input 
                    type="number" 
                    placeholder="Enter weight"
                    value={formData.shipment.weight}
                    onChange={(e) => handleInputChange('shipment', 'weight', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Service Type*</label>
                  <Select
                    value={formData.shipment.serviceType}
                    onValueChange={(value) => handleInputChange('shipment', 'serviceType', value)}
                  >
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
                  <Input 
                    type="number" 
                    placeholder="Enter COD amount"
                    value={formData.shipment.cod}
                    onChange={(e) => handleInputChange('shipment', 'cod', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox 
                    id="allow-open" 
                    checked={formData.shipment.allowOpen}
                    onCheckedChange={(checked) => handleInputChange('shipment', 'allowOpen', checked)}
                  />
                  <label htmlFor="allow-open" className="text-sm font-medium leading-none cursor-pointer">
                    Allow to open package
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Customer's Information</label>
                  <Input 
                    placeholder="Enter customer information"
                    value={formData.shipment.customerInfo}
                    onChange={(e) => handleInputChange('shipment', 'customerInfo', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Notes (Optional)</label>
                  <Textarea 
                    placeholder="Enter any additional notes"
                    value={formData.shipment.notes}
                    onChange={(e) => handleInputChange('shipment', 'notes', e.target.value)}
                  />
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
            <div 
              key={company.id} 
              className={`flex items-center border rounded-lg p-4 hover:bg-gray-50 cursor-pointer ${selectedCompany === company.id ? 'border-brand bg-brand/5' : 'border-gray-200'}`}
              onClick={() => setSelectedCompany(company.id)}
            >
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
                  checked={selectedCompany === company.id}
                  onChange={() => setSelectedCompany(company.id)}
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
