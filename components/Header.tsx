"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useNotification } from "./Notification";
import { Home, User } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    <header className="bg-gray-100 border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/"
          onClick={() => showNotification("Welcome to Reels Pro", "info")}
          className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-blue-500"
        >
          <Home className="w-5 h-5" />
          <span>Imagekit ReelsPro</span>
        </Link>

        {/* Right: Profile / Auth */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <User className="w-6 h-6 text-gray-700" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white shadow-md rounded-md border z-50">
              {session ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600 border-b">
                    {session.user?.email?.split("@")[0] || "User"}
                  </div>
                  <Link
                    href="/upload"
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    onClick={() => {
                      showNotification("Welcome to Admin Dashboard", "info");
                      setDropdownOpen(false);
                    }}
                  >
                    Video Upload
                  </Link>
                  <button
                    onClick={() => {
                      handleSignout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  onClick={() => {
                    showNotification("Welcome to Login Page", "info");
                    setDropdownOpen(false);
                  }}
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
