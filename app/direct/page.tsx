"use client";

import { MessageSquarePlus } from "lucide-react";
import { useState } from "react";
import UserSearchModal from "@/components/chat/UserSearchModal";

export default function DirectPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
      <div className="w-24 h-24 border-2 border-black rounded-full flex items-center justify-center mb-6">
        <MessageSquarePlus className="w-12 h-12 text-black" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Your Messages</h2>
      <p className="text-gray-500 mb-6 max-w-xs">
        Send private photos and messages to a friend or group.
      </p>
      <button
        onClick={() => setIsSearchOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
      >
        Send Message
      </button>

      <UserSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onConversationCreated={(id) => {
            // Usually handled by router.push in the modal
        }}
      />
    </div>
  );
}
