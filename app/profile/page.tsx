"use client"

import { useState } from 'react';
import { Settings, BarChart3, Grid3x3, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import VideoGrid from './VideoGrid';
import FeedHeader from '../feed/FeedHeader';

// Mock user data
const userProfile = {
  id: 1,
  name: 'John Doe',
  username: '@johndoe',
  bio: 'Content creator 🎬 | Travel enthusiast ✈️ | Coffee lover ☕',
  avatar: '/placeholder.svg',
  coverImage: '/placeholder.svg',
  verified: true,
  followers: 12500,
  following: 845,
  likes: 89200,
  location: 'New York, USA',
  website: 'johndoe.com',
  joinedDate: 'March 2023'
};

// Mock videos data
const userVideos = [
  {
    id: 1,
    thumbnail: '/placeholder.svg',
    duration: '0:45',
    views: 2400,
    likes: 156,
    title: 'Amazing sunset at the beach'
  },
  {
    id: 2,
    thumbnail: '/placeholder.svg',
    duration: '1:23',
    views: 1800,
    likes: 89,
    title: 'Quick cooking tip'
  },
  {
    id: 3,
    thumbnail: '/placeholder.svg',
    duration: '0:32',
    views: 3200,
    likes: 234,
    title: 'Street art downtown'
  },
  {
    id: 4,
    thumbnail: '/placeholder.svg',
    duration: '2:15',
    views: 5600,
    likes: 412,
    title: 'Morning workout routine'
  },
  {
    id: 5,
    thumbnail: '/placeholder.svg',
    duration: '0:58',
    views: 1200,
    likes: 67,
    title: 'Coffee brewing tips'
  },
  {
    id: 6,
    thumbnail: '/placeholder.svg',
    duration: '1:45',
    views: 2800,
    likes: 189,
    title: 'City night photography'
  }
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState('videos');

  return (
    <div className="min-h-screen bg-background">
      <FeedHeader />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <ProfileHeader user={userProfile} />
        
        {/* Profile Stats */}
        <ProfileStats user={userProfile} />
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-8">
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-none"
          >
            Edit Profile
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="shrink-0"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="shrink-0"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Grid3x3 className="h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="liked" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Liked
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Saved
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="mt-6">
            <VideoGrid videos={userVideos} />
          </TabsContent>
          
          <TabsContent value="liked" className="mt-6">
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Liked videos will appear here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="mt-6">
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Saved videos will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;