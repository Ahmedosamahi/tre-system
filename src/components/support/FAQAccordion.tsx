
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
    id: 'om-1',
    question: 'How do I create a new shipping order?',
    answer: 'Navigate to the Orders page and click "Create New Order". Fill in pickup and delivery details, select your courier, and submit. The smart auto-fill feature will help populate fields when you enter Order Numbers or AWB numbers.',
    category: 'order-management'
  },
  {
    id: 'om-2',
    question: 'How do I track my orders in real-time?',
    answer: 'Use the Dashboard or Orders page to view real-time tracking. Each order shows current status, estimated delivery time, and courier information. You can also set up automatic notifications.',
    category: 'order-management'
  },
  {
    id: 'om-3',
    question: 'What is the AWB number and why is it important?',
    answer: 'AWB (Air Waybill) is a unique tracking number for your shipment. It helps identify and track packages throughout the delivery process. Enter it during order creation for better tracking.',
    category: 'order-management'
  },
  {
    id: 'si-1',
    question: 'My shipment is delayed, what should I do?',
    answer: 'Check the tracking status on your Orders page. If delayed beyond expected time, create a support ticket in the CRM Customer Service section with your Order Number or AWB for investigation.',
    category: 'shipment-issues'
  },
  {
    id: 'si-2',
    question: 'How do I report damaged or lost shipments?',
    answer: 'Go to CRM Customer Service > Create New Ticket. Select "Damaged Goods" or "Lost Shipment" as the issue type. The system will auto-fill order details when you provide the Order Number or AWB.',
    category: 'shipment-issues'
  },
  {
    id: 'si-3',
    question: 'How do I handle incorrect customer information?',
    answer: 'Create a ticket in CRM Customer Service with issue type "Incorrect Customer Information". Include the correct details and our team will update the shipping information.',
    category: 'shipment-issues'
  },
  {
    id: 'int-1',
    question: 'How do I integrate with shipping companies?',
    answer: 'Visit Settings > Integrations to connect with supported shipping companies. Each integration provides real-time tracking, automated label generation, and rate calculations.',
    category: 'integrations'
  },
  {
    id: 'int-2',
    question: 'Can I use the API for custom integrations?',
    answer: 'Yes, our REST API allows custom integrations. Access API documentation in Settings > API Management. Use your API key for authentication and webhook endpoints for real-time updates.',
    category: 'integrations'
  },
  {
    id: 'fb-1',
    question: 'How do COD payments work?',
    answer: 'COD (Cash on Delivery) payments are collected by the courier and transferred to your account. Track COD collections in the Financial section and set up automatic settlements.',
    category: 'financial-billing'
  },
  {
    id: 'fb-2',
    question: 'Where can I view financial reports?',
    answer: 'Access comprehensive financial reports in the Financial section. View revenue analytics, payment summaries, and download detailed reports for accounting purposes.',
    category: 'financial-billing'
  },
  {
    id: 'ti-1',
    question: 'The platform is running slowly, what should I do?',
    answer: 'Clear your browser cache and cookies. Ensure you have a stable internet connection. If issues persist, check our status page or contact support.',
    category: 'technical-issues'
  },
  {
    id: 'ti-2',
    question: 'I\'m getting API errors, how do I troubleshoot?',
    answer: 'Check your API key validity in Settings > API Management. Ensure proper authentication headers and review API documentation for correct endpoint usage.',
    category: 'technical-issues'
  },
  {
    id: 'as-1',
    question: 'How do I manage user permissions?',
    answer: 'Admin users can manage permissions in Settings > User Management. Assign roles like Admin, Manager, or Operator with appropriate access levels.',
    category: 'account-settings'
  },
  {
    id: 'as-2',
    question: 'How do I configure notification preferences?',
    answer: 'Go to Settings > Notifications to customize email and SMS alerts for order updates, delivery confirmations, and system notifications.',
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
    'order-management': 'Order Management',
    'shipment-issues': 'Shipment Issues',
    'integrations': 'Integrations',
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
