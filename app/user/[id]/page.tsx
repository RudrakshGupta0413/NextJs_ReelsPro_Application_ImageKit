"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Video as VideoIcon, ImageIcon, Heart, Bookmark } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "@/app/profile/ProfileHeader";
import ProfileStats from "@/app/profile/ProfileStats";
import FeedHeader from "@/app/feed/FeedHeader";
import FeedCard from "@/app/feed/FeedCard";
import type { PostType } from "@/app/feed/types";

const PublicProfile = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState("videos");
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<PostType[]>([]);

    useEffect(() => {
        if (!id) return;

        async function fetchData() {
            try {
                const [resUser, resVideos] = await Promise.all([
                    fetch(`/api/user/${id}`),
                    fetch(`/api/user/${id}/videos`),
                ]);

                if (resUser.ok) {
                    setUser(await resUser.json());
                }
                if (resVideos.ok) {
                    setPosts(await resVideos.json());
                }
            } catch (error) {
                console.log("Failed to load user profile", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    // Derived: filter posts by type
    const videoPosts = posts.filter((p) => p.type === "video");
    const imagePosts = posts.filter((p) => p.type === "image");

    return (
        <div className="min-h-screen bg-background">
            <FeedHeader />

            {loading ? (
                /* ── Skeleton Loading UI ── */
                <main className="max-w-5xl mx-auto px-4 py-6 animate-pulse">
                    <div className="h-48 sm:h-64 bg-muted rounded-xl mb-4" />
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
                    <div className="flex items-center justify-around py-6 border-y border-border mb-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="text-center space-y-2">
                                <div className="h-6 w-12 bg-muted rounded mx-auto" />
                                <div className="h-3 w-16 bg-muted rounded mx-auto" />
                            </div>
                        ))}
                    </div>
                    <div className="h-9 w-full bg-muted rounded-lg mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-64 bg-muted rounded-lg" />
                        ))}
                    </div>
                </main>
            ) : !user ? (
                <main className="max-w-5xl mx-auto px-4 py-20 text-center">
                    <p className="text-muted-foreground text-lg">User not found.</p>
                </main>
            ) : (
                /* ── Actual Content (Read-Only) ── */
                <main className="max-w-5xl mx-auto px-4 py-6">
                    {/* Profile Header */}
                    <ProfileHeader user={user} />

                    {/* Profile Stats */}
                    <ProfileStats user={user} />

                    {/* Content Tabs — NO edit/settings buttons for public profile */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="videos" className="flex items-center gap-2">
                                <VideoIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Videos</span>
                            </TabsTrigger>
                            <TabsTrigger value="images" className="flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Images</span>
                            </TabsTrigger>
                            <TabsTrigger value="all" className="flex items-center gap-2">
                                <Bookmark className="h-4 w-4" />
                                <span className="hidden sm:inline">All Posts</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="videos" className="mt-6">
                            <FeedCard feedposts={videoPosts} layout="grid" />
                        </TabsContent>

                        <TabsContent value="images" className="mt-6">
                            <FeedCard feedposts={imagePosts} layout="grid" />
                        </TabsContent>

                        <TabsContent value="all" className="mt-6">
                            <FeedCard feedposts={posts} layout="grid" />
                        </TabsContent>
                    </Tabs>
                </main>
            )}
        </div>
    );
};

export default PublicProfile;
