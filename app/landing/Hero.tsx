import { Play, Upload, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative w-full h-screen max-w-none flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-gray-800 to-blue-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-blue-600/20"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-slate-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl animate-bounce delay-500"></div>
      <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gray-300/20 rounded-full blur-xl animate-pulse delay-2000"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-800/80 to-gray-700/80 backdrop-blur-sm border border-slate-600/30 rounded-full mb-8 animate-fade-in">
            <Star className="h-5 w-5 text-blue-400 mr-2" />
            <span className="text-sm font-medium text-gray-200">
              #1 Video Uploading Platform
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-white via-blue-100 to-slate-200 bg-clip-text text-transparent">
              Upload, Share &
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-slate-300 bg-clip-text text-transparent">
              Go Viral
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Create stunning video content with our powerful platform. Upload,
            edit, and share your reels with millions of viewers worldwide.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:cursor-pointer text-white px-8 py-3 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-blue-500/20"
              >
                <Upload className="h-5 w-5 mr-2" />
                Start Uploading
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 hover:cursor-pointer border-slate-400/50 text-slate-200 hover:bg-slate-800/50 backdrop-blur-sm px-8 py-3 text-base font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in">
            <div className="text-center bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/20">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-200 to-gray-300 bg-clip-text text-transparent">
                10M+
              </div>
              <div className="text-gray-400 font-medium">Videos Uploaded</div>
            </div>
            <div className="text-center bg-blue-900/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-600/20">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                5M+
              </div>
              <div className="text-gray-400 font-medium">Active Creators</div>
            </div>
            <div className="text-center bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/20">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-300 to-gray-400 bg-clip-text text-transparent">
                100M+
              </div>
              <div className="text-gray-400 font-medium">Monthly Views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Video Cards */}
      <div className="absolute top-1/4 left-16 hidden lg:block animate-bounce delay-300">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-600/30 rounded-2xl shadow-2xl p-4 w-56 transform rotate-8 hover:rotate-3 transition-transform duration-300">
          <div className="bg-gradient-to-br from-slate-600 to-gray-700 rounded-lg h-24 mb-3 flex items-center justify-center">
            <Play className="h-8 w-8 text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-slate-400 rounded-full"></div>
            <div className="text-xs text-gray-300">Trending Reel</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-1/4 right-16 hidden lg:block animate-bounce delay-700">
        <div className="bg-blue-900/80 backdrop-blur-sm border border-blue-600/30 rounded-2xl shadow-2xl p-4 w-52 transform -rotate-6 hover:-rotate-3 transition-transform duration-300">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg h-24 mb-3 flex items-center justify-center">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-300 rounded-full"></div>
            <div className="text-xs text-gray-300">Creator Hub</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
