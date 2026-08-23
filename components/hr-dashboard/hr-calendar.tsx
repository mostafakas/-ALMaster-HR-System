"use client";

import * as React from "react";
import { 
  addMonths, 
  eachDayOfInterval, 
  endOfMonth, 
  endOfWeek, 
  format, 
  isSameDay, 
  isSameMonth, 
  startOfMonth, 
  startOfWeek, 
  subMonths 
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";

interface HRCalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
}

export function HRCalendar({ selected, onSelect, className }: HRCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const days = React.useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div 
      className={cn(
        "bg-muted rounded-[16px] shadow-[0px_0px_28px_0px_rgba(0,0,0,0.05)] p-[16px] w-[270px] flex flex-col gap-[12px]",
        className
      )}

    >
      {/* Header: Centered Pill Month Logic (Figma 145:73806) */}
      <div className="flex items-center justify-between w-full h-[24px]">
        <button 
          onClick={handlePrevMonth}
          className="size-[24px] flex items-center justify-center hover:bg-secondary rounded-full transition-colors"
        >
          <ChevronLeft className="size-[16px] text-foreground" />
        </button>
        
        <div className="bg-secondary px-[16px] py-[6px] rounded-[8px] flex items-center justify-center">
          <Typography className="text-foreground text-[12px] font-bold leading-[12px] whitespace-nowrap">
            {format(currentMonth, "MMMM")}
          </Typography>
        </div>

        <button 
          onClick={handleNextMonth}
          className="size-[24px] flex items-center justify-center hover:bg-secondary rounded-full transition-colors"
        >
          <ChevronRight className="size-[16px] text-foreground" />
        </button>
      </div>

      {/* Divider (Figma 145:73814) */}
      <div className="w-full h-[1px] bg-muted-foreground/10" />


      {/* Week Day Names (Figma 145:73815) */}
      <div className="grid grid-cols-7 w-full">
        {weekDays.map((day) => (
          <div key={day} className="flex items-center justify-center size-[34px]">
            <Typography className="text-foreground text-[10px] font-medium leading-[12px]">
              {day}
            </Typography>
          </div>
        ))}
      </div>

      {/* Date Grid (Figma 145:73786) */}
      <div className="grid grid-cols-7 gap-y-[10px] w-full">
        {days.map((date, i) => {
          const isSelected = selected && isSameDay(date, selected);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          
          return (
            <div key={i} className="flex items-center justify-center size-[34px]">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect?.(date);
                }}
                className={cn(
                  "size-[24px] rounded-[9px] flex items-center justify-center text-[12px] font-bold transition-all",
                  isSelected 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "bg-secondary text-foreground hover:bg-secondary/80",
                  !isCurrentMonth && !isSelected && "text-muted-foreground opacity-50"
                )}
              >
                {format(date, "d")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
