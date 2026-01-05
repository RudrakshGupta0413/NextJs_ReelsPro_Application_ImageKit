
import { Play, Eye, Heart } from 'lucide-react';

interface Video {
  _id: string;
  thumbnail: string;
  videoUrl: string;
  views?: number;
  likes: string[];
  title: string;
}

interface VideoGridProps {
  videos: Video[];
}

const VideoGrid = ({ videos }: VideoGridProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
      {videos.map((video) => (
        <div
          key={video._id}
          className="relative aspect-[9/16] bg-muted rounded-lg overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform duration-200"
        >
          {/* Thumbnail */}
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-200" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 rounded-full p-3 group-hover:scale-110 transition-transform duration-200">
              <Play className="h-6 w-6 text-white fill-current" />
            </div>
          </div>
          
          {/* Duration */}
          {/* <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div> */}
          
          {/* Stats */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <h3 className="text-white text-sm font-medium mb-2 line-clamp-2">
              {video.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-white/80">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{formatNumber(video.views || 0)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{formatNumber(video.likes.length)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;