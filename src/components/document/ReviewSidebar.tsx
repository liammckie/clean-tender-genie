
import { MessageSquare, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Review {
  id: string;
  type: 'comment' | 'suggestion' | 'issue' | 'info';
  title: string;
  content: string;
  timestamp: string;
  resolved: boolean;
  author: string;
}

interface ReviewSidebarProps {
  documentId?: string;
}

const ReviewSidebar = ({ }: ReviewSidebarProps) => {
  // Mock data for demonstration
  const mockReviews: Review[] = [
    {
      id: '1',
      type: 'suggestion',
      title: 'Compliance Enhancement',
      content: 'Consider adding more specific references to Australian WHS standards in section 3.2.',
      timestamp: '2024-01-15T10:30:00Z',
      resolved: false,
      author: 'Legal Team'
    },
    {
      id: '2',
      type: 'comment',
      title: 'Pricing Review',
      content: 'The pricing structure looks competitive. Good work on the breakdown.',
      timestamp: '2024-01-15T09:15:00Z',
      resolved: true,
      author: 'Finance Team'
    },
    {
      id: '3',
      type: 'issue',
      title: 'Missing Information',
      content: 'Certificate numbers are missing from the qualification section.',
      timestamp: '2024-01-15T08:45:00Z',
      resolved: false,
      author: 'Operations Team'
    }
  ];

  const getIcon = (type: Review['type']) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'suggestion':
        return <Info className="h-4 w-4" />;
      case 'issue':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getBadgeVariant = (type: Review['type'], resolved: boolean) => {
    if (resolved) return 'secondary';
    switch (type) {
      case 'issue':
        return 'destructive';
      case 'suggestion':
        return 'outline';
      case 'comment':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-white">Reviews & Comments</h3>
      
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-4">
          {mockReviews.map((review) => (
            <Card key={review.id} className="bg-spotify-darkgray border-spotify-gray">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getIcon(review.type)}
                    <CardTitle className="text-sm text-white">{review.title}</CardTitle>
                  </div>
                  {review.resolved && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
                <CardDescription className="text-xs text-spotify-lightgray">
                  {review.author} • {new Date(review.timestamp).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-spotify-lightgray mb-2">{review.content}</p>
                <Badge variant={getBadgeVariant(review.type, review.resolved)} className="text-xs">
                  {review.resolved ? 'Resolved' : review.type.charAt(0).toUpperCase() + review.type.slice(1)}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ReviewSidebar;
