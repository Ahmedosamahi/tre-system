
import React, { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/crm/DatePicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { OverviewSection } from '@/components/analytics/OverviewSection';
import { DeliveryPerformanceSection } from '@/components/analytics/DeliveryPerformanceSection';
import { GeographicalSection } from '@/components/analytics/GeographicalSection';
import { FinancialSection } from '@/components/analytics/FinancialSection';
import { CourierPerformanceSection } from '@/components/analytics/CourierPerformanceSection';

const Analytics = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<Date | undefined>(undefined);
  const [selectedOrderType, setSelectedOrderType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCourier, setSelectedCourier] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100; // Account for header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
        </div>

        {/* Section Navigation */}
        <div className="flex items-center gap-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => scrollToSection('delivery-performance')}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 border-b-2 border-transparent hover:border-blue-600 pb-2"
          >
            Delivery Performance
          </button>
          <button
            onClick={() => scrollToSection('geographical-analysis')}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 border-b-2 border-transparent hover:border-blue-600 pb-2"
          >
            Geographical Analysis
          </button>
          <button
            onClick={() => scrollToSection('financial-summary')}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 border-b-2 border-transparent hover:border-blue-600 pb-2"
          >
            Financial Summary
          </button>
          <button
            onClick={() => scrollToSection('courier-performance')}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 border-b-2 border-transparent hover:border-blue-600 pb-2"
          >
            Courier Performance
          </button>
        </div>

        {/* Overview Section */}
        <div className="space-y-6">
          <OverviewSection />
          
          {/* Filters */}
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <Card className="p-6 border border-gray-200">
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
          )}
        </div>

        {/* Section Divider */}
        <div className="relative py-8" id="delivery-performance">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-6 text-lg font-semibold text-gray-900">
              Delivery Performance
            </span>
          </div>
        </div>

        {/* Delivery Performance Section */}
        <DeliveryPerformanceSection />

        {/* Section Divider */}
        <div className="relative py-8" id="geographical-analysis">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-6 text-lg font-semibold text-gray-900">
              Geographical Analysis
            </span>
          </div>
        </div>

        {/* Geographical Analysis Section */}
        <GeographicalSection />

        {/* Section Divider */}
        <div className="relative py-8" id="financial-summary">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-6 text-lg font-semibold text-gray-900">
              Financial Summary
            </span>
          </div>
        </div>

        {/* Financial Summary Section */}
        <FinancialSection />

        {/* Section Divider */}
        <div className="relative py-8" id="courier-performance">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-6 text-lg font-semibold text-gray-900">
              Courier Performance
            </span>
          </div>
        </div>

        {/* Courier Performance Section */}
        <CourierPerformanceSection />
      </div>
    </PageLayout>
  );
};

export default Analytics;
