
import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Search,
  ChevronRight,
  FileText,
  Video,
  Book,
  Clock
} from 'lucide-react';

// Fixing the type issue by using proper status types
type StatusType = "default" | "success" | "info" | "warning" | "danger";

const faqItems = [
  {
    question: 'How do I create a new shipment?',
    answer: 'To create a new shipment, navigate to the Orders page and click on the "Create Order" button. Fill in the required details like customer information, items, and shipping preferences.'
  },
  {
    question: 'How can I track an existing order?',
    answer: 'You can track an existing order by going to the Orders page, finding the specific order in the list, and clicking on the "Track" button. This will show you real-time updates on the order\'s location and status.'
  },
  {
    question: 'What do I do if a customer wants to return an item?',
    answer: 'For returns, go to the specific order in the Orders page, click on "Actions", and select "Create Return". Follow the prompts to generate a return label and instructions for the customer.'
  },
  {
    question: 'How are COD payments processed?',
    answer: 'COD payments are collected by the courier upon delivery. These payments are then transferred to your account based on your settlement cycle, which can be viewed and managed in the Financial section.'
  },
  {
    question: 'Can I change the courier for an order that\'s already been created?',
    answer: 'Yes, as long as the order hasn\'t been picked up yet. Go to the specific order, click on "Edit", and change the courier option. Note that this might affect pricing and delivery times.'
  },
];

const guideCategories = [
  {
    title: 'Getting Started',
    icon: <Book size={20} />,
    count: 5,
  },
  {
    title: 'Order Management',
    icon: <FileText size={20} />,
    count: 12,
  },
  {
    title: 'Shipment Tracking',
    icon: <Clock size={20} />,
    count: 8,
  },
  {
    title: 'Financial Management',
    icon: <MessageSquare size={20} />,
    count: 10,
  },
  {
    title: 'Integration Guides',
    icon: <Video size={20} />,
    count: 7,
  },
];

const popularArticles = [
  {
    title: 'Setting up your first warehouse location',
    category: 'Getting Started',
    status: "default" as StatusType
  },
  {
    title: 'Integration with e-commerce platforms',
    category: 'Integration Guides',
    status: "success" as StatusType
  },
  {
    title: 'Understanding COD reconciliation reports',
    category: 'Financial Management',
    status: "info" as StatusType
  },
  {
    title: 'Bulk order upload via CSV',
    category: 'Order Management',
    status: "warning" as StatusType
  },
];

const SupportPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  
  // Check if sidebar is collapsed from localStorage
  React.useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setSidebarCollapsed(savedState === 'true');
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div 
        className="flex-1 transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarCollapsed ? '5rem' : '16rem' }}
      >
        <Header className="sticky top-0 z-10" />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
          </div>
          
          <Card className="mb-6">
            <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-t-lg text-white">
              <h2 className="text-2xl font-semibold mb-2">How can we help you today?</h2>
              <p className="opacity-90 mb-4">Search our knowledge base or browse through common questions</p>
              
              <div className="flex items-center bg-white rounded-lg pl-4 pr-2 py-2 max-w-2xl">
                <Search className="text-gray-400 mr-2" size={20} />
                <Input 
                  type="text" 
                  placeholder="Search for help articles, guides, or topics..." 
                  className="flex-grow border-none shadow-none focus-visible:ring-0"
                />
                <Button className="ml-2">Search</Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <HelpCircle size={20} />
                    </div>
                    <h3 className="text-lg font-medium">Knowledge Base</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Find articles and guides on how to use our platform</p>
                </Card>
                
                <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                      <MessageSquare size={20} />
                    </div>
                    <h3 className="text-lg font-medium">Chat with Us</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Get instant help from our support team via live chat</p>
                </Card>
                
                <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-3">
                      <Phone size={20} />
                    </div>
                    <h3 className="text-lg font-medium">Contact Support</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Reach out via email or phone for personalized assistance</p>
                </Card>
              </div>
            </div>
          </Card>
          
          <Tabs defaultValue="faq" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
              <TabsTrigger value="guides">Guides & Tutorials</TabsTrigger>
              <TabsTrigger value="contact">Contact Us</TabsTrigger>
            </TabsList>
            
            <TabsContent value="faq">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Common Questions</h3>
                
                <div className="space-y-4">
                  {faqItems.map((item, i) => (
                    <Card key={i} className="p-4 border border-gray-200">
                      <h4 className="text-lg font-medium mb-2 text-gray-800">{item.question}</h4>
                      <p className="text-gray-600">{item.answer}</p>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="guides">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  
                  <Card className="p-4">
                    {guideCategories.map((category, i) => (
                      <div 
                        key={i} 
                        className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 cursor-pointer rounded-md"
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                            {category.icon}
                          </div>
                          <span>{category.title}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">{category.count} guides</span>
                          <ChevronRight size={16} className="text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Popular Articles</h3>
                  
                  <Card className="p-4">
                    <div className="space-y-3">
                      {popularArticles.map((article, i) => (
                        <div 
                          key={i} 
                          className="p-3 border border-gray-200 rounded-md hover:shadow-sm cursor-pointer"
                        >
                          <h4 className="font-medium mb-1">{article.title}</h4>
                          <div className="flex items-center text-sm">
                            <span className={`px-2 py-0.5 rounded-full text-xs bg-${article.status === 'default' ? 'gray' : article.status}-100 text-${article.status === 'default' ? 'gray' : article.status}-800 mr-2`}>
                              {article.category}
                            </span>
                            <span className="text-gray-500">5 min read</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contact">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="text-gray-500 mt-1 mr-3" size={20} />
                      <div>
                        <p className="font-medium">Email Us</p>
                        <a href="mailto:support@tredo.com" className="text-blue-600 hover:underline">
                          support@tredo.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="text-gray-500 mt-1 mr-3" size={20} />
                      <div>
                        <p className="font-medium">Call Us</p>
                        <a href="tel:+18001234567" className="text-blue-600 hover:underline">
                          +1 (800) 123-4567
                        </a>
                        <p className="text-sm text-gray-500">Mon-Fri: 9AM - 6PM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MessageSquare className="text-gray-500 mt-1 mr-3" size={20} />
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-sm text-gray-500">Available 24/7</p>
                        <Button variant="outline" size="sm" className="mt-1">
                          Start Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Send us a Message</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="name">
                          Name
                        </label>
                        <Input id="name" placeholder="Your name" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="email">
                          Email
                        </label>
                        <Input id="email" type="email" placeholder="Your email" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="subject">
                        Subject
                      </label>
                      <Input id="subject" placeholder="How can we help you?" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="message">
                        Message
                      </label>
                      <Textarea 
                        id="message" 
                        placeholder="Please describe your issue in detail" 
                        rows={5}
                      />
                    </div>
                    
                    <Button>Submit Request</Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default SupportPage;
