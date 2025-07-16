// import VideoFeed from "@/components/VideoFeed";
// import { connectToDatabase } from "@/lib/db";
// import Video from "@/models/Video";

// export default async function FeedPage() {
//   await connectToDatabase();
//   const publicVideosRaw = await Video.find({ isPublic: true })
//     .sort({ createdAt: -1 })
//     .populate("uploadedBy", "name profilePicture")
//     .lean();

// const publicVideos = publicVideosRaw.map((video: any) => {
//   const uploadedBy = video.uploadedBy;

//   return {
//     _id: video._id.toString(),
//     title: video.title,
//     description: video.description,
//     videoUrl: video.videoUrl,
//     thumbnailUrl: video.thumbnailUrl,
//     isPublic: video.isPublic,
//     uploadedBy: uploadedBy
//       ? {
//           _id: uploadedBy._id?.toString?.() || "",
//           name: uploadedBy.name || "Unknown User",
//           profilePicture: uploadedBy.profilePicture || "",
//         }
//       : {
//           _id: "",
//           name: "Unknown User",
//           profilePicture: "",
//         },
//     createdAt: video.createdAt?.toString?.() || "",
//     updatedAt: video.updatedAt?.toString?.() || "",
//   };
// });

//  return (
//     <main className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Explore Public Videos</h1>
//       <VideoFeed videos={publicVideos} />
//     </main>
//   );

// }

"use client"

import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import FeedHeader from './FeedHeader';
import InteractionPanel from './InteractionPanel';
 import VideoPlayer from './VideoPlayer';

// Mock data for the feed
const feedData = [
  {
    id: 1,
    user: {
      name: 'Alex Johnson',
      username: '@alexj',
      avatar: '/placeholder.svg',
      verified: true
    },
    video: {
      url: '/placeholder.svg',
      thumbnail: '/placeholder.svg',
      duration: '0:45'
    },
    caption: 'Amazing sunset at the beach! 🌅 #nature #sunset #peaceful',
    likes: 1247,
    comments: 89,
    shares: 23,
    timestamp: '2h ago',
    isLiked: false,
    isBookmarked: false
  },
  {
    id: 2,
    user: {
      name: 'Sarah Chen',
      username: '@sarahc',
      avatar: '/placeholder.svg',
      verified: false
    },
    video: {
      url: '/placeholder.svg',
      thumbnail: '/placeholder.svg',
      duration: '1:23'
    },
    caption: 'Quick cooking tip: How to make perfect pasta every time! 🍝',
    likes: 892,
    comments: 156,
    shares: 45,
    timestamp: '4h ago',
    isLiked: true,
    isBookmarked: true
  },
  {
    id: 3,
    user: {
      name: 'Mike Rodriguez',
      username: '@mikerodz',
      avatar: '/placeholder.svg',
      verified: true
    },
    video: {
      url: '/placeholder.svg',
      thumbnail: '/placeholder.svg',
      duration: '0:32'
    },
    caption: 'Street art in downtown! The talent is incredible 🎨 #streetart #urban',
    likes: 2156,
    comments: 234,
    shares: 67,
    timestamp: '6h ago',
    isLiked: false,
    isBookmarked: false
  }
];

const Feed = () => {
  const [posts, setPosts] = useState(feedData);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleBookmark = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <FeedHeader />
      
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="border-border bg-card overflow-hidden">
            {/* Post Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <img 
                      src={post.user.avatar} 
                      alt={post.user.name}
                      className="rounded-full object-cover"
                    />
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-foreground">{post.user.name}</span>
                      {post.user.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{post.user.username} • {post.timestamp}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Video Player */}
            <VideoPlayer 
              thumbnail={post.video.thumbnail}
              duration={post.video.duration}
            />

            {/* Interaction Panel */}
            <InteractionPanel
              post={post}
              onLike={() => handleLike(post.id)}
              onBookmark={() => handleBookmark(post.id)}
            />

            {/* Caption */}
            <div className="px-4 pb-4">
              <p className="text-foreground leading-relaxed">{post.caption}</p>
            </div>
          </Card>
        ))}
      </main>
    </div>
  );
};

export default Feed;
