"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Video as VideoIcon,
  ImageIcon,
  Heart,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import FeedHeader from "../feed/FeedHeader";
import FeedCard from "../feed/FeedCard";
import Link from "next/link";
import type { PostType } from "../feed/types";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("videos");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadedPosts, setUploadedPosts] = useState<PostType[]>([]);
  const [likedPosts, setLikedPosts] = useState<PostType[]>([]);
  const [savedPosts, setSavedPosts] = useState<PostType[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const resUser = await fetch("/api/user/profile");
        const dataUser = await resUser.json();
        setUser(dataUser);

        // Parallel fetch all three feeds
        const [resUploaded, resLiked, resSaved] = await Promise.all([
          fetch("/api/videos/user"),
          fetch("/api/videos/user/liked"),
          fetch("/api/videos/user/saved"),
        ]);

        if (resUploaded.ok) {
          setUploadedPosts(await resUploaded.json());
        }
        if (resLiked.ok) {
          setLikedPosts(await resLiked.json());
        }
        if (resSaved.ok) {
          setSavedPosts(await resSaved.json());
        }
      } catch (error) {
        console.log("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Derived: filter uploaded posts by type
  const videoPosts = uploadedPosts.filter((p) => p.type === "video");
  const imagePosts = uploadedPosts.filter((p) => p.type === "image");

  return (
    <div className="min-h-screen bg-background">
      <FeedHeader />

      {loading ? (
        /* ── Skeleton Loading UI ── */
        <main className="max-w-5xl mx-auto px-4 py-6 animate-pulse">
          {/* Cover image skeleton */}
          <div className="h-48 sm:h-64 bg-muted rounded-xl mb-4" />

          {/* Avatar + name skeleton */}
          <div className="relative px-4 mb-6">
            <div className="absolute -top-20 left-4">
              <div className="h-40 w-40 rounded-full bg-muted border-4 border-background" />
            </div>
            <div className="pt-22 space-y-3">
              <div className="h-6 w-48 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-4 w-72 bg-muted rounded" />
            </div>
          </div>

          {/* Stats skeleton */}
          <div className="flex items-center justify-around py-6 border-y border-border mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center space-y-2">
                <div className="h-6 w-12 bg-muted rounded mx-auto" />
                <div className="h-3 w-16 bg-muted rounded mx-auto" />
              </div>
            ))}
          </div>

          {/* Buttons skeleton */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-9 w-28 bg-muted rounded" />
            <div className="h-9 w-9 bg-muted rounded" />
          </div>

          {/* Tabs skeleton */}
          <div className="h-9 w-full bg-muted rounded-lg mb-6" />

          {/* Grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-lg" />
            ))}
          </div>
        </main>
      ) : (
        /* ── Actual Content ── */
        <main className="max-w-5xl mx-auto px-4 py-6">
          {/* Profile Header */}
          <ProfileHeader user={user} />

          {/* Profile Stats */}
          <ProfileStats user={user} />

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-8">
            <Link href="/edit-profile">
              <Button variant="outline" className="flex-1 sm:flex-none hover:cursor-pointer">
                Edit Profile
              </Button>
            </Link>
            <Button variant="outline" size="icon" className="shrink-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <VideoIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Videos</span>
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Images</span>
              </TabsTrigger>
              <TabsTrigger value="liked" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Liked</span>
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                <span className="hidden sm:inline">Saved</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="mt-6">
              <FeedCard feedposts={videoPosts} layout="grid" />
            </TabsContent>

            <TabsContent value="images" className="mt-6">
              <FeedCard feedposts={imagePosts} layout="grid" />
            </TabsContent>

            <TabsContent value="liked" className="mt-6">
              <FeedCard feedposts={likedPosts} layout="grid" />
            </TabsContent>

            <TabsContent value="saved" className="mt-6">
              <FeedCard feedposts={savedPosts} layout="grid" />
            </TabsContent>
          </Tabs>
        </main>
      )}
    </div>
  );
};

export default Profile;
