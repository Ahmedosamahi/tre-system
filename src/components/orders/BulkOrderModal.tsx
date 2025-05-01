
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';

interface BulkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkOrderModal = ({ isOpen, onClose }: BulkOrderModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Bulk Order Import</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-4">
          <p className="text-center text-muted-foreground">
            Upload your bulk orders using our Excel template. Download the template, fill it with your order details, and upload it back.
          </p>
          
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <Download className="h-4 w-4" />
            Download Excel Template
          </Button>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 w-full flex flex-col items-center justify-center gap-4 hover:border-gray-400 transition-colors cursor-pointer">
            <Upload className="h-10 w-10 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium">Drag & drop your file here</p>
              <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
            </div>
            <input type="file" className="hidden" accept=".xlsx,.csv" />
            <p className="text-xs text-muted-foreground">Supported formats: .xlsx, .csv</p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-brand text-white" disabled>Upload</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
