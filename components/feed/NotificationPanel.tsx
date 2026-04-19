"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { 
  Heart, 
  MessageSquare, 
  UserPlus, 
  Share2, 
  Video, 
  Clock, 
  X,
  CheckCircle2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher-client";

interface Notification {
  _id: string;
  recipient: string;
  sender: {
    _id: string;
    name: string;
    username: string;
    profilePicture: string;
  };
  type: string;
  videoId?: {
    _id: string;
    caption: string;
    thumbnailUrl: string;
  };
  content?: string;
  isRead: boolean;
  createdAt: string;
  othersCount?: number;
  senders?: any[];
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadUpdate: (count: number) => void;
}

export default function NotificationPanel({ isOpen, onClose, onUnreadUpdate }: NotificationPanelProps) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        const unread = data.filter((n: Notification) => !n.isRead).length;
        onUnreadUpdate(unread);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    if (session?.user?.id && pusherClient) {
      const channel = pusherClient.subscribe(`user-${session.user.id}`);
      
      channel.bind("new-notification", (newNotif: Notification) => {
        setNotifications(prev => [newNotif, ...prev]);
        onUnreadUpdate(notifications.filter(n => !n.isRead).length + 1);
      });

      return () => {
        pusherClient.unsubscribe(`user-${session.user.id}`);
      };
    }
  }, [session?.user?.id]);

  const markAsRead = async (id?: string) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        body: JSON.stringify({ 
          notificationId: id,
          markAll: !id 
        }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        if (!id) {
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
          onUnreadUpdate(0);
        } else {
          setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
          const unread = notifications.filter(n => !n.isRead && n._id !== id).length;
          onUnreadUpdate(unread);
        }
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const getNotificationConfig = (type: string, othersCount?: number) => {
    switch (type) {
      case "LIKE":
        return {
          icon: <Heart className="w-4 h-4 text-red-500 fill-red-500" />,
          bg: "bg-red-50",
          text: (name: string) => othersCount ? `${name} and ${othersCount} others liked your post` : `${name} liked your post`
        };
      case "COMMENT":
        return {
          icon: <MessageSquare className="w-4 h-4 text-blue-500" />,
          bg: "bg-blue-50",
          text: (name: string) => `${name} commented on your post`
        };
      case "FOLLOW":
        return {
          icon: <UserPlus className="w-4 h-4 text-purple-500" />,
          bg: "bg-purple-50",
          text: (name: string) => `${name} started following you`
        };
      case "SHARE":
        return {
          icon: <Share2 className="w-4 h-4 text-green-500" />,
          bg: "bg-green-50",
          text: (name: string) => `${name} shared your post`
        };
      case "NEW_POST":
        return {
          icon: <Video className="w-4 h-4 text-orange-500" />,
          bg: "bg-orange-50",
          text: (name: string) => `${name} uploaded a new video`
        };
      case "MESSAGE":
        return {
          icon: <MessageSquare className="w-4 h-4 text-indigo-500" />,
          bg: "bg-indigo-50",
          text: (name: string) => `New message from ${name}`
        };
      default:
        return {
          icon: <Clock className="w-4 h-4 text-gray-500" />,
          bg: "bg-gray-50",
          text: (name: string) => `${name} interacted with you`
        };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="absolute right-0 mt-2 w-80 md:w-96 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/40 overflow-hidden z-[100]"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-purple-50/50">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              Notifications
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </h3>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => markAsRead()}
                className="text-xs text-blue-600 hover:text-blue-700 underline font-medium cursor-pointer"
              >
                Mark all as read
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-gray-400">
                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                Loading alerts...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notif) => {
                  const config = getNotificationConfig(notif.type, notif.othersCount);
                  return (
                    <motion.div
                      key={notif._id}
                      initial={{ backgroundColor: notif.isRead ? "transparent" : "rgba(59, 130, 246, 0.05)" }}
                      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                      className={`relative flex items-start gap-3 p-4 transition-colors ${notif.isRead ? "" : "bg-blue-50/30"}`}
                      onClick={() => markAsRead(notif._id)}
                    >
                      <div className="relative flex-shrink-0">
                        <Link href={`/profile/${notif.sender._id}`}>
                          <Image
                            src={notif.sender.profilePicture || "/default-avatar.jpg"}
                            alt={notif.sender.name}
                            width={44}
                            height={44}
                            className="rounded-full object-cover border border-white shadow-sm hover:scale-105 transition-transform"
                          />
                        </Link>
                        <div className={`absolute -bottom-1 -right-1 ${config.bg} ${config.icon.props.className.includes("text-") ? "" : "bg-gray-100"} p-1 rounded-full border border-white shadow-sm`}>
                          {config.icon}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 leading-snug">
                          <span className="font-bold hover:underline cursor-pointer">
                            {notif.sender.name}
                          </span>
                          {" "}
                          {config.text("")}
                          {notif.content && (
                            <span className="block mt-1 text-xs text-gray-500 italic line-clamp-1">
                              &quot;{notif.content}&quot;
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </p>
                      </div>

                      {notif.videoId && (
                        <div className="flex-shrink-0 w-12 h-12 relative rounded-md overflow-hidden border border-gray-100">
                          <Image
                            src={notif.videoId.thumbnailUrl || "/placeholder-video.jpg"}
                            alt="Post"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {!notif.isRead && (
                        <div className="absolute top-4 right-2 w-2 h-2 bg-blue-600 rounded-full" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
            <Link href="/notifications" className="text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors uppercase tracking-wider">
              See all activity
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
