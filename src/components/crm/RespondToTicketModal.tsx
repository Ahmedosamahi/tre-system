import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Ticket } from "@/types/index";
import { useToast } from "@/hooks/use-toast";

interface RespondToTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onSubmit: (ticketId: string, response: string, newStatus: string) => void;
}

export const RespondToTicketModal = ({ isOpen, onClose, ticket, onSubmit }: RespondToTicketModalProps) => {
  const [response, setResponse] = useState("");
  const [newStatus, setNewStatus] = useState("Responded");
  const { toast } = useToast();

  if (!ticket) return null;

  const handleSubmit = () => {
    if (!response.trim()) {
      toast({
        title: "Error",
        description: "Please enter a response",
        variant: "destructive",
      });
      return;
    }

    onSubmit(ticket.id, response, newStatus);
    setResponse("");
    setNewStatus("Responded");
    onClose();
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return <Badge variant="destructive">Open</Badge>;
      case 'responded':
        return <Badge variant="default">Responded</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Respond to Ticket - {ticket.id}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm font-medium">Order Number:</span>
                <span className="text-sm ml-2">{ticket.orderNumber}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Current Status:</span>
                <span className="ml-2">{getStatusBadge(ticket.status)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Issue Type</h4>
              <Badge variant="outline">{ticket.issueType}</Badge>
            </div>
            
            <div className="space-y-2 mt-3">
              <h4 className="text-sm font-medium">Original Description</h4>
              <p className="text-sm bg-background p-2 rounded border">{ticket.description}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label htmlFor="response">Response *</Label>
              <Textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Enter your response to the customer..."
                className="mt-1"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="newStatus">Update Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Responded">Responded</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Submit Response
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};