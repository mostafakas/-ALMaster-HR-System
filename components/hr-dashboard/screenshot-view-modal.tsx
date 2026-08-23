"use client";

import * as React from "react";
import Image from "next/image";
import { X, Maximize2, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";

interface ScreenshotViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  screenshotUrl?: string;
  timestamp?: string;
}

export function ScreenshotViewModal({
  open,
  onOpenChange,
  screenshotUrl = "/Users/ahmeds./.gemini/antigravity/brain/8820cc99-96a6-4225-b8ae-0c7e47032ec8/high_fidelity_screenshot_viewer_sample_1775731612763.png",
  timestamp = "12:08:56 PM"
}: ScreenshotViewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-[rgba(52,52,52,0.7)] backdrop-blur-sm" />
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[700px] max-w-[700px] p-0 gap-0 overflow-hidden border-none rounded-[16px] bg-[#f8fafc] shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="relative w-full aspect-video overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1517245318742-45a8e3b7c938?q=80&w=2070&auto=format&fit=crop"
            alt="Dashboard Screenshot"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
        </div>

        {/* Top-Right Close Button */}
        <div 
          className="absolute top-[32px] right-[32px] z-20 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] size-[36px] rounded-full flex items-center justify-center cursor-pointer transition-all border border-white/10 backdrop-blur-md"
          onClick={() => onOpenChange(false)}
        >
          <X className="size-[18px] text-white" strokeWidth={2.5} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative p-[28px] flex flex-col items-center justify-center overflow-hidden">
          {/* Top-Left Label (Figma 145:70493) */}
          <div className="absolute top-[32px] left-[32px] z-20">
            <Typography className="text-white text-[12px] font-bold leading-[22.4px] font-janna drop-shadow-md">
              Latest Screenshot
            </Typography>
          </div>

          {/* Main Screenshot Container */}
          <div className="relative w-full h-full rounded-[16px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] border border-white/5 bg-[#1a1a1a]">
            {/* The Image */}
            <Image 
              src={screenshotUrl} 
              alt="Employee Screenshot" 
              fill
              className="object-contain transition-transform duration-700 hover:scale-[1.01]"
            />
            
            {/* Bottom-Left Maximize Button (Figma 145:70495) */}
            <div className="absolute bottom-[28px] left-[28px] z-20">
              <div className="bg-[#0047ff] hover:bg-[#0037cc] w-[40px] h-[36px] rounded-[8px] flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-lg group">
                <Maximize2 className="size-[12px] text-white transition-transform group-hover:scale-110" strokeWidth={2.5} />
              </div>
            </div>

            {/* Bottom-Right Timestamp (Figma 145:70497) */}
            <div className="absolute bottom-[28px] right-[28px] z-20 flex items-center gap-[4px] bg-black/30 backdrop-blur-md px-[10px] py-[6px] rounded-full border border-white/10 shadow-sm">
              <Clock className="size-[10px] text-[#edf2f7]" strokeWidth={2.5} />
              <Typography className="text-[#edf2f7] text-[10px] font-bold font-janna leading-none">
                {timestamp}
              </Typography>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
