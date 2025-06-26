
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types/Order';

interface CommentsSectionProps {
  order: Order;
  onOrderUpdate: (updatedOrder: Order) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  order,
}) => {
  const [newComment, setNewComment] = useState('');
  const [comments] = useState([
    {
      text: 'Customer requested expedited delivery',
      timestamp: '2025-05-07 11:45 AM',
      user: 'Sara Ali',
    },
  ]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Here you would typically update the order with the new comment
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {comments.map((comment, index) => (
            <div key={index} className="border-l-2 border-gray-200 pl-4">
              <p className="text-sm">{comment.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {comment.timestamp} by {comment.user}
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
            Add Comment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
