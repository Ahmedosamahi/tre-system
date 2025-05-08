
import React, { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronRight, MapPin, FileText, Info } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Sample courier data
const couriers = [
  {
    id: 1,
    name: 'Aramex',
    logo: '/lovable-uploads/43d72cbc-bb29-42a7-933a-b020049d73b2.png',
    description: 'Leading international courier service with express delivery solutions for businesses and individuals.',
    pickupLocations: 3,
    termsUpdated: '2025-03-15'
  },
  {
    id: 2,
    name: 'Mylerz',
    logo: '/lovable-uploads/d596548d-f4b9-4003-a6a9-e24cd0ab7e3c.png',
    description: 'Egyptian logistics company specializing in last-mile delivery with a robust tracking system.',
    pickupLocations: 1,
    termsUpdated: '2025-04-01'
  },
  {
    id: 3,
    name: 'J&T',
    logo: '/lovable-uploads/9a486a82-ce61-4beb-8017-e0d55573ba2f.png',
    description: 'Fast-growing delivery service with extensive coverage across major cities.',
    pickupLocations: 2,
    termsUpdated: '2025-02-28'
  },
  {
    id: 4,
    name: 'Egypt Post',
    logo: '',
    description: 'National postal service with comprehensive coverage throughout Egypt.',
    pickupLocations: 5,
    termsUpdated: '2025-01-10'
  }
];

const CourierDetails = ({ courier }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Card className="mb-6">
      <div 
        className="flex items-center p-6 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CollapsibleTrigger className="flex items-center w-full" asChild>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              {courier.logo ? (
                <Avatar className="h-12 w-12">
                  <AvatarImage src={courier.logo} alt={courier.name} />
                  <AvatarFallback>{courier.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{courier.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              )}
              <h3 className="font-medium text-lg">{courier.name}</h3>
            </div>
            {isOpen ? <ChevronDown className="h-5 w-5 text-gray-400" /> : <ChevronRight className="h-5 w-5 text-gray-400" />}
          </div>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent>
        <Separator />
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Store Details */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-gray-500" /> Store Details
              </h4>
              <p className="text-gray-600">{courier.description}</p>
            </div>
            
            <Separator />
            
            {/* Pickup Locations */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" /> Pickup Locations
              </h4>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">{courier.pickupLocations} location{courier.pickupLocations !== 1 ? 's' : ''} configured</p>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </div>
            
            <Separator />
            
            {/* Terms and Conditions */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" /> Terms and Conditions
              </h4>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Last updated: {new Date(courier.termsUpdated).toLocaleDateString()}</p>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                  Review
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </CollapsibleContent>
    </Card>
  );
};

const CouriersPage = () => {
  return (
    <PageLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Bosta</h1>
          <p className="text-gray-600 mt-1">Manage your integrated courier services</p>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {couriers.map(courier => (
            <div 
              key={courier.id}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium"
            >
              {courier.name}
            </div>
          ))}
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Courier Services</h2>
          <Collapsible className="w-full">
            {couriers.map(courier => (
              <CourierDetails key={courier.id} courier={courier} />
            ))}
          </Collapsible>
        </div>
      </div>
    </PageLayout>
  );
};

export default CouriersPage;
