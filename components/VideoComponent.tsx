"use client";

import { IVideo } from "@/models/Video";
import { IKVideo, IKImage } from "imagekitio-next";
import Link from "next/link";

export default function VideoComponent({ video }: { video: IVideo & { _id: string } }) {
  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <figure className="relative px-4 pt-4">
        <Link href={`/video/${video._id}`} className="relative group w-full">
          <div
            className="rounded-xl overflow-hidden relative w-full bg-black flex items-center justify-center"
            style={{ aspectRatio: video.aspectRatio === "16:9" ? "16/9" : "9/16" }}
          >
            {video.type === "image" ? (
              <IKImage
                path={video.videoUrl}
                transformation={[{
                  height: video.aspectRatio === "9:16" ? "1920" : "1080",
                  width: video.aspectRatio === "9:16" ? "1080" : "1920"
                }]}
                className="w-full h-full object-contain"
                loading="lazy"
                alt={video.caption || "Post image"}
              />
            ) : (
              <IKVideo
                path={video.videoUrl}
                transformation={[{
                  height: video.aspectRatio === "9:16" ? "1920" : "1080",
                  width: video.aspectRatio === "9:16" ? "1080" : "1920"
                }]}
                controls={video.controls}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </Link>
      </figure>
      <div className="card-body p-4">
        <Link
          href={`/video/${video._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-lg line-clamp-1">{video.caption}</h2>
        </Link>

        {/* <p className="text-sm text-base-content/70 line-clamp-2">
          {video.caption}
        </p> */}
      </div>
    </div>
  );
}
