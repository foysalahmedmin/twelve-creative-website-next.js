"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

interface VideoPlayerProps {
  link: string;
  thumbnail: string;
  className?: string;
  aspectRatio?: "video" | "shorts";
}

export const VideoPlayer = ({
  link,
  thumbnail,
  className,
  aspectRatio = "video",
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const isShorts = aspectRatio === "shorts";

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl bg-black border border-primary/10",
        isShorts ? "aspect-[9/16] max-w-[280px] mx-auto" : "aspect-video w-full",
        className,
      ].join(" ")}
    >
      {!hasStarted && (
        <div
          className="absolute inset-0 z-10 cursor-pointer select-none group"
          onClick={() => {
            setHasStarted(true);
            setIsPlaying(true);
          }}
        >
          <Image
            src={thumbnail}
            alt="Video Thumbnail"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
          
          <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-14 h-9 sm:w-16 sm:h-11 rounded-xl bg-primary text-white border border-primary/20 hover:scale-110 active:scale-95 duration-200 transition-transform">
            <Play fill="#fff" strokeWidth={0} className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}

      {hasStarted && (
        <ReactPlayer
          src={link}
          width="100%"
          height="100%"
          controls
          playsinline
          playing={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            setHasStarted(false);
          }}
          className="absolute top-0 left-0"
        />
      )}
    </div>
  );
};

export default VideoPlayer;
