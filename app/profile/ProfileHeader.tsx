import { MapPin, Link as LinkIcon, Calendar, Sparkles } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import AIBioGenerator from "@/components/AIBioGenerator";
import { Button } from "@/components/ui/button";
import FollowButton from "@/components/FollowButton";

interface User {
  _id: string;
  name: string;
  username: string;
  bio?: string;
  profilePicture?: string;
  coverImage?: string;
  verified?: boolean;
  location?: string;
  website?: string;
  followers?: string[];
  following?: string[];
  likes?: number;
  createdAt: string;
}

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader = ({ user: initialUser }: ProfileHeaderProps) => {
  const { data: session } = useSession();
  const [user, setUser] = useState(initialUser);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const isOwnProfile = session?.user?.id === user._id;

  const handleBioSelect = async (newBio: string) => {
    try {
      const formData = new FormData();
      formData.append("bio", newBio);
      // We must send other required fields too if the API expects them, 
      // but usually PATCH only updates what's sent. 
      // Based on app/edit-profile/page.tsx, it sends everything.
      // Let's try a minimal PATCH or check the API.
      
      const res = await fetch("/api/user/editprofile", {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update bio");
      
      setUser(prev => ({ ...prev, bio: newBio }));
      toast.success("Bio updated successfully!");
    } catch (error) {
      toast.error("Failed to update bio");
      console.error(error);
    }
  };
  return (
    <div className="relative mb-6">
      {/* Cover Image */}
      <div className="h-48 sm:h-64 bg-gradient-to-r from-slate-600 to-blue-600 rounded-xl overflow-hidden mb-4">
        <img
          src={
            user.coverImage && user.coverImage.trim() !== ""
              ? user.coverImage
              : "/default-cover.jpg"
          }
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Info */}
      <div className="relative px-4">
        {/* Avatar */}
        <div className="absolute -top-20 left-4">
          <Avatar className="h-40 w-40 border-4 border-background bg-background">
            <AvatarImage
              src={
                user.profilePicture && user.profilePicture.trim() !== ""
                  ? user.profilePicture
                  : "/default-avatar.jpg"
              }
              alt={user.name}
            />
            <AvatarFallback className="text-lg font-semibold">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Action Buttons (Follow) */}
        {!isOwnProfile && (
          <div className="absolute -top-2 right-6">
            <FollowButton 
              targetUserId={user._id} 
              onStatusChange={(isFollowing) => {
                setUser(prev => ({
                  ...prev,
                  followers: isFollowing 
                    ? [...(prev.followers || []), session?.user?.id as string]
                    : (prev.followers || []).filter(id => id !== session?.user?.id)
                }));
              }}
            />
          </div>
        )}

        {/* User Details */}
        <div className="pt-22">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            {user.verified && (
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>

          <p className="text-muted-foreground mb-3">{user.username}</p>

          <div className="relative group max-w-2xl">
            {user.bio ? (
              <p className="text-foreground leading-relaxed mb-4">
                {user.bio}
              </p>
            ) : isOwnProfile ? (
              <p className="text-muted-foreground italic mb-4">
                No bio yet. Add one with AI!
              </p>
            ) : null}

            {isOwnProfile && (
              <div className="absolute -right-12 top-0 transition-all duration-300">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAIGeneratorOpen(true)}
                  className="h-8 w-8 p-0 rounded-full bg-slate-50 text-blue-600 group-hover:bg-blue-100 group-hover:scale-110 transition-all"
                  title="Edit bio with AI"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {user.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{user.location}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                <a
                  href={`https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {user.website}
                </a>
              </div>
            )}
            {user.createdAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <AIBioGenerator
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
        onSelect={handleBioSelect}
        currentBio={user.bio}
      />
    </div>
  );
};

export default ProfileHeader;
