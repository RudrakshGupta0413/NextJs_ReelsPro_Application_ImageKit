"use client";

import { useState } from "react";
import Link from "next/link";
import { Video, Bell, Plus, Menu, LogOut, Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import SearchDropdown from "@/components/SearchDropdown";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import VideoUploadForm from "@/components/VideoUploadForm";
import { useNotification } from "@/components/Notification";
import { signOut, useSession } from "next-auth/react";
import NotificationPanel from "@/components/feed/NotificationPanel";

const FeedHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotification();
  const { data: session } = useSession();

  const handleSignout = async () => {
    try {
      await signOut();
      showNotification("Successfully signed out", "success");
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Sign out failed",
        "error"
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Video className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Voxa AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 ml-8">
            <Button
              variant="ghost"
              className="text-foreground hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
            >
              For You
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
            >
              Following
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
            >
              Trending
            </Button>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <SearchDropdown className="w-full" />
          </div>

          <div className="hidden md:flex items-center space-x-4 relative">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`transition-all cursor-pointer rounded-full ${isNotifOpen ? "bg-blue-600 text-white" : "text-muted-foreground hover:bg-blue-600 hover:text-white"}`}
              >
                <Bell className="h-5 w-5" />
              </Button>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}

              <NotificationPanel 
                isOpen={isNotifOpen} 
                onClose={() => setIsNotifOpen(false)}
                onUnreadUpdate={setUnreadCount}
              />
            </div>
            {/* {session && (
              <Link href="/direct">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Send className="h-5 w-5 rotate-[-20deg]" />
                </Button>
              </Link>
            )} */}
            {session && (
              <div>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white cursor-pointer shadow-md hover:shadow-lg transition-all"
                  onClick={() => setOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload
                </Button>

                <VideoUploadForm open={open} onOpenChange={setOpen} />
              </div>
            )}

            <Link href="/profile">
              <Avatar className="h-8 w-8 cursor-pointer">
                <img
                  src={session?.user?.profilePicture || "/default-avatar.jpg"}
                  alt={session?.user?.name || "Profile"}
                  className="rounded-full object-cover"
                />
              </Avatar>
            </Link>

            <button
              onClick={() => {
                handleSignout();
                showNotification("Successfully signed out", "success");
              }}
              suppressHydrationWarning
              className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`transition-all cursor-pointer rounded-full ${isNotifOpen ? "bg-blue-600 text-white" : "text-muted-foreground hover:bg-blue-600 hover:text-white"}`}
              >
                <Bell className="h-5 w-5" />
              </Button>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}

              <NotificationPanel 
                isOpen={isNotifOpen} 
                onClose={() => setIsNotifOpen(false)}
                onUnreadUpdate={setUnreadCount}
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-muted-foreground hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    <Avatar className="h-12 w-12">
                      <img
                        src="/placeholder.svg"
                        alt="Profile"
                        className="rounded-full object-cover"
                      />
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">John Doe</p>
                      <p className="text-sm text-muted-foreground">@johndoe</p>
                    </div>
                  </div>

                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      For You
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Following
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      Trending
                    </Button>
                    <Link href="/direct" className="w-full">
                      <Button variant="ghost" className="w-full justify-start">
                        <Send className="h-4 w-4 mr-2" />
                        Messages
                      </Button>
                    </Link>
                  </nav>

                  {/* <div className="pt-4 border-t border-border">
                    <Button className="w-full bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Video
                    </Button>
                  </div> */}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <SearchDropdown autoFocus />
          </div>
        )}
      </div>
    </header>
  );
};

export default FeedHeader;
