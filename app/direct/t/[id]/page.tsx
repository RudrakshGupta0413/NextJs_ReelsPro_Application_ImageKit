"use client";

import { useEffect, useRef, useState, use } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Info, ChevronLeft } from "lucide-react";
import { pusherClient } from "@/lib/pusher-client";
import MessageInput from "@/components/chat/MessageInput";
import { format } from "date-fns";

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    username: string;
    profilePicture: string;
  };
  content: string;
  createdAt: string;
}

interface User {
    id: string;
    name: string;
    username: string;
    profilePicture: string;
}

export default function ChatThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchThreadData();
    markAsRead();
    
    if (!pusherClient) return;

    // Subscribe to pusher channel
    const channel = pusherClient.subscribe(`private-chat-${id}`);
    
    channel.bind("new-message", (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
      markAsRead();
    });

    // Sidebar update also gives us full conversation data (with unread counts)
    const personalChannel = pusherClient.subscribe(`user-${session?.user?.id}`);
    personalChannel.bind("conversation-update", (updatedConv: any) => {
        if (updatedConv._id === id) {
            setConversation(updatedConv);
        }
    });

    // Listen for client events (typing)
    channel.bind("client-typing", (data: { userId: string }) => {
        if (data.userId !== session?.user?.id) {
            setIsTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
        }
    });

    return () => {
      if (pusherClient) {
        pusherClient.unsubscribe(`private-chat-${id}`);
        pusherClient.unsubscribe(`user-${session?.user?.id}`);
      }
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [id, session?.user?.id]);

  useEffect(() => {
    // Scroll to bottom on new message or typing state change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const markAsRead = async () => {
    try {
      await fetch(`/api/conversations/${id}/read`, { method: "POST" });
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const fetchThreadData = async () => {
    try {
      const [msgRes, convRes] = await Promise.all([
        fetch(`/api/messages/${id}`),
        fetch(`/api/conversations/${id}`)
      ]);

      if (msgRes.ok) {
        const data = await msgRes.json();
        setMessages(data);
      }

      if (convRes.ok) {
        const convData = await convRes.json();
        setConversation(convData);
        setOtherUser(convData.participants.find((p: any) => p._id !== session?.user?.id));
      }
    } catch (error) {
      console.error("Failed to fetch thread data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Thread Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10 w-full">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => window.history.back()}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          {otherUser ? (
              <>
                <Image
                    src={otherUser.profilePicture || "/default-avatar.jpg"}
                    alt={otherUser.username}
                    width={32}
                    height={32}
                    className="rounded-full object-cover aspect-square border"
                />
                <div className="flex flex-col">
                    <span className="font-semibold text-sm leading-tight">{otherUser.name}</span>
                    <span className="text-xs text-gray-500">{otherUser.username}</span>
                </div>
              </>
          ) : (
              <div className="h-8 w-32 bg-gray-100 animate-pulse rounded"></div>
          )}
        </div>
        <button className="p-2 hover:bg-gray-50 rounded-full transition-all">
          <Info className="w-6 h-6" />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col"
      >
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender._id === session?.user?.id;
            const nextMsg = messages[idx + 1];
            const isLastOfGroup = !nextMsg || nextMsg.sender._id !== msg.sender._id;
            const isLastMessage = idx === messages.length - 1;

            // Check if seen: message is from me, and the other person's unread count is 0
            const isSeen = isMe && isLastMessage && conversation && otherUser && 
                         (conversation.unreadCounts?.[otherUser._id] === 0);

            return (
              <div 
                key={msg._id} 
                className={`flex w-full mb-1 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {!isMe && isLastOfGroup && (
                    <div className="mr-2 self-end">
                         <Image
                            src={msg.sender.profilePicture || "/default-avatar.jpg"}
                            alt={msg.sender.username}
                            width={24}
                            height={24}
                            className="rounded-full object-cover aspect-square"
                        />
                    </div>
                )}
                {!isMe && !isLastOfGroup && <div className="w-8" />}
                
                <div className="max-w-[70%] lg:max-w-[60%] flex flex-col items-end">
                    <div 
                        className={`px-4 py-2 text-sm leading-relaxed ${
                        isMe 
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl rounded-tr-sm" 
                            : "bg-gray-100 text-black rounded-2xl rounded-tl-sm"
                        }`}
                        title={format(new Date(msg.createdAt), "HH:mm")}
                    >
                        {msg.content}
                    </div>
                    {isSeen && (
                        <span className="text-[10px] text-gray-400 mt-1 mr-1">Seen</span>
                    )}
                </div>
              </div>
            );
          })
        )}
        {isTyping && (
          <div className="flex justify-start mb-2 items-center gap-2">
            <div className="h-6 flex items-center gap-1.5 px-3 bg-gray-100 rounded-full shadow-sm">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
            <span className="text-[10px] text-gray-400 font-medium italic">Typing...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-50">
        <MessageInput conversationId={id} />
      </div>
    </div>
  );
}
