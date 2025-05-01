
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Upload, File, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BulkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkOrderModal = ({ isOpen, onClose }: BulkOrderModalProps) => {
  console.log("BulkOrderModal rendering with isOpen:", isOpen);
  
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };
  
  const validateAndSetFile = (file: File) => {
    const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !['xlsx', 'csv'].includes(fileExtension || '')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload only .xlsx or .csv files",
        variant: "destructive",
      });
      return;
    }
    
    setFile(file);
    toast({
      title: "File Selected",
      description: `${file.name} is ready to upload`,
    });
  };
  
  const removeFile = () => {
    setFile(null);
  };
  
  const downloadTemplate = () => {
    // In a real app, this would download an actual template
    toast({
      title: "Template Downloaded",
      description: "Excel template has been downloaded successfully.",
    });
  };
  
  const handleUpload = () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would upload the file to the server here
    toast({
      title: "Upload Successful",
      description: "Your bulk order has been processed.",
    });
    onClose();
  };
  
  const fileInputId = "bulk-order-file-input";
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent className="sm:max-w-md z-50">
        {console.log("Rendering BulkOrderModal content")}
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Bulk Order Import</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-4">
          <p className="text-center text-muted-foreground">
            Upload your bulk orders using our Excel template. Download the template, fill it with your order details, and upload it back.
          </p>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={downloadTemplate}
          >
            <Download className="h-4 w-4" />
            Download Excel Template
          </Button>
          
          <div 
            className={`border-2 ${isDragging ? 'border-brand' : 'border-dashed border-gray-300'} rounded-lg p-8 w-full flex flex-col items-center justify-center gap-4 hover:border-gray-400 transition-colors cursor-pointer`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById(fileInputId)?.click()}
          >
            {file ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <File className="h-8 w-8 text-brand" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-400" />
                <div className="text-center">
                  <p className="text-sm font-medium">Drag & drop your file here</p>
                  <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                </div>
              </>
            )}
            <input 
              type="file" 
              id={fileInputId} 
              className="hidden" 
              accept=".xlsx,.csv" 
              onChange={handleFileInputChange}
            />
            <p className="text-xs text-muted-foreground">Supported formats: .xlsx, .csv</p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            className="bg-brand text-white" 
            disabled={!file}
            onClick={handleUpload}
          >
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
