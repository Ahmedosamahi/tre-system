
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchBox } from '@/components/ui/SearchBox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, Search, HelpCircle, FileText, BookOpen, 
  Phone, Mail, PlusCircle, ArrowRight, ChevronDown, MessageSquare 
} from 'lucide-react';

const SupportPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header className="sticky top-0 z-10" />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
            <Button className="bg-brand text-white hover:bg-brand-dark flex items-center gap-2">
              <MessageCircle size={18} /> Contact Support
            </Button>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <div className="p-6">
                <h2 className="text-xl font-medium mb-4 text-center">How can we help you today?</h2>
                <div className="max-w-xl mx-auto">
                  <SearchBox placeholder="Search for help articles, topics, or questions..." />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {[
                    { icon: <FileText size={24} />, label: 'Guides' },
                    { icon: <BookOpen size={24} />, label: 'Documentation' },
                    { icon: <MessageSquare size={24} />, label: 'Live Chat' },
                    { icon: <Phone size={24} />, label: 'Call Support' }
                  ].map((item, index) => (
                    <Card key={index} className="flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-brand-light/20 flex items-center justify-center text-brand mb-3">
                        {item.icon}
                      </div>
                      <p className="font-medium">{item.label}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
            
            <Tabs defaultValue="faq" className="mb-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="faq">FAQs</TabsTrigger>
                <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
                <TabsTrigger value="contact">Contact Us</TabsTrigger>
              </TabsList>
              
              <TabsContent value="faq">
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-6">Frequently Asked Questions</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="font-medium">Getting Started</div>
                        <div className="text-sm text-gray-500">Platform basics</div>
                      </Card>
                      <Card className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="font-medium">Orders & Shipping</div>
                        <div className="text-sm text-gray-500">Managing orders</div>
                      </Card>
                      <Card className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="font-medium">Courier Integrations</div>
                        <div className="text-sm text-gray-500">API connections</div>
                      </Card>
                    </div>
                    
                    <div className="space-y-4 mt-8">
                      <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">How do I create a new shipping order?</div>
                          <ChevronDown size={20} className="text-gray-500" />
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">How to connect a courier API?</div>
                          <ChevronDown size={20} className="text-gray-500" />
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">Can I bulk import orders from a spreadsheet?</div>
                          <ChevronDown size={20} className="text-gray-500" />
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">How do I track COD payments?</div>
                          <ChevronDown size={20} className="text-gray-500" />
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">How to generate shipping labels?</div>
                          <ChevronDown size={20} className="text-gray-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-8">
                      <Button variant="outline" className="flex items-center gap-2">
                        View All FAQs <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="tickets">
                <Card className="mb-6">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium">Your Support Tickets</h3>
                      <Button className="bg-brand text-white hover:bg-brand-dark flex items-center gap-2">
                        <PlusCircle size={16} /> New Ticket
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { 
                          id: 'TKT-1234', 
                          subject: 'Issue with FedEx API Integration',
                          status: 'Open',
                          priority: 'High',
                          date: '2025-04-22T14:30:00Z',
                          lastUpdate: '2025-04-23T09:15:00Z' 
                        },
                        { 
                          id: 'TKT-1233', 
                          subject: 'Cannot generate monthly report',
                          status: 'In Progress',
                          priority: 'Medium',
                          date: '2025-04-20T11:45:00Z',
                          lastUpdate: '2025-04-22T16:30:00Z' 
                        },
                        { 
                          id: 'TKT-1232', 
                          subject: 'Adding custom field to order form',
                          status: 'Closed',
                          priority: 'Low',
                          date: '2025-04-18T09:30:00Z',
                          lastUpdate: '2025-04-19T14:20:00Z' 
                        }
                      ].map((ticket) => {
                        const statusColor = 
                          ticket.status === 'Open' ? 'warning' : 
                          ticket.status === 'In Progress' ? 'info' : 
                          'success';
                          
                        const priorityColor = 
                          ticket.priority === 'High' ? 'bg-danger-light text-red-800' : 
                          ticket.priority === 'Medium' ? 'bg-warning-light text-yellow-800' : 
                          'bg-info-light text-blue-800';
                          
                        return (
                          <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{ticket.id}</span>
                                  <Badge variant="outline" className={priorityColor}>
                                    {ticket.priority}
                                  </Badge>
                                </div>
                                <div className="font-medium mt-1">{ticket.subject}</div>
                              </div>
                              
                              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                <StatusBadge status={statusColor.toLowerCase()}>
                                  {ticket.status}
                                </StatusBadge>
                                <div className="text-sm text-gray-500">
                                  Updated: {new Date(ticket.lastUpdate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-6 flex items-center justify-center">
                      <Button variant="ghost" className="text-gray-500">View Archived Tickets</Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="contact">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-info-light flex items-center justify-center text-info mb-3">
                      <MessageCircle size={24} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Live Chat</h3>
                    <p className="text-gray-500 mb-6">Chat with our support team in real-time</p>
                    <Badge>Available 24/7</Badge>
                    <Button className="mt-4 w-full">Start Chat</Button>
                  </Card>
                  
                  <Card className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-warning-light flex items-center justify-center text-warning mb-3">
                      <Mail size={24} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Email Support</h3>
                    <p className="text-gray-500 mb-6">Send us an email and we'll get back to you</p>
                    <a href="mailto:support@tredo.com" className="text-info">support@tredo.com</a>
                    <Button variant="outline" className="mt-4 w-full">Compose Email</Button>
                  </Card>
                  
                  <Card className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-success-light flex items-center justify-center text-success mb-3">
                      <Phone size={24} />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Phone Support</h3>
                    <p className="text-gray-500 mb-6">Talk directly to our support specialists</p>
                    <a href="tel:+18005551234" className="text-info">+1 800 555 1234</a>
                    <div className="mt-2 text-xs text-gray-500">
                      Mon-Fri: 9AM-6PM ET
                    </div>
                    <Button variant="outline" className="mt-4 w-full">Call Support</Button>
                  </Card>
                </div>
                
                <Card className="mt-6">
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-6">Send us a Message</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Your Name</Label>
                          <Input id="name" placeholder="Enter your name" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" placeholder="Enter your email" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="What's your message about?" />
                      </div>
                      
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <textarea
                          id="message"
                          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-32"
                          placeholder="How can we help you?"
                        ></textarea>
                      </div>
                      
                      <div>
                        <Button className="bg-brand text-white hover:bg-brand-dark">
                          Submit Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

// Import once at the top
import StatusBadge from '@/components/ui/StatusBadge';

export default SupportPage;
