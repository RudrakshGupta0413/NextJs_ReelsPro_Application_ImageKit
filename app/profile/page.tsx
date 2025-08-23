"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Grid3x3,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import VideoGrid from "./VideoGrid";
import FeedHeader from "../feed/FeedHeader";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("videos");
  const [user, setUser] = useState<any>(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const resUser = await fetch("/api/user/profile");
        const dataUser = await resUser.json();
        setUser(dataUser);

        const resVideos = await fetch("/api/videos");
        const dataVideos = await resVideos.json();
        setVideos(dataVideos);
      } catch (error) {
        console.log("Failed to load profile", error);
      }
    }
    fetchData();
  }, []);

  if (!user) return <p className="text-center py-12">Loading Profile...</p>;

  return (
    <div className="min-h-screen bg-background">
      <FeedHeader />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Profile Stats */}
        <ProfileStats user={user} />

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="outline" className="flex-1 sm:flex-none">
            Edit Profile
          </Button>
          <Button variant="outline" size="icon" className="shrink-0">
            <Settings className="h-4 w-4" />
          </Button>
          {/* <Button variant="outline" size="icon" className="shrink-0">
            <BarChart3 className="h-4 w-4" />
          </Button> */}
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
            <VideoGrid videos={videos} />
          </TabsContent>

          <TabsContent value="liked" className="mt-6">
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Liked videos will appear here
              </p>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Saved videos will appear here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
