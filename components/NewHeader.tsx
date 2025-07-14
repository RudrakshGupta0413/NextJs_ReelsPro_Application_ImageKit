"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useNotification } from "@/components/Notification";
import { Menu, X, Video, User, LogIn, LogOut, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={() => showNotification("Welcome to Reels Pro", "info")}
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
              <Video className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Reels Pro App
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-purple-600 font-medium">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-purple-600 font-medium">
              Pricing
            </a>
            <a href="#about" className="text-gray-700 hover:text-purple-600 font-medium">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-purple-600 font-medium">
              Contact
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4 relative">
            {session ? (
              <>
                <button
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  <User className="w-5 h-5 text-gray-700" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white border shadow-lg rounded-md z-50">
                    <div className="px-4 py-2 text-sm text-gray-600 border-b">
                      {session.user?.email?.split("@")[0] || "User"}
                    </div>
                    <Link
                      href="/upload"
                      onClick={() => {
                        showNotification("Welcome to Admin Dashboard", "info");
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </Link>
                    <button
                      onClick={() => {
                        handleSignout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-purple-600">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    <User className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <nav className="space-y-4">
                <a href="#features" className="block text-gray-700 hover:text-purple-600 font-medium">
                  Features
                </a>
                <a href="#pricing" className="block text-gray-700 hover:text-purple-600 font-medium">
                  Pricing
                </a>
                <a href="#about" className="block text-gray-700 hover:text-purple-600 font-medium">
                  About
                </a>
                <a href="#contact" className="block text-gray-700 hover:text-purple-600 font-medium">
                  Contact
                </a>
              </nav>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                {session ? (
                  <>
                    <Link href="/upload">
                      <Button
                        variant="ghost"
                        className="justify-start text-gray-700 hover:text-purple-600 w-full"
                        onClick={() => {
                          showNotification("Welcome to Admin Dashboard", "info");
                          setIsMenuOpen(false);
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="justify-start text-red-600 hover:bg-gray-100"
                      onClick={() => {
                        handleSignout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        className="justify-start text-gray-700 hover:text-purple-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button
                        className="justify-start bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
