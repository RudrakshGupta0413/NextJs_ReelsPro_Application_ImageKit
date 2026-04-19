"use client";

import { useState } from "react";
import { Smile, Image as ImageIcon, Heart, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { pusherClient } from "@/lib/pusher-client";
import { useSession } from "next-auth/react";

interface MessageInputProps {
  conversationId: string;
}

export default function MessageInput({ conversationId }: MessageInputProps) {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [lastTypingTime, setLastTypingTime] = useState(0);

  const handleSend = async (contentOverride?: string) => {
    const content = contentOverride || message;
    if (!content.trim() || isSending) return;

    setIsSending(true);
    setMessage(""); 
    setSuggestions([]); // Clear suggestions after sending

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, content }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error(error);
      if (!contentOverride) setMessage(content); 
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = () => {
    if (!pusherClient) return;
    const now = Date.now();
    if (now - lastTypingTime > 2000) { // Throttle typing events to every 2 seconds
      setLastTypingTime(now);
      const channel = pusherClient.subscribe(`private-chat-${conversationId}`);
      channel.trigger("client-typing", { userId: session?.user?.id });
    }
  };

  const getAiSuggestions = async () => {
    if (isAiLoading) return;
    setIsAiLoading(true);
    setSuggestions([]);

    try {
      const res = await fetch("/api/ai/suggest-replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (err) {
      console.error("AI Fetch Error:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* AI Suggestions Chips */}
      <AnimatePresence>
        {(suggestions.length > 0 || isAiLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-wrap gap-2 px-2"
          >
            {isAiLoading ? (
              <div className="flex items-center gap-2 text-xs text-gray-400 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                <Loader2 className="w-3 h-3 animate-spin text-purple-500" />
                Thinking of replies...
              </div>
            ) : (
              suggestions.map((suggestion, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend(suggestion)}
                  className="text-xs bg-white border border-purple-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-purple-50 hover:border-purple-200 transition-colors shadow-sm"
                >
                  {suggestion}
                </motion.button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:ring-1 focus-within:ring-gray-300 transition-all">
          <button className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
            <Smile className="w-6 h-6" />
          </button>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }} 
            className="flex-1"
          >
            <input
              type="text"
              placeholder="Message..."
              className="w-full bg-transparent border-none outline-none text-sm py-1 px-2 text-black"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
            />
          </form>

          <div className="flex items-center gap-2">
              {!message.trim() ? (
                  <>
                      <button 
                        onClick={getAiSuggestions}
                        disabled={isAiLoading}
                        className="p-1 hover:bg-purple-50 rounded-full text-purple-500 transition-colors group"
                        title="Get AI Suggestions"
                      >
                        <Sparkles className={`w-6 h-6 ${isAiLoading ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
                          <ImageIcon className="w-6 h-6" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
                          <Heart className="w-6 h-6" />
                      </button>
                  </>
              ) : (
                  <button 
                    onClick={() => handleSend()}
                    disabled={isSending}
                    className="text-blue-500 font-semibold text-sm px-2 hover:text-blue-600 active:scale-95 transition-all outline-none"
                  >
                    {isSending ? "..." : "Send"}
                  </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
