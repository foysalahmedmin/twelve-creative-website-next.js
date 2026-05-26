"use client";

import { Play } from "lucide-react";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

export interface MarqueeItem {
  image_url: string;
  video_url: string;
  alt?: string;
}

interface VerticalMarqueeSliderProps {
  data: MarqueeItem[];
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

// ── Popup Modal ──────────────────────────────────────────
const VideoPopup = ({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[90vw] max-w-3xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-4 text-white text-3xl font-bold z-10 hover:text-gray-300"
        >
          ✕
        </button>
        <div className="aspect-9/16 max-w-100 w-full mx-auto rounded-lg overflow-hidden relative h-full">
          <ReactPlayer
            className="aspect-9/16 absolute inset-0"
            src={url}
            playing={true}
            width="100%"
            height="100%"
            controls={true}
            playsinline
            config={{
              youtube: {
                modestbranding: 1,
                rel: 0,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────
export const VerticalMarqueeSlider: React.FC<VerticalMarqueeSliderProps> = ({
  data,
  speed = 30,
  pauseOnHover = true,
  className,
}) => {
  const [pausedColumns, setPausedColumns] = useState<Set<number>>(new Set());
  const [popupUrl, setPopupUrl] = useState<string | null>(null);
  
  if (!data || data.length === 0) return null;

  const doubled = [...data, ...data];
  // item width = 192px (w-48), aspect-[9/16] → height ≈ 341px, gap = 16px
  const itemHeight = 341 + 16;
  const animationDuration = (data.length * itemHeight) / speed;

  const togglePause = (columnIndex: number, isPaused: boolean) => {
    setPausedColumns((prev) => {
      const newSet = new Set(prev);
      if (isPaused) newSet.add(columnIndex);
      else newSet.delete(columnIndex);
      return newSet;
    });
  };

  const renderMarqueeColumn = (direction: "up" | "down", colKey: number) => {
    const isColumnPaused = pausedColumns.has(colKey);

    return (
      <div
        key={colKey}
        className="relative h-125 md:h-150 overflow-hidden"
        onMouseEnter={pauseOnHover ? () => togglePause(colKey, true) : undefined}
        onMouseLeave={pauseOnHover ? () => togglePause(colKey, false) : undefined}
      >
        <div
          className={cn(
            "flex flex-col items-stretch gap-4",
            isColumnPaused ? "animate-pause" : ""
          )}
          style={{
            animation: `marquee-${direction} ${animationDuration}s linear infinite`,
          }}
        >
          {doubled.map((item, idx) => (
            <div
              key={idx}
              className="relative w-52 sm:w-64 aspect-9/16 overflow-hidden rounded-xl cursor-pointer shrink-0"
              onClick={() => setPopupUrl(item.video_url)}
            >
              <img
                src={item.image_url}
                alt={item.alt || ""}
                className="w-full h-full object-cover"
              />
              <button className="w-14 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center rounded-lg text-white backdrop-blur-[2px] bg-white/20 group">
                <Play
                  fill="#fff"
                  strokeWidth={0}
                  className="group-hover:scale-105 size-4 active:scale-90 duration-200 ease-in-out"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Video Popup */}
      {popupUrl && (
        <VideoPopup url={popupUrl} onClose={() => setPopupUrl(null)} />
      )}

      <div
        className={cn(
          "flex justify-center items-center gap-3 sm:gap-4 w-full overflow-hidden px-4",
          className
        )}
      >
        <div className="shrink-0">{renderMarqueeColumn("up", 0)}</div>
        <div className="shrink-0">{renderMarqueeColumn("down", 1)}</div>
        <div className="shrink-0">{renderMarqueeColumn("up", 2)}</div>
        <div className="hidden sm:block shrink-0">{renderMarqueeColumn("down", 3)}</div>
      </div>

      <style jsx global>{`
        @keyframes marquee-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes marquee-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-pause {
          animation-play-state: paused !important;
        }
      `}</style>
    </>
  );
};

export default VerticalMarqueeSlider;
