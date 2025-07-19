
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Post {
  id: number;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface InteractionPanelProps {
  post: Post;
  onLike: () => void;
  onBookmark: () => void;
}

const InteractionPanel = ({ post, onLike, onBookmark }: InteractionPanelProps) => {
  return (
    <div className="px-4 py-3 border-b border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            className={`flex items-center space-x-2 ${
              post.isLiked 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-muted-foreground hover:text-red-500'
            }`}
          >
            <Heart 
              className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`}
            />
            <span className="text-sm font-medium">{post.likes.toLocaleString()}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{post.comments}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-muted-foreground hover:text-primary"
          >
            <Share2 className="h-5 w-5" />
            <span className="text-sm font-medium">{post.shares}</span>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onBookmark}
          className={`${
            post.isBookmarked 
              ? 'text-blue-500 hover:text-blue-600' 
              : 'text-muted-foreground hover:text-blue-500'
          }`}
        >
          <Bookmark 
            className={`h-5 w-5 ${post.isBookmarked ? 'fill-current' : ''}`}
          />
        </Button>
      </div>
    </div>
  );
};

export default InteractionPanel;