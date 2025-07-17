import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';
import { TicketFormData } from '@/types';
import { useToast } from '@/hooks/use-toast';

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
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
    
    if (!formData.orderNumber.trim()) {
      newErrors.orderNumber = 'Order number is required';
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
      toast({
        title: "Success",
        description: "Ticket created successfully",
        variant: "default"
      });
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
      referenceNumber: '',
      issueType: '',
      shippingCompany: '',
      issueCategory: '',
      description: '',
      priority: 'Medium',
      attachments: []
    });
    setErrors({});
  };
  
  const handleClose = () => {
    onClose();
    resetForm();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number *</Label>
              <Input
                id="orderNumber"
                value={formData.orderNumber}
                onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                placeholder="ORD-2025-10021"
                className={errors.orderNumber ? 'border-red-500' : ''}
              />
              {errors.orderNumber && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.orderNumber}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="referenceNumber">Reference Number</Label>
              <Input
                id="referenceNumber"
                value={formData.referenceNumber}
                onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                placeholder="REF-2025-001"
              />
            </div>
          </div>
          
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