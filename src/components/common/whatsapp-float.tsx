"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

const WA_NUMBER = "19518226223"; // Replace with Twelve Creative's WhatsApp number
const WA_MESSAGE = encodeURIComponent(
  "Hi! I visited twelvecreative.io and would like to learn more about your services. Could you help me?",
);
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

export function WhatsAppFloat() {
  // Chat popup opens ONLY on click — no auto-open, no re-open timers
  // (founder feedback 6/6/2026: the widget must not occupy screen space uninvited)
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="pointer-events-none fixed right-5 bottom-32 z-9998 flex flex-col items-end gap-3 sm:right-6 lg:bottom-6">
      {/* Chat Bubble Popup */}
      <div
        className={cn(
          "bg-card border-border/60 w-72 overflow-hidden rounded-2xl rounded-br-sm border",
          "origin-bottom-right shadow-xl transition-all duration-300",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-2 scale-95 opacity-0",
        )}
      >
        {/* Green header bar */}
        <div className="flex items-center gap-3 bg-[#25D366] px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.244 1.606 6.109L0 24l6.063-1.572A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-5.034-1.388l-.36-.214-3.733.968.993-3.62-.235-.372A9.795 9.795 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm leading-tight font-semibold text-white">
              EDAPro
            </p>
            <p className="flex items-center gap-1 text-xs text-white/80">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Typically replies instantly
            </p>
          </div>
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="ml-auto text-white/70 transition-colors hover:text-white"
            aria-label="Close WhatsApp chat"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message body */}
        <div className="bg-card px-4 py-4">
          {/* WhatsApp-style chat bubble */}
          <div className="mb-4 max-w-[90%] rounded-xl rounded-tl-sm bg-[#dcf8c6] px-3.5 py-2.5 shadow-sm dark:bg-[#1a3a1a]">
            <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
              Hi there! 👋 How can we help you today?
            </p>
            <p className="mt-1 text-right text-[10px] text-gray-500">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* CTA */}
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex w-full items-center justify-center gap-2",
              "bg-[#25D366] text-white hover:bg-[#1ebe5a]",
              "rounded-xl px-4 py-2.5 text-sm font-semibold",
              "transition-colors duration-200",
            )}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.244 1.606 6.109L0 24l6.063-1.572A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-5.034-1.388l-.36-.214-3.733.968.993-3.62-.235-.372A9.795 9.795 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={handleToggle}
        aria-label="Chat on WhatsApp"
        className={cn(
          "pointer-events-auto relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]",
          "shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95",
        )}
      >
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
        )}
        <svg viewBox="0 0 24 24" className="relative z-10 h-6 w-6 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.244 1.606 6.109L0 24l6.063-1.572A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-5.034-1.388l-.36-.214-3.733.968.993-3.62-.235-.372A9.795 9.795 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
        </svg>
      </button>
    </div>
  );
}
