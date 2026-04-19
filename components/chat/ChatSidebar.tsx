"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquarePen, ChevronLeft, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import UserSearchModal from "./UserSearchModal";

import { pusherClient } from "@/lib/pusher-client";

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

export default function ChatSidebar() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingStates, setTypingStates] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!session?.user?.id || !pusherClient) return;

    // 1. Subscribe to personal channel for conversation updates (new messages, unread increments)
    const personalChannel = pusherClient.subscribe(`user-${session.user.id}`);
    
    personalChannel.bind("conversation-update", (updatedConv: Conversation) => {
      setConversations((prev) => {
        // Remove old version and put updated one at the top
        const filtered = prev.filter((c) => c._id !== updatedConv._id);
        return [updatedConv, ...filtered];
      });
    });

    // 2. Subscribe to Presence channel for online status
    const presenceChannel = pusherClient.subscribe("presence-voxa-chat");

    presenceChannel.bind("pusher:subscription_succeeded", (members: any) => {
      const ids: string[] = [];
      members.each((member: any) => ids.push(member.id));
      setOnlineUsers(ids);
    });

    presenceChannel.bind("pusher:member_added", (member: any) => {
      setOnlineUsers((prev) => [...prev, member.id]);
    });

    presenceChannel.bind("pusher:member_removed", (member: any) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== member.id));
    });

    // 3. Optional: Global typing indicators for the sidebar
    // This requires a shared channel or individual hooks. We'll skip for sidebar complexity for now.

    return () => {
      if (pusherClient) {
        pusherClient.unsubscribe(`user-${session.user.id}`);
        pusherClient.unsubscribe("presence-voxa-chat");
      }
    };
  }, [session?.user?.id]);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    } finally {
      setLoading(false);
    }
  };

  const getOtherParticipant = (participants: Participant[]) => {
    return participants.find((p) => p._id !== session?.user?.id);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Link href="/feed" className="md:hidden">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">{session?.user?.username || "Messages"}</h1>
        </div>
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <SquarePen className="w-6 h-6" />
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
            <div className="w-16 h-16 border-2 border-gray-900 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-black" />
            </div>
            <p className="font-semibold text-black">No messages found</p>
            <p className="text-sm mt-1">Start a conversation with anyone on Voxa AI.</p>
            <button 
                onClick={() => setIsSearchOpen(true)}
                className="mt-4 text-blue-500 font-semibold hover:text-blue-600"
            >
              Send message
            </button>
          </div>
        ) : (
          conversations.map((conv) => {
            const otherUser = getOtherParticipant(conv.participants);
            const isActive = pathname.includes(conv._id);
            const unreadCount = conv.unreadCounts?.[session?.user?.id || ""] || 0;
            const isOnline = otherUser ? onlineUsers.includes(otherUser._id) : false;

            if (!otherUser) return null;

            return (
              <Link
                key={conv._id}
                href={`/direct/t/${conv._id}`}
                className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                  isActive ? "bg-gray-50" : ""
                }`}
              >
                <div className="relative">
                  <Image
                    src={otherUser.profilePicture || "/default-avatar.jpg"}
                    alt={otherUser.name}
                    width={56}
                    height={56}
                    className="rounded-full object-cover aspect-square border border-gray-100"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {otherUser.username}
                  </p>
                  <p className={`text-sm truncate ${unreadCount > 0 ? "font-bold text-black" : "text-gray-500"}`}>
                    {conv.lastMessage ? (
                      <>
                        {conv.lastMessage.sender === session?.user?.id ? "You: " : ""}
                        {conv.lastMessage.content}
                        <span className="mx-1">·</span>
                        {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: false })}
                      </>
                    ) : (
                      "No messages yet"
                    )}
                  </p>
                </div>
                {unreadCount > 0 && (
                    <div className="bg-blue-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </div>
                )}
              </Link>
            );
          })
        )}
      </div>

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
