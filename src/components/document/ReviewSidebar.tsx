
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X } from 'lucide-react';

interface ReviewComment {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  timestamp: string;
  text: string;
  resolved: boolean;
}

interface ReviewSidebarProps {
  documentId?: string;
}

const ReviewSidebar: React.FC<ReviewSidebarProps> = ({ documentId }) => {
  const [newComment, setNewComment] = useState('');
  
  // Mock comments - in a real app, fetch this from your backend
  const [comments, setComments] = useState<ReviewComment[]>([
    {
      id: '1',
      user: { name: 'John Smith', avatar: '' },
      timestamp: '10:30 AM',
      text: 'We should add more details about our WHS compliance in this section.',
      resolved: false,
    },
    {
      id: '2',
      user: { name: 'Sarah Jones', avatar: '' },
      timestamp: 'Yesterday',
      text: 'Please include our recent ISO certification here.',
      resolved: true,
    },
  ]);

  const addComment = () => {
    if (newComment.trim() === '') return;
    
    const comment: ReviewComment = {
      id: Date.now().toString(),
      user: { name: 'Current User' },
      timestamp: 'Just now',
      text: newComment,
      resolved: false,
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const toggleResolve = (id: string) => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, resolved: !comment.resolved } : comment
    ));
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="font-semibold mb-4">Review Comments</h2>
      
      <div className="mb-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[100px]"
        />
        <Button 
          onClick={addComment}
          className="mt-2 w-full"
        >
          Add Comment
        </Button>
      </div>
      
      <div className="flex-grow overflow-auto">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center">No comments yet</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div 
                key={comment.id}
                className={`p-3 border rounded-md ${
                  comment.resolved ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{comment.user.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{comment.timestamp}</span>
                </div>
                
                <p className={`text-sm mb-2 ${comment.resolved ? 'text-gray-500' : ''}`}>
                  {comment.text}
                </p>
                
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleResolve(comment.id)}
                  >
                    {comment.resolved ? (
                      <span className="flex items-center text-xs text-gray-500">
                        <X className="h-3 w-3 mr-1" /> Unresolve
                      </span>
                    ) : (
                      <span className="flex items-center text-xs text-green-600">
                        <Check className="h-3 w-3 mr-1" /> Resolve
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSidebar;
