
import React, { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/crm/DatePicker';
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics & Insights</h1>
        </div>

        {/* Navigation and Filters Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          {/* Section Navigation - Left Aligned */}
          <nav className="flex flex-wrap gap-8">
            <button
              onClick={() => scrollToSection('delivery-performance')}
              className="text-sm font-bold text-gray-700 hover:text-blue-600 hover:underline underline-offset-4 transition-all duration-200"
            >
              Delivery Performance
            </button>
            <button
              onClick={() => scrollToSection('geographical-analysis')}
              className="text-sm font-bold text-gray-700 hover:text-blue-600 hover:underline underline-offset-4 transition-all duration-200"
            >
              Geographical Analysis
            </button>
            <button
              onClick={() => scrollToSection('financial-summary')}
              className="text-sm font-bold text-gray-700 hover:text-blue-600 hover:underline underline-offset-4 transition-all duration-200"
            >
              Financial Summary
            </button>
            <button
              onClick={() => scrollToSection('courier-performance')}
              className="text-sm font-bold text-gray-700 hover:text-blue-600 hover:underline underline-offset-4 transition-all duration-200"
            >
              Courier Performance
            </button>
          </nav>

          {/* Filter Controls - Right Aligned */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-[140px]">
              <DatePicker 
                date={selectedDateRange} 
                setDate={setSelectedDateRange}
                placeholder="Date Range"
              />
            </div>
            
            <Select value={selectedOrderType} onValueChange={setSelectedOrderType}>
              <SelectTrigger className="w-[130px] h-10 border-gray-200 shadow-sm">
                <SelectValue placeholder="Order Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
                <SelectItem value="prepaid">Prepaid</SelectItem>
                <SelectItem value="return">Return Orders</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[120px] h-10 border-gray-200 shadow-sm">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="cairo">Cairo</SelectItem>
                <SelectItem value="giza">Giza</SelectItem>
                <SelectItem value="alexandria">Alexandria</SelectItem>
                <SelectItem value="mansoura">Mansoura</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCourier} onValueChange={setSelectedCourier}>
              <SelectTrigger className="w-[120px] h-10 border-gray-200 shadow-sm">
                <SelectValue placeholder="Courier" />
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

        {/* Overview Section with KPI Cards */}
        <OverviewSection />

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
