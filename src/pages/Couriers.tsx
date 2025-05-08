
import React from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Store, MapPin, FileText, Plus, Pencil } from 'lucide-react';
import { CourierRow } from '@/components/couriers/CourierRow';
import { DetailSection } from '@/components/couriers/DetailSection';

// Sample courier data
const couriers = [
  {
    id: 1,
    name: 'Bosta',
    logo: '/lovable-uploads/b0a18c3a-a2ba-44c1-9a8f-9538ab3adf90.png',
  },
  {
    id: 2,
    name: 'Aramex',
    logo: '/lovable-uploads/43d72cbc-bb29-42a7-933a-b020049d73b2.png',
  },
  {
    id: 3,
    name: 'Mylerz',
    logo: '/lovable-uploads/d596548d-f4b9-4003-a6a9-e24cd0ab7e3c.png',
  },
  {
    id: 4,
    name: 'J&T',
    logo: '/lovable-uploads/9a486a82-ce61-4beb-8017-e0d55573ba2f.png',
    comingSoon: true
  },
  {
    id: 5,
    name: 'Egypt Post',
    logo: '',
    comingSoon: true
  }
];

const CouriersPage = () => {
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow">
          {couriers.map(courier => (
            <CourierRow key={courier.id} courier={courier} />
          ))}
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow">
          <DetailSection
            icon={<Store className="h-5 w-5" />}
            title="Store details"
            description="A few details about your store."
            action={
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 gap-1">
                <Pencil className="h-4 w-4" />
                Edit details
              </Button>
            }
            isExpandable={true}
          />
          
          <DetailSection
            icon={<MapPin className="h-5 w-5" />}
            title="Pickup locations"
            description="Manage your pick up locations."
            count="1/5"
            action={
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 gap-1">
                <Plus className="h-4 w-4" />
                Add pickup location
              </Button>
            }
            isExpandable={true}
          />
          
          <DetailSection
            icon={<FileText className="h-5 w-5" />}
            title="Terms and condition"
            description="Make sure to read the terms and conditions"
            isExpandable={false}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default CouriersPage;
