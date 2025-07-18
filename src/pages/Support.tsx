
import React, { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { SearchBox } from '@/components/ui/SearchBox';
import { HelpCategories } from '@/components/support/HelpCategories';
import { FAQAccordion } from '@/components/support/FAQAccordion';
import { ContactSupport } from '@/components/support/ContactSupport';
import { SupportArticles } from '@/components/support/SupportArticles';
import { FloatingHelpButton } from '@/components/support/FloatingHelpButton';
import { SupportDashboard } from '@/components/support/SupportDashboard';
import { QuickLinks } from '@/components/support/QuickLinks';
import { FeedbackForm } from '@/components/support/FeedbackForm';
import { TicketingIntegration } from '@/components/support/TicketingIntegration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  MessageSquare, 
  BarChart3, 
  MessageCircle, 
  BookOpen,
  Star
} from 'lucide-react';

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('knowledge-base');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Smooth scroll to the category section
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mock user role - in real app, this would come from authentication context
  const userRole = 'admin'; // 'admin', 'user', 'support'

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Help & Support Center</h1>
          <p className="text-lg text-gray-600">
            Comprehensive support for the Cargo Management System
          </p>
          <div className="flex justify-center mt-4">
            <Badge variant="outline" className="text-sm">
              24/7 Support Available
            </Badge>
          </div>
        </div>

        {/* Global Search */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <SearchBox
              placeholder="Search help topics, tickets, or documentation…"
              value={searchQuery}
              onChange={handleSearch}
              onClear={handleClearSearch}
              className="shadow-lg"
            />
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="knowledge-base" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Knowledge Base
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Support Tickets
            </TabsTrigger>
            <TabsTrigger value="quick-links" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Quick Links
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact Support
            </TabsTrigger>
            {userRole === 'admin' && (
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
            )}
          </TabsList>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge-base" className="mt-8">
            <div className="space-y-12">
              {/* Help Categories */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Browse by Category</h2>
                <HelpCategories onCategoryClick={handleCategoryClick} />
              </div>

              {/* FAQs */}
              <div>
                <FAQAccordion searchQuery={searchQuery} activeCategory={activeCategory} />
              </div>

              {/* Support Articles */}
              <div>
                <SupportArticles />
              </div>
            </div>
          </TabsContent>

          {/* Support Tickets Tab */}
          <TabsContent value="tickets" className="mt-8">
            <TicketingIntegration />
          </TabsContent>

          {/* Quick Links Tab */}
          <TabsContent value="quick-links" className="mt-8">
            <QuickLinks />
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="mt-8">
            <FeedbackForm standalone />
          </TabsContent>

          {/* Contact Support Tab */}
          <TabsContent value="contact" className="mt-8">
            <ContactSupport />
          </TabsContent>

          {/* Admin Dashboard Tab */}
          {userRole === 'admin' && (
            <TabsContent value="dashboard" className="mt-8">
              <SupportDashboard />
            </TabsContent>
          )}
        </Tabs>

        {/* Floating Help Button */}
        <FloatingHelpButton />
      </div>
    </PageLayout>
  );
};

export default Support;
