import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, X, MessageSquare, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeedbackFormProps {
  onClose?: () => void;
  standalone?: boolean;
}

export const FeedbackForm = ({ onClose, standalone = false }: FeedbackFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    description: '',
    priority: 'Medium'
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024); // 5MB limit
    
    if (validFiles.length !== files.length) {
      toast({
        title: "File Size Error",
        description: "Some files were too large. Maximum size is 5MB per file.",
        variant: "destructive"
      });
    }
    
    setAttachedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We'll review it and get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        category: '',
        subject: '',
        description: '',
        priority: 'Medium'
      });
      setAttachedFiles([]);
      setRating(0);
      
      if (onClose) onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && formData.email && formData.category && formData.subject && formData.description;

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-6 w-6 cursor-pointer transition-colors ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
        onClick={() => setRating(index + 1)}
      />
    ));
  };

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Overall Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overall Rating
        </label>
        <div className="flex items-center space-x-1">
          {renderStars()}
          <span className="ml-2 text-sm text-gray-600">
            {rating > 0 ? `${rating}/5` : 'No rating'}
          </span>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <Input
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Category and Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="feature-request">Feature Request</SelectItem>
              <SelectItem value="bug-report">Bug Report</SelectItem>
              <SelectItem value="improvement">Improvement Suggestion</SelectItem>
              <SelectItem value="user-experience">User Experience</SelectItem>
              <SelectItem value="performance">Performance Issue</SelectItem>
              <SelectItem value="general">General Feedback</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
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

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject *
        </label>
        <Input
          placeholder="Brief description of your feedback"
          value={formData.subject}
          onChange={(e) => handleInputChange('subject', e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Detailed Feedback *
        </label>
        <Textarea
          placeholder="Please provide detailed feedback about your experience..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={6}
          required
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachments (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="feedback-file-upload"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.csv,.xlsx"
          />
          <label htmlFor="feedback-file-upload" className="cursor-pointer">
            <div className="text-center">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload files or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Screenshots, documents, or other relevant files (max 5MB each)
              </p>
            </div>
          </label>
        </div>

        {/* Attached Files */}
        {attachedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Attached Files:</p>
            {attachedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-600">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );

  if (standalone) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Platform Feedback
          </CardTitle>
          <CardDescription>
            Help us improve the CMS platform by sharing your thoughts and suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormContent />
        </CardContent>
      </Card>
    );
  }

  return <FormContent />;
};