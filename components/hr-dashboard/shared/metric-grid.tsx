"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface Metric {
  label: string
  time: string
  bg: string
  text: string
}

interface MetricGridProps {
  metrics: Metric[]
  height?: string
  className?: string
}

export function MetricGrid({ metrics, height = "h-[40px]", className }: MetricGridProps) {
  return (
    <div className={cn("grid grid-cols-4 gap-[4px] w-full", className)}>
      {metrics.map((m, i) => (
        <div key={i} className={cn("flex flex-col items-center justify-center py-[2px] rounded-[4px]", height, m.bg, "tabular-nums")}>
          <span className={cn("text-[10px] font-bold leading-[14px]", m.text)}>{m.label}</span>
          <span className="text-xs font-bold text-foreground leading-[14px]">{m.time}</span>
        </div>
      ))}

    </div>
  )
}
