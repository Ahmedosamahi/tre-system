
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SearchBox } from '@/components/ui/SearchBox';
import { HelpCircle, MessageCircle, Mail, Search } from 'lucide-react';

export const FloatingHelpButton = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    {
      icon: MessageCircle,
      label: 'Live Chat',
      action: () => {
        // Integrate with chat service
        alert('Opening live chat...');
      }
    },
    {
      icon: Mail,
      label: 'Submit Ticket',
      action: () => {
        // Scroll to contact section
        const element = document.querySelector('[data-contact-support]');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
      }
    },
    {
      icon: Search,
      label: 'Search Help',
      action: () => {
        // Scroll to search section
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-shadow"
          >
            <HelpCircle className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" side="top" align="end">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600">
                Quick search or contact our support team
              </p>
            </div>

            {/* Quick Search */}
            <div>
              <SearchBox
                placeholder="Search help topics..."
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
                size="mini"
              />
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quick Actions
              </p>
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={action.action}
                >
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
