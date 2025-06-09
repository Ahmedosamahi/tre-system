
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SupportTicketForm } from './SupportTicketForm';
import { MessageCircle, Mail } from 'lucide-react';

export const ContactSupport = () => {
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg p-8 text-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Still need help?</h2>
      <p className="text-gray-600 mb-6">Can't find what you're looking for? Our support team is here to help.</p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {/* Live Chat Modal */}
        <Dialog open={isChatModalOpen} onOpenChange={setIsChatModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" size="lg">
              <MessageCircle className="h-5 w-5" />
              Live Chat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Live Chat Support</DialogTitle>
              <DialogDescription>
                Connect with our support team for real-time assistance.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  Our chat support is available Monday to Friday, 9 AM to 6 PM EST.
                </p>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => {
                  // Here you would integrate with your chat service
                  alert('Chat integration would be implemented here');
                  setIsChatModalOpen(false);
                }}>
                  Start Chat
                </Button>
                <Button variant="outline" onClick={() => setIsChatModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Submit Ticket Modal */}
        <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2" size="lg">
              <Mail className="h-5 w-5" />
              Submit a Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit a Support Ticket</DialogTitle>
              <DialogDescription>
                Describe your issue and we'll get back to you within 24 hours.
              </DialogDescription>
            </DialogHeader>
            <SupportTicketForm onClose={() => setIsTicketModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
