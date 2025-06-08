
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface DeleteCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customerName: string;
}

export const DeleteCustomerModal: React.FC<DeleteCustomerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  customerName
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg">Delete Customer</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete customer <strong>{customerName}</strong>? 
            This will permanently remove the customer and all associated data.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete Customer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
