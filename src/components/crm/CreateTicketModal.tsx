import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, FileText, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { TicketFormData, OrderData } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { fetchOrderByNumber, fetchOrderByAWB, fetchOrderByReference } from '@/services/orderService';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TicketFormData) => void;
}

const issueTypes = [
  'Incorrect Customer Information',
  'Delivery Delay',
  'Damaged Goods',
  'Lost Shipment',
  'Incorrect Shipment',
  'Customs Issue',
  'Payment Dispute',
  'Label Error',
  'Other'
];

const shippingCompanies = [
  'Aramex',
  'DHL',
  'FedEx',
  'UPS',
  'Egypt Post',
  'Mylerz',
  'Bosta',
  'Vhubs',
  'Other'
];

const issueCategories = [
  'Customer Error',
  'Shipping Error',
  'System Error',
  'Product Issue',
  'Address Issue',
  'Payment Issue',
  'Other'
];

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TicketFormData>({
    orderNumber: '',
    awb: '',
    referenceNumber: '',
    issueType: '',
    shippingCompany: '',
    issueCategory: '',
    description: '',
    priority: 'Medium',
    attachments: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [autoFillSuccess, setAutoFillSuccess] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Reset auto-fill status when manual changes are made
    if (['orderNumber', 'awb', 'referenceNumber'].includes(field)) {
      setAutoFillSuccess(false);
      setOrderData(null);
    }
  };
  
  const performAutoFill = useCallback(async (orderNumber: string, awb: string, referenceNumber: string) => {
    if (!orderNumber && !awb && !referenceNumber) return;
    
    setIsAutoFilling(true);
    setAutoFillSuccess(false);
    
    try {
      let fetchedOrderData: OrderData | null = null;
      
      // Try different fetch methods based on available data
      if (orderNumber) {
        fetchedOrderData = await fetchOrderByNumber(orderNumber);
      } else if (awb) {
        fetchedOrderData = await fetchOrderByAWB(awb);
      } else if (referenceNumber) {
        fetchedOrderData = await fetchOrderByReference(referenceNumber);
      }
      
      if (fetchedOrderData) {
        setOrderData(fetchedOrderData);
        setFormData(prev => ({
          ...prev,
          orderNumber: fetchedOrderData.orderNumber,
          shippingCompany: fetchedOrderData.shippingCompany,
          // Keep user-entered values if they exist
          awb: prev.awb || '',
          referenceNumber: prev.referenceNumber || ''
        }));
        setAutoFillSuccess(true);
        toast({
          title: "Auto-fill successful",
          description: "Order details have been automatically populated",
          variant: "default"
        });
      } else {
        toast({
          title: "Order not found",
          description: "No matching order found for the provided information",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Auto-fill failed",
        description: "Failed to fetch order details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAutoFilling(false);
    }
  }, [toast]);
  
  const handleAutoFillTrigger = () => {
    const { orderNumber, awb, referenceNumber } = formData;
    performAutoFill(orderNumber, awb, referenceNumber);
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });
    
    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...validFiles]
    }));
  };
  
  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || []
    }));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.orderNumber.trim() && !formData.awb.trim()) {
      newErrors.orderNumber = 'Order number or AWB is required';
      newErrors.awb = 'Order number or AWB is required';
    }
    
    if (!formData.issueType) {
      newErrors.issueType = 'Issue type is required';
    }
    
    if (!formData.shippingCompany) {
      newErrors.shippingCompany = 'Shipping company is required';
    }
    
    if (!formData.issueCategory) {
      newErrors.issueCategory = 'Issue category is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setFormData({
      orderNumber: '',
      awb: '',
      referenceNumber: '',
      issueType: '',
      shippingCompany: '',
      issueCategory: '',
      description: '',
      priority: 'Medium',
      attachments: []
    });
    setErrors({});
    setAutoFillSuccess(false);
    setOrderData(null);
  };
  
  const handleClose = () => {
    onClose();
    resetForm();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Auto-fill Section */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-blue-900">Smart Auto-Fill</h4>
                {autoFillSuccess && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs">Auto-filled successfully</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div className="space-y-1">
                  <Label htmlFor="orderNumber" className="text-xs">Order Number</Label>
                  <Input
                    id="orderNumber"
                    value={formData.orderNumber}
                    onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                    placeholder="ORD-2025-10021"
                    className={errors.orderNumber ? 'border-red-500' : ''}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="awb" className="text-xs">AWB Number</Label>
                  <Input
                    id="awb"
                    value={formData.awb}
                    onChange={(e) => handleInputChange('awb', e.target.value)}
                    placeholder="AWB123456789"
                    className={errors.awb ? 'border-red-500' : ''}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="referenceNumber" className="text-xs">Reference Number</Label>
                  <Input
                    id="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                    placeholder="REF-2025-001"
                  />
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleAutoFillTrigger}
                disabled={isAutoFilling || (!formData.orderNumber && !formData.awb && !formData.referenceNumber)}
                className="w-full"
              >
                {isAutoFilling ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Fetching order details...
                  </>
                ) : (
                  'Auto-fill from Order Details'
                )}
              </Button>
              
              {(errors.orderNumber || errors.awb) && (
                <p className="text-sm text-red-500 flex items-center gap-1 mt-2">
                  <AlertCircle className="h-3 w-3" />
                  {errors.orderNumber}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Order Preview */}
          {orderData && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-green-900 mb-2">Order Details Preview</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><strong>Customer:</strong> {orderData.customerName}</div>
                  <div><strong>Phone:</strong> {orderData.customerPhone}</div>
                  <div><strong>Shipping:</strong> {orderData.shippingCompany}</div>
                  <div><strong>Amount:</strong> ${orderData.totalAmount}</div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueType">Issue Type *</Label>
              <Select 
                value={formData.issueType} 
                onValueChange={(value) => handleInputChange('issueType', value)}
              >
                <SelectTrigger className={errors.issueType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  {issueTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.issueType && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.issueType}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shippingCompany">Shipping Company *</Label>
              <Select 
                value={formData.shippingCompany} 
                onValueChange={(value) => handleInputChange('shippingCompany', value)}
              >
                <SelectTrigger className={errors.shippingCompany ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select shipping company" />
                </SelectTrigger>
                <SelectContent>
                  {shippingCompanies.map(company => (
                    <SelectItem key={company} value={company}>{company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.shippingCompany && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.shippingCompany}
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueCategory">Issue Category *</Label>
              <Select 
                value={formData.issueCategory} 
                onValueChange={(value) => handleInputChange('issueCategory', value)}
              >
                <SelectTrigger className={errors.issueCategory ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select issue category" />
                </SelectTrigger>
                <SelectContent>
                  {issueCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.issueCategory && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.issueCategory}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => handleInputChange('priority', value as 'Low' | 'Medium' | 'High')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.description}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments (Max 5MB per file)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                id="attachments"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="attachments"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload files or drag and drop
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG, PDF, DOC, TXT up to 5MB each
                </span>
              </label>
            </div>
            
            {formData.attachments && formData.attachments.length > 0 && (
              <div className="space-y-2">
                <Label>Attached Files</Label>
                <div className="space-y-2">
                  {formData.attachments.map((file, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
