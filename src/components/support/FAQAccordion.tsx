
import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQAccordionProps {
  searchQuery: string;
  activeCategory: string | null;
}

const faqData: FAQItem[] = [
  {
    id: 'gs-1',
    question: 'How do I create my first order?',
    answer: 'To create your first order, navigate to the Orders page and click "Create New Order". Fill in the pickup and delivery details, select your preferred courier, and submit the order.',
    category: 'getting-started'
  },
  {
    id: 'gs-2',
    question: 'How do I track my shipments?',
    answer: 'You can track your shipments in real-time from the Dashboard or Orders page. Each order has a tracking number and status updates.',
    category: 'getting-started'
  },
  {
    id: 'sd-1',
    question: 'What are the delivery timeframes?',
    answer: 'Standard delivery is 1-3 business days within the same city, and 3-5 business days for intercity deliveries. Express options are available for faster delivery.',
    category: 'shipping-delivery'
  },
  {
    id: 'sd-2',
    question: 'Can I schedule a pickup time?',
    answer: 'Yes, you can schedule pickup times when creating an order. We offer flexible pickup windows to accommodate your schedule.',
    category: 'shipping-delivery'
  },
  {
    id: 'fb-1',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, bank transfers, and digital wallets. You can manage your payment methods in the Settings page.',
    category: 'financial-billing'
  },
  {
    id: 'fb-2',
    question: 'How do I view my invoices?',
    answer: 'All invoices are available in the Financial section of your dashboard. You can download PDF copies and set up automatic billing.',
    category: 'financial-billing'
  },
  {
    id: 'ti-1',
    question: 'The dashboard is loading slowly, what should I do?',
    answer: 'Try refreshing the page or clearing your browser cache. If the issue persists, check your internet connection or contact our support team.',
    category: 'technical-issues'
  },
  {
    id: 'ti-2',
    question: 'I cannot upload files, what\'s wrong?',
    answer: 'Ensure your files are under 10MB and in supported formats (PDF, JPG, PNG). Check your browser permissions for file uploads.',
    category: 'technical-issues'
  },
  {
    id: 'as-1',
    question: 'How do I change my password?',
    answer: 'Go to Settings > Account Security to change your password. We recommend using a strong password with at least 8 characters.',
    category: 'account-settings'
  },
  {
    id: 'as-2',
    question: 'How do I update my company information?',
    answer: 'Company details can be updated in Settings > Company Profile. Changes may require verification for security purposes.',
    category: 'account-settings'
  }
];

export const FAQAccordion = ({ searchQuery, activeCategory }: FAQAccordionProps) => {
  const [feedback, setFeedback] = useState<{ [key: string]: 'helpful' | 'not-helpful' | null }>({});

  const handleFeedback = (questionId: string, type: 'helpful' | 'not-helpful') => {
    setFeedback(prev => ({ ...prev, [questionId]: type }));
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !activeCategory || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const groupedFAQs = filteredFAQs.reduce((groups, faq) => {
    if (!groups[faq.category]) {
      groups[faq.category] = [];
    }
    groups[faq.category].push(faq);
    return groups;
  }, {} as { [key: string]: FAQItem[] });

  const categoryTitles = {
    'getting-started': 'Getting Started',
    'shipping-delivery': 'Shipping & Delivery',
    'financial-billing': 'Financial & Billing',
    'technical-issues': 'Technical Issues',
    'account-settings': 'Account & Settings'
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Frequently Asked Questions</h2>
      
      {Object.entries(groupedFAQs).map(([category, faqs]) => (
        <div key={category} id={category} className="scroll-mt-20">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            {categoryTitles[category as keyof typeof categoryTitles]}
          </h3>
          
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium text-gray-800">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  <p className="mb-4">{faq.answer}</p>
                  
                  <div className="flex items-center gap-4 pt-2 border-t">
                    <span className="text-sm text-gray-500">Was this helpful?</span>
                    <div className="flex gap-2">
                      <Button
                        variant={feedback[faq.id] === 'helpful' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleFeedback(faq.id, 'helpful')}
                        className="flex items-center gap-1"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        Yes
                      </Button>
                      <Button
                        variant={feedback[faq.id] === 'not-helpful' ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => handleFeedback(faq.id, 'not-helpful')}
                        className="flex items-center gap-1"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        No
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
      
      {filteredFAQs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No FAQs found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};
