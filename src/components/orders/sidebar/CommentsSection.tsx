
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Order } from '@/types/Order';

interface CommentsSectionProps {
  order: Order;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  order,
  onUpdateOrder
}) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      text: newComment,
      timestamp: new Date().toISOString(),
      userId: 'current-user-id',
      userName: 'Current User'
    };

    const updatedOrder = {
      ...order,
      comments: [...order.comments, comment]
    };

    onUpdateOrder(updatedOrder);
    setNewComment('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-b pb-2">Comments</h3>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 min-h-[80px]"
          />
          <Button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {order.comments.map((comment) => (
            <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm">{comment.text}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(comment.timestamp).toLocaleString()} by {comment.userName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
