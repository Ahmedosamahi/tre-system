
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/Order';

interface TagsSectionProps {
  order: Order;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const TagsSection: React.FC<TagsSectionProps> = ({
  order,
  onUpdateOrder
}) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (!newTag.trim() || order.tags.includes(newTag.trim())) return;

    const updatedOrder = {
      ...order,
      tags: [...order.tags, newTag.trim()]
    };

    onUpdateOrder(updatedOrder);
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedOrder = {
      ...order,
      tags: order.tags.filter(tag => tag !== tagToRemove)
    };

    onUpdateOrder(updatedOrder);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Tags</h3>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            className="flex-1"
          />
          <Button
            onClick={handleAddTag}
            disabled={!newTag.trim()}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {order.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
