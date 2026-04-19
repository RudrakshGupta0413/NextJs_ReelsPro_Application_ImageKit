"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface User {
  _id: string;
  name: string;
  username: string;
  profilePicture: string;
}

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConversationCreated: (conversationId: string) => void;
}

export default function UserSearchModal({ isOpen, onClose, onConversationCreated }: UserSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const searchUsers = async () => {
      if (query.trim().length < 1) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/user/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleStartChat = async (recipientId: string) => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId }),
      });

      if (res.ok) {
        const conv = await res.json();
        onConversationCreated(conv._id);
        router.push(`/direct/t/${conv._id}`);
      }
    } catch (error) {
      console.error("Failed to start chat", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white text-black border-none rounded-xl">
        <DialogHeader className="p-4 border-b border-gray-100 flex-row items-center justify-between space-y-0">
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
          <DialogTitle className="text-md font-semibold text-center flex-1">New Message</DialogTitle>
          <div className="w-8" /> {/* Spacer */}
        </DialogHeader>

        <div className="flex flex-col h-[400px]">
          {/* Search Input */}
          <div className="p-4 flex items-center gap-2 border-b border-gray-100">
            <span className="text-sm font-semibold">To:</span>
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 text-sm outline-none bg-transparent"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
            ) : results.length > 0 ? (
              results.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleStartChat(user._id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <Image
                    src={user.profilePicture || "/default-avatar.jpg"}
                    alt={user.username}
                    width={44}
                    height={44}
                    className="rounded-full object-cover border border-gray-100"
                  />
                  <div>
                    <p className="text-sm font-semibold">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.name}</p>
                  </div>
                </button>
              ))
            ) : query.length > 0 ? (
              <p className="p-4 text-sm text-gray-500 text-center">No account found.</p>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 border-2 border-gray-900 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8" />
                    </div>
                </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
