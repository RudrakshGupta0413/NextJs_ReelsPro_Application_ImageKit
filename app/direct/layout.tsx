import { ReactNode } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";

export default function DirectLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-white">
      {/* Inbox Sidebar */}
      <div className="w-full md:w-[350px] lg:w-[400px] border-r border-gray-200 flex flex-col h-full overflow-hidden">
        <ChatSidebar />
      </div>

      {/* Main Chat Area */}
      <div className="hidden md:flex flex-1 h-full bg-white flex-col">
        {children}
      </div>
    </div>
  );
}
