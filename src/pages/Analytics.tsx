
import React, { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/crm/DatePicker';
import { Filter, ChevronDown } from 'lucide-react';
import { OverviewSection } from '@/components/analytics/OverviewSection';
import { DeliveryPerformanceSection } from '@/components/analytics/DeliveryPerformanceSection';
import { GeographicalSection } from '@/components/analytics/GeographicalSection';
import { FinancialSection } from '@/components/analytics/FinancialSection';
import { CourierPerformanceSection } from '@/components/analytics/CourierPerformanceSection';

const Analytics = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<Date | undefined>(undefined);
  const [selectedOrderType, setSelectedOrderType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCourier, setSelectedCourier] = useState('all');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics & Insights</h1>
          
          {/* Navigation Links */}
          <nav className="flex justify-center gap-8 mb-8">
            <button
              onClick={() => scrollToSection('delivery-performance')}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Delivery Performance
            </button>
            <button
              onClick={() => scrollToSection('geographical-analysis')}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Geographical Analysis
            </button>
            <button
              onClick={() => scrollToSection('financial-summary')}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Financial Summary
            </button>
            <button
              onClick={() => scrollToSection('courier-performance')}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Courier Performance
            </button>
          </nav>
        </div>

        {/* Overview Section */}
        <OverviewSection />

        {/* Collapsible Filters */}
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto text-sm">
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="p-4 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Date Range</label>
                  <DatePicker 
                    date={selectedDateRange} 
                    setDate={setSelectedDateRange}
                    placeholder="Select date range"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Order Type</label>
                  <Select value={selectedOrderType} onValueChange={setSelectedOrderType}>
                    <SelectTrigger className="h-9">
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
                  <label className="text-xs font-medium text-gray-700">City/Governorate</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="h-9">
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
                  <label className="text-xs font-medium text-gray-700">Courier Company</label>
                  <Select value={selectedCourier} onValueChange={setSelectedCourier}>
                    <SelectTrigger className="h-9">
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
          </CollapsibleContent>
        </Collapsible>

        {/* Section Divider */}
        <div className="flex items-center justify-center py-8">
          <div className="flex-1 border-t border-gray-300"></div>
          <h2 id="delivery-performance" className="px-6 text-xl font-semibold text-gray-900">
            Delivery Performance
          </h2>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Delivery Performance Section */}
        <DeliveryPerformanceSection />

        {/* Section Divider */}
        <div className="flex items-center justify-center py-8">
          <div className="flex-1 border-t border-gray-300"></div>
          <h2 id="geographical-analysis" className="px-6 text-xl font-semibold text-gray-900">
            Geographical Analysis
          </h2>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Geographical Analysis Section */}
        <GeographicalSection />

        {/* Section Divider */}
        <div className="flex items-center justify-center py-8">
          <div className="flex-1 border-t border-gray-300"></div>
          <h2 id="financial-summary" className="px-6 text-xl font-semibold text-gray-900">
            Financial Summary
          </h2>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Financial Summary Section */}
        <FinancialSection />

        {/* Section Divider */}
        <div className="flex items-center justify-center py-8">
          <div className="flex-1 border-t border-gray-300"></div>
          <h2 id="courier-performance" className="px-6 text-xl font-semibold text-gray-900">
            Courier Performance
          </h2>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Courier Performance Section */}
        <CourierPerformanceSection />
      </div>
    </PageLayout>
  );
};

export default Analytics;
