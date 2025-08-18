import { useState } from "react";
import Link from "next/link";
import { Video, Search, Bell, Plus, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import VideoUploadForm from "@/components/VideoUploadForm";
import { useNotification } from "@/components/Notification";
import { signOut } from "next-auth/react";

const FeedHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotification();

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
              Reels Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary"
            >
              For You
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
            >
              Following
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
            >
              Trending
            </Button>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search videos, creators..."
                className="pl-10 bg-muted/50 border-input focus:border-primary"
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <div>
              <Button
                className="bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 text-white hover: cursor-pointer"
                onClick={() => setOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload
              </Button>

              <VideoUploadForm open={open} onOpenChange={setOpen} />
            </div>

            <Link href="/profile">
              <Avatar className="h-8 w-8 cursor-pointer">
                <img
                  src="/avatar.jpg"
                  alt="Profile"
                  className="rounded-full object-cover"
                />
              </Avatar>
            </Link>

            <button
              onClick={() => {
                handleSignout();
                showNotification("Successfully signed out", "success");
              }}
              className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search videos, creators..."
                className="pl-10 bg-muted/50 border-input focus:border-primary"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default FeedHeader;
