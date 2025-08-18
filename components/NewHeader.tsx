"use client";

import { useState } from "react";
import Link from "next/link";
import { useNotification } from "@/components/Notification";
import { Menu, X, Video, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { showNotification } = useNotification();

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
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Video className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Reels Pro App
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* <a href="#pricing" className="text-gray-700 hover:text-purple-600 font-medium">
              Pricing
            </a> */}
            <a
              href="#about"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              About
            </a>
            <a
              href="#features"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Testimonials
            </a>
            <a
              href="#dashboard"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Dashboard
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Contact
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4 relative">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-indigo-600 hover:cursor-pointer"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-500 text-white hover:cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <nav className="space-y-4">
                <a
                  href="#about"
                  className="block text-gray-700 hover:text-indigo-600 font-medium"
                >
                  About
                </a>
                <a
                  href="#features"
                  className="block text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="block text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Testimonials
                </a>
                <a
                  href="#dashboard"
                  className="block text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Dashboard
                </a>
                <a
                  href="#footer"
                  className="block text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Contact
                </a>
              </nav>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="justify-start text-gray-700 hover:text-indigo-600 hover:cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    className="justify-start bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-500 text-white hover:cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
