"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, UserPlus, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing?: boolean;
  onStatusChange?: (isFollowing: boolean) => void;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
}

export default function FollowButton({
  targetUserId,
  initialIsFollowing = false,
  onStatusChange,
  variant = "default",
  size = "default",
  className,
  showIcon = true,
}: FollowButtonProps) {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const isOwnAccount = session?.user?.id === targetUserId;

  // Check initial follow status from current user's profile
  useEffect(() => {
    async function checkStatus() {
      if (!session?.user?.id || isOwnAccount) {
        setIsChecking(false);
        return;
      }
      try {
        const res = await fetch("/api/user/profile");
        const userData = await res.json();
        if (userData.following) {
          setIsFollowing(userData.following.includes(targetUserId));
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      } finally {
        setIsChecking(false);
      }
    }
    checkStatus();
  }, [session, targetUserId, isOwnAccount]);

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Please sign in to follow users");
      return;
    }

    if (isOwnAccount) return;

    setIsLoading(true);
    // Optimistic Update
    const previousState = isFollowing;
    setIsFollowing(!previousState);

    try {
      const res = await fetch("/api/user/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });

      if (!res.ok) throw new Error("Failed to follow/unfollow");

      const data = await res.json();
      setIsFollowing(data.following);
      if (onStatusChange) onStatusChange(data.following);
      
      toast.success(data.following ? "Following!" : "Unfollowed");
    } catch (_error) {
      setIsFollowing(previousState);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isOwnAccount || (isChecking && !initialIsFollowing)) return null;

  return (
    <Button
      onClick={handleFollow}
      disabled={isLoading}
      variant={isFollowing ? "outline" : variant}
      size={size}
      className={cn(
        "font-semibold transition-all duration-300",
        !isFollowing && variant === "default" && "bg-blue-600 hover:bg-blue-700 text-white shadow-md",
        isFollowing && "border-slate-200 text-slate-600 hover:bg-slate-50",
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <>
          {showIcon && <UserCheck className="mr-2 h-4 w-4" />}
          Following
        </>
      ) : (
        <>
          {showIcon && <UserPlus className="mr-2 h-4 w-4" />}
          Follow
        </>
      )}
    </Button>
  );
}
