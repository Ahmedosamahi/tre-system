
import React, { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Calendar,
  Download,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  MessageSquare
} from 'lucide-react';
import { DatePicker } from '@/components/crm/DatePicker';
import { StatCard } from '@/components/crm/StatCard';
import { AbnormalShipmentTable } from '@/components/crm/AbnormalShipmentTable';
import { StatusTabs } from '@/components/crm/StatusTabs';

// Sample data for the CRM page
const mockStats = [
  { 
    title: 'Total Abnormal', 
    value: 256, 
    icon: <AlertTriangle className="text-danger" />, 
    bgColor: 'bg-danger-light'
  },
  { 
    title: 'Total Solved', 
    value: 182, 
    icon: <CheckCircle className="text-success" />, 
    bgColor: 'bg-success-light'
  },
  { 
    title: 'Unanswered', 
    value: 74, 
    icon: <Clock className="text-warning" />, 
    bgColor: 'bg-warning-light' 
  }
];

// Sample shipment data
const mockShipments = [
  {
    id: '1',
    awbNumber: 'AWB10023456',
    referenceNumber: 'ORD-2023-789',
    abnormalTime: '2023-05-08 14:30',
    customerName: 'Ahmed Mohamed',
    phone: '+20 123 456 7890',
    mainReason: 'Delivery Issue',
    subReason: 'Wrong Address',
    courierNote: 'Customer provided incorrect apartment number, building was found but couldn\'t locate the specific unit',
    isReplied: false
  },
  {
    id: '2',
    awbNumber: 'AWB10023457',
    referenceNumber: 'ORD-2023-790',
    abnormalTime: '2023-05-08 15:45',
    customerName: 'Sarah Ahmed',
    phone: '+20 123 456 7891',
    mainReason: 'Package Issue',
    subReason: 'Damaged Package',
    courierNote: 'Package appears to have been crushed during transport, contents may be damaged',
    isReplied: true
  },
  {
    id: '3',
    awbNumber: 'AWB10023458',
    referenceNumber: 'ORD-2023-791',
    abnormalTime: '2023-05-08 16:20',
    customerName: 'Mahmoud Ali',
    phone: '+20 123 456 7892',
    mainReason: 'Customer Issue',
    subReason: 'Customer Unavailable',
    courierNote: 'Called customer multiple times but no answer. Left notice at the door.',
    isReplied: false
  },
  {
    id: '4',
    awbNumber: 'AWB10023459',
    referenceNumber: 'ORD-2023-792',
    abnormalTime: '2023-05-09 09:15',
    customerName: 'Fatima Hassan',
    phone: '+20 123 456 7893',
    mainReason: 'Payment Issue',
    subReason: 'Insufficient Funds',
    courierNote: 'Customer didn\'t have the full amount for COD payment. Requested to reschedule.',
    isReplied: false
  },
  {
    id: '5',
    awbNumber: 'AWB10023460',
    referenceNumber: 'ORD-2023-793',
    abnormalTime: '2023-05-09 10:30',
    customerName: 'Omar Khalid',
    phone: '+20 123 456 7894',
    mainReason: 'Delivery Issue',
    subReason: 'Access Restricted',
    courierNote: 'Security at the compound did not allow entry without prior arrangement.',
    isReplied: true
  },
];

const CrmCustomerService = () => {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [searchParams, setSearchParams] = useState({
    orderNumber: '',
    awbNumber: '',
    referenceNumber: '',
    phoneNumber: '',
  });
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };
  
  const handleSearch = () => {
    // In a real app, this would trigger an API call with filters
    console.log('Searching with params:', { fromDate, toDate, ...searchParams });
  };
  
  const handleClear = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setSearchParams({
      orderNumber: '',
      awbNumber: '',
      referenceNumber: '',
      phoneNumber: '',
    });
  };
  
  const filteredShipments = mockShipments.filter(shipment => {
    if (activeTab === 'replied') return shipment.isReplied;
    if (activeTab === 'unanswered') return !shipment.isReplied;
    return true; // 'all' tab
  });

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">CRM Customer Service (Abnormal)</h1>
          <Button className="bg-brand text-white hover:bg-brand-dark">
            <Download className="mr-2 h-5 w-5" />
            Export All
          </Button>
        </div>

        {/* Search & Filters Panel */}
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Search by</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <DatePicker 
                date={fromDate}
                setDate={setFromDate}
                placeholder="Select start date"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <DatePicker 
                date={toDate}
                setDate={setToDate}
                placeholder="Select end date"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Order Number</label>
              <Input
                name="orderNumber"
                value={searchParams.orderNumber}
                onChange={handleSearchChange}
                placeholder="Enter order number"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">AWB Number</label>
              <Input
                name="awbNumber"
                value={searchParams.awbNumber}
                onChange={handleSearchChange}
                placeholder="Enter AWB number"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reference Number</label>
              <Input
                name="referenceNumber"
                value={searchParams.referenceNumber}
                onChange={handleSearchChange}
                placeholder="Enter reference number"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                name="phoneNumber"
                value={searchParams.phoneNumber}
                onChange={handleSearchChange}
                placeholder="Enter phone number"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-4">
            <Button 
              variant="outline" 
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button 
              onClick={handleSearch}
              className="bg-brand text-white hover:bg-brand-dark"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </Card>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockStats.map((stat, index) => (
            <StatCard 
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              bgColor={stat.bgColor}
            />
          ))}
        </div>
        
        {/* Status Tabs and Data Table */}
        <div className="bg-white rounded-lg shadow">
          <StatusTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            tabs={[
              { id: 'all', label: 'All', count: mockShipments.length },
              { id: 'replied', label: 'Replied', count: mockShipments.filter(s => s.isReplied).length },
              { id: 'unanswered', label: 'Unanswered', count: mockShipments.filter(s => !s.isReplied).length }
            ]} 
          />
          
          <AbnormalShipmentTable 
            shipments={filteredShipments}
            onView={(id) => console.log('Viewing shipment:', id)}
            onReply={(id) => console.log('Replying to shipment:', id)}
          />
          
          {/* Pagination */}
          <div className="py-4 px-6 border-t">
            <nav className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p-1))}>
                  Previous
                </Button>
                <Button variant="outline" onClick={() => setCurrentPage(p => p+1)}>
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Button 
                      variant="outline"
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p-1))}
                    >
                      Previous
                    </Button>
                    {[1, 2, 3].map((page) => (
                      <Button 
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        className="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button 
                      variant="outline"
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium"
                      onClick={() => setCurrentPage(p => p+1)}
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CrmCustomerService;
