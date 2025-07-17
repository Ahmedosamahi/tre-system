import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Package, Building, AlertCircle, Clock } from "lucide-react";
import { Ticket } from "@/types/index";

interface ViewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

export const ViewTicketModal = ({ isOpen, onClose, ticket }: ViewTicketModalProps) => {
  if (!ticket) return null;

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

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ticket Details - {ticket.id}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Order Number:</span>
                <span className="text-sm">{ticket.orderNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Reference:</span>
                <span className="text-sm">{ticket.referenceNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Shipping Company:</span>
                <span className="text-sm">{ticket.shippingCompany}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Created:</span>
                <span className="text-sm">{new Date(ticket.dateCreated).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Status:</span>
                {getStatusBadge(ticket.status)}
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Priority:</span>
                {getPriorityBadge(ticket.priority)}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Issue Type</h4>
              <Badge variant="outline">{ticket.issueType}</Badge>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Issue Category</h4>
              <Badge variant="outline">{ticket.issueCategory}</Badge>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Description</h4>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm">{ticket.description}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>
              Respond to Ticket
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};