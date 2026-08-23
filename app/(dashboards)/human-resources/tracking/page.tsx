"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { TrackingGrid } from "@/components/hr-dashboard/tracking/tracking-grid"

export default function LiveTrackingPage() {
  return (
    <main className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar bg-background shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10">
      <div className="flex-1 flex flex-col gap-6 p-6 pb-[100px]">
        {/* Live Tracking Center Header (Figma Node 136:3716) */}
        <div className="content-stretch flex items-center justify-between relative w-full shrink-0">
          <p className="[word-break:break-word] font-bold leading-[20px] not-italic relative shrink-0 text-[#343434] text-[22px] whitespace-nowrap">
            Live Tracking Center
          </p>
          <div className="content-stretch flex items-center relative shrink-0">
            <button
              type="button"
              className="bg-[#0047ff] content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[20px] py-[16px] relative rounded-[12px] shrink-0 hover:bg-[#0047ff]/90 transition-colors cursor-pointer"
            >
              <Plus className="size-[12px] text-white shrink-0" />
              <span className="[word-break:break-word] font-bold leading-[22.4px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap" dir="auto">
                Create New Role
              </span>
            </button>
          </div>
        </div>

        <TrackingGrid />
      </div>
    </main>
  )
}

