"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, SquarePen, Search, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { pusherClient } from "@/lib/pusher-client";
import UserSearchModal from "./UserSearchModal";

interface Participant {
  _id: string;
  name: string;
  username: string;
  profilePicture: string;
}

interface Conversation {
  _id: string;
  participants: Participant[];
  lastMessage?: {
    content: string;
    createdAt: string;
    sender: string;
  };
  unreadCounts: Record<string, number>;
  updatedAt: string;
}

export default function FloatingChatBar() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();

    if (session?.user?.id && pusherClient) {
      const channel = pusherClient.subscribe(`user-${session.user.id}`);
      channel.bind("conversation-update", () => {
        fetchConversations();
      });

      return () => {
        pusherClient.unsubscribe(`user-${session.user.id}`);
      };
    }
  }, [session?.user?.id]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isPanelOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isPanelOpen, isSearchOpen]);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/conversations?limit=10");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Failed to fetch floating chats", error);
    } finally {
      setLoading(false);
    }
  };

  const getOtherParticipant = (participants: Participant[]) => {
    return participants.find((p) => p._id !== session?.user?.id);
  };

  const totalUnread = conversations.reduce((acc, conv) => {
    return acc + (conv.unreadCounts?.[session?.user?.id || ""] || 0);
  }, 0);

  if (!session) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-0 right-0 w-[360px] h-[520px] bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/40 overflow-hidden flex flex-col"
          >
            {/* Panel Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
              <h3 className="font-bold text-gray-900 ml-1">Messages</h3>
              <div className="flex items-center gap-1">
                <Link
                  href="/direct"
                  className="p-2 hover:bg-white/50 rounded-full transition-all text-gray-500 hover:text-blue-600 cursor-pointer"
                  title="Expand to full view"
                >
                  <Maximize2 className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="p-2 hover:bg-white/50 rounded-full transition-all text-gray-500 hover:text-red-500 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <MessageSquare className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">No messages yet</p>
                    <p className="text-xs text-gray-500 mt-1">Start a chat with a creator</p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const otherUser = getOtherParticipant(conv.participants);
                  const unreadCount = conv.unreadCounts?.[session?.user?.id || ""] || 0;
                  if (!otherUser) return null;

                  return (
                    <Link
                      key={conv._id}
                      href={`/direct/t/${conv._id}`}
                      className="flex items-center gap-3 p-4 hover:bg-blue-50/30 transition-all border-b border-gray-50/50 cursor-pointer"
                    >
                      <div className="relative">
                        <Image
                          src={otherUser.profilePicture || "/default-avatar.jpg"}
                          alt={otherUser.username}
                          width={48}
                          height={48}
                          className="rounded-full object-cover aspect-square border border-white shadow-sm"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="font-semibold text-sm text-gray-900 truncate">{otherUser.name}</span>
                            {conv.lastMessage && (
                                <span className="text-[10px] text-gray-400 shrink-0">
                                    {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: false })}
                                </span>
                            )}
                        </div>
                        <p className={`text-xs truncate ${unreadCount > 0 ? "font-bold text-gray-900" : "text-gray-500"}`}>
                          {conv.lastMessage ? (
                            <>
                              {conv.lastMessage.sender === session?.user?.id ? "You: " : ""}
                              {conv.lastMessage.content}
                            </>
                          ) : (
                            "Start a conversation"
                          )}
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0"></div>
                      )}
                    </Link>
                  );
                })
              )}
            </div>

            {/* New Message FAB */}
            <button
                onClick={() => setIsSearchOpen(true)}
                className="absolute bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:scale-105 transition-all flex items-center justify-center group cursor-pointer"
            >
                <SquarePen className="w-6 h-6 group-hover:rotate-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Bar (Pill) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className={`flex items-center gap-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white pl-5 pr-4 py-3 rounded-full shadow-[0_8px_30px_rgba(79,70,229,0.3)] transition-all group border border-white/20 cursor-pointer ${isPanelOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <div className="flex items-center gap-3">
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 fill-none stroke-current stroke-2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-bold text-[15px] tracking-tight">Messages</span>
          {totalUnread > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {totalUnread}
            </span>
          )}
        </div>

        <div className="flex -space-x-4 pl-2">
          {conversations.slice(0, 3).map((conv, idx) => {
            const otherUser = getOtherParticipant(conv.participants);
            if (!otherUser) return null;

            return (
              <motion.div
                key={conv._id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
                style={{ zIndex: 10 - idx }}
              >
                <div className="w-9 h-9 rounded-full border-2 border-white/50 overflow-hidden shadow-lg transition-transform group-hover:translate-x-1 ring-1 ring-black/5">
                  <Image
                    src={otherUser.profilePicture || "/default-avatar.jpg"}
                    alt={otherUser.username}
                    width={36}
                    height={36}
                    className="object-cover aspect-square"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.button>

      <UserSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onConversationCreated={() => {
            setIsSearchOpen(false);
            fetchConversations();
        }}
      />
    </div>
  );
}
