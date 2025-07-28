"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IKVideo } from "imagekitio-next";

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail: string;
  // duration: string;
}

const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);


 useEffect(() => {
  const interval = setInterval(() => {
    if (containerRef.current && !videoElement) {
      const video = containerRef.current.querySelector("video");
      if (video) {
        setVideoElement(video);
        clearInterval(interval);
      }
    }
  }, 200);

  return () => clearInterval(interval);
}, [videoElement]);


  const togglePlay = async () => {
    if (!videoElement) return;
    try {
      if (videoElement.paused || videoElement.ended) {
        await videoElement.play();
        setIsPlaying(true);
      } else {
        videoElement.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.error("Play error:", err);
    }
  };

  const toggleMute = () => {
    if (videoElement) {
      videoElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const enterFullScreen = () => {
    if (videoElement?.requestFullscreen) {
      videoElement.requestFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-black group cursor-pointer"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={togglePlay}
    >
      <IKVideo
        path={videoUrl}
        transformation={[{ height: "1920", width: "1080" }]}
        controls={false}
        autoPlay={false}
        muted={isMuted}
        className="w-full h-full object-cover"
        style={{ objectFit: "cover" }}
      />

      {/* Overlay Play icon when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <div className="bg-white/90 rounded-full p-4">
            <Play className="h-8 w-8 text-black ml-1" />
          </div>
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
          {/* Duration */}
          {/* <div className="absolute top-4 right-4 flex items-center space-x-2">
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
              {duration}
            </div>
          </div> */}

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="bg-black/70 hover:bg-black/90 text-white"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="bg-black/70 hover:bg-black/90 text-white"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                enterFullScreen();
              }}
              className="bg-black/70 hover:bg-black/90 text-white"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
