import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, MessageSquare, ArrowUpDown, Paperclip } from 'lucide-react';
import { Ticket } from '@/types';

interface TicketTableProps {
  tickets: Ticket[];
  onView: (id: string) => void;
  onRespond: (id: string) => void;
  onSort: (field: string) => void;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export const TicketTable: React.FC<TicketTableProps> = ({ 
  tickets, 
  onView,
  onRespond,
  onSort,
  sortField,
  sortOrder
}) => {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  
  const toggleSelectAll = () => {
    if (Object.keys(selectedRows).length === tickets.length) {
      setSelectedRows({});
    } else {
      const allSelected = tickets.reduce((acc, ticket) => {
        acc[ticket.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setSelectedRows(allSelected);
    }
  };
  
  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const isAllSelected = tickets.length > 0 && Object.keys(selectedRows).length === tickets.length;
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Responded':
        return <Badge variant="default" className="bg-green-100 text-green-800">Responded</Badge>;
      case 'Open':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Open</Badge>;
      case 'Closed':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">High</Badge>;
      case 'Medium':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'Low':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };
  
  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onSort(field)}
      className="p-0 h-auto font-medium hover:bg-transparent"
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={isAllSelected}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>
              <SortButton field="ticketId">Ticket ID</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="orderNumber">Order Number</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="referenceNumber">Reference Number</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="issueType">Issue Type</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="shippingCompany">Shipping Company</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="dateCreated">Date Created</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="issueCategory">Issue Category</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="priority">Priority</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="status">Status</SortButton>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>
                <Checkbox 
                  checked={!!selectedRows[ticket.id]}
                  onCheckedChange={() => toggleSelectRow(ticket.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{ticket.ticketId}</span>
                  {ticket.attachments && ticket.attachments.length > 0 && (
                    <Paperclip className="h-3 w-3 text-gray-400" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-medium text-blue-600">{ticket.orderNumber}</span>
              </TableCell>
              <TableCell>{ticket.referenceNumber}</TableCell>
              <TableCell>
                <span className="text-sm">{ticket.issueType}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{ticket.shippingCompany}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-500">{ticket.dateCreated}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{ticket.issueCategory}</span>
              </TableCell>
              <TableCell>
                {getPriorityBadge(ticket.priority)}
              </TableCell>
              <TableCell>
                {getStatusBadge(ticket.status)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onView(ticket.id)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {ticket.status === 'Open' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-primary border-primary hover:bg-primary/10"
                      onClick={() => onRespond(ticket.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Respond
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          
          {tickets.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                No tickets found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};