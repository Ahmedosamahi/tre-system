
import React, { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { SearchBox } from '@/components/ui/SearchBox';
import { HelpCategories } from '@/components/support/HelpCategories';
import { FAQAccordion } from '@/components/support/FAQAccordion';
import { ContactSupport } from '@/components/support/ContactSupport';
import { SupportArticles } from '@/components/support/SupportArticles';
import { FloatingHelpButton } from '@/components/support/FloatingHelpButton';

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Help & Support</h1>
          <p className="text-lg text-gray-600">Find answers to your questions or get in touch with our support team</p>
        </div>

        {/* Search Help Center */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <SearchBox
              placeholder="Search for help topics or questions…"
              value={searchQuery}
              onChange={handleSearch}
              onClear={handleClearSearch}
              className="shadow-lg"
            />
          </div>
        </div>

        {/* Quick Help Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Quick Help Categories</h2>
          <HelpCategories onCategoryClick={handleCategoryClick} />
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <FAQAccordion searchQuery={searchQuery} activeCategory={activeCategory} />
        </div>

        {/* Contact Support */}
        <div className="mb-12">
          <ContactSupport />
        </div>

        {/* Support Articles */}
        <div className="mb-12">
          <SupportArticles />
        </div>

        {/* Floating Help Button */}
        <FloatingHelpButton />
      </div>
    </PageLayout>
  );
};

export default Support;
