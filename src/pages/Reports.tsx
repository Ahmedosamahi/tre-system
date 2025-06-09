
import React, { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/crm/DatePicker';
import { Download, FileText, Calendar } from 'lucide-react';
import { OverviewSection } from '@/components/reports/OverviewSection';
import { DeliveryPerformanceSection } from '@/components/reports/DeliveryPerformanceSection';
import { GeographicalSection } from '@/components/reports/GeographicalSection';
import { FinancialSection } from '@/components/reports/FinancialSection';

const Reports = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<Date | undefined>(undefined);
  const [selectedOrderType, setSelectedOrderType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCourier, setSelectedCourier] = useState('all');

  const handleExport = (format: 'excel' | 'pdf') => {
    console.log(`Exporting data as ${format}`);
    // Export logic would go here
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => handleExport('excel')} className="gap-2">
              <FileText className="h-4 w-4" />
              Export Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')} className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Global Filters */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date Range</label>
              <DatePicker 
                date={selectedDateRange} 
                setDate={setSelectedDateRange}
                placeholder="Select date range"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Order Type</label>
              <Select value={selectedOrderType} onValueChange={setSelectedOrderType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select order type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                  <SelectItem value="prepaid">Prepaid</SelectItem>
                  <SelectItem value="return">Return Orders</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">City/Governorate</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="cairo">Cairo</SelectItem>
                  <SelectItem value="giza">Giza</SelectItem>
                  <SelectItem value="alexandria">Alexandria</SelectItem>
                  <SelectItem value="mansoura">Mansoura</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Courier Company</label>
              <Select value={selectedCourier} onValueChange={setSelectedCourier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select courier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Couriers</SelectItem>
                  <SelectItem value="aramex">Aramex</SelectItem>
                  <SelectItem value="dhl">DHL</SelectItem>
                  <SelectItem value="fedex">FedEx</SelectItem>
                  <SelectItem value="mylerz">Mylerz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="delivery">Delivery Performance</TabsTrigger>
            <TabsTrigger value="geographical">Geographical Analysis</TabsTrigger>
            <TabsTrigger value="financial">Financial Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewSection />
          </TabsContent>

          <TabsContent value="delivery" className="space-y-6">
            <DeliveryPerformanceSection />
          </TabsContent>

          <TabsContent value="geographical" className="space-y-6">
            <GeographicalSection />
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <FinancialSection />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Reports;
