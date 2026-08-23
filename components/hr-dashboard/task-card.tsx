"use client"

import * as React from "react"
import { Eye, Calendar } from "lucide-react"
import Image from "next/image"
import { Typography } from "@/components/ui/typography"

interface TaskCardProps {
  title: string
  status: string
  date: string
  variant?: "compact" | "detailed"
  by?: string
  to?: string[]
}

export const TaskCard = React.memo(function TaskCard({ title, status, date, variant = "compact", by, to }: TaskCardProps) {
  return (
    <div className="bg-[#f8fafc] rounded-lg p-3 flex flex-col gap-2 hover:shadow-sm transition-all cursor-pointer w-full">
      <div className="flex items-center justify-between w-full h-5">
        {/* Status Dot 75:2774 (8x8) */}
        <div className="flex items-center gap-2">
          <div className="size-[8px] rounded-full bg-[#00b927] shrink-0" />
          <Typography as="p" className="font-bold text-[14px] text-foreground leading-5 whitespace-nowrap">{title}</Typography>
        </div>
        <Eye className="size-[14px] text-primary cursor-pointer hover:opacity-80 shrink-0" />
      </div>

      <div className="flex items-center gap-2 w-full h-[22px]">
        <div className="flex items-center gap-2.5 flex-1">
          <div className="size-[8px] rounded-full bg-[#00b927] shrink-0" />
          <div className="bg-[#00b927]/10 px-2 py-1 rounded-[6px] flex items-center justify-center h-[22px]">
            <Typography as="span" className="text-[#00b927] text-[12px] font-bold leading-[14px]">{status}</Typography>
          </div>
          <div className="flex gap-1 items-center text-muted-foreground shrink-0">
            <Calendar className="size-3" />
            <Typography as="span" className="text-[12px] font-bold leading-5 tabular-nums">{date}</Typography>
          </div>

          {/* New Variant Addition - Only shows if detailed */}
          {variant === "detailed" && (
            <div className="flex gap-4 items-center ml-auto">
              {by && (
                <div className="flex items-center gap-1 shrink-0">
                  <Typography as="span" className="text-xs font-bold text-muted-foreground leading-5 whitespace-nowrap">By:</Typography>
                  <div className="size-6 rounded-full overflow-hidden border border-border bg-background shrink-0">
                    <Image src={by} alt="By" width={24} height={24} className="w-full h-full object-cover object-top" />
                  </div>
                </div>
              )}
              {to && to.length > 0 && (
                <div className="flex items-center gap-1 shrink-0">
                  <Typography as="span" className="text-xs font-bold text-muted-foreground leading-5 whitespace-nowrap">To:</Typography>
                  <div className="flex items-center pr-[5px] shrink-0">
                    {to.map((url, idx) => (
                      <div key={idx} className="size-6 rounded-full overflow-hidden border border-border bg-background shrink-0 ml-[-5px] first:ml-0">
                        <Image src={url} alt="To" width={24} height={24} className="w-full h-full object-cover object-top" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
});
