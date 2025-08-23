import { MapPin, Link as LinkIcon, Calendar } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
  followers?: number;
  following?: number;
  likes?: number;
  createdAt: string;
}

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <div className="relative mb-6">
      {/* Cover Image */}
      <div className="h-48 sm:h-64 bg-gradient-to-r from-slate-600 to-blue-600 rounded-xl overflow-hidden mb-4">
        <img
          src={user.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Info */}
      <div className="relative px-4">
        {/* Avatar */}
        <div className="absolute -top-16 left-4">
          <Avatar className="h-24 w-24 border-4 border-background bg-background">
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback className="text-lg font-semibold">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* User Details */}
        <div className="pt-12">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            {user.verified && (
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>

          <p className="text-muted-foreground mb-3">{user.username}</p>

          {user.bio && (
            <p className="text-foreground leading-relaxed mb-4 max-w-2xl">
              {user.bio}
            </p>
          )}

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
    </div>
  );
};

export default ProfileHeader;
