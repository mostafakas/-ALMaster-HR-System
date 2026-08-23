"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface BaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  contentClassName?: string;
  overlayClassName?: string;
}

export function BaseModal({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
  footer,
  contentClassName,
  overlayClassName = "bg-foreground/70 backdrop-blur-[2px]",
}: BaseModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className={overlayClassName} />
      <DialogContent
        showCloseButton={false}
        className={cn(
          "p-0 gap-0 overflow-hidden border-none rounded-2xl bg-muted shadow-2xl flex flex-col max-h-[90vh]",
          contentClassName
        )}

      >
        {/* Header */}
        <div className="p-7 pb-3 flex flex-row items-center justify-between shrink-0 relative">
          <div className="flex flex-col gap-1 items-start">
            <Typography className="text-foreground text-[20px] font-bold leading-[22.4px] font-janna">
              {title}
            </Typography>
            {subtitle && (
              <Typography className="text-muted-foreground text-[14px] leading-[22.4px] font-bold text-left font-janna">
                {subtitle}
              </Typography>
            )}

          </div>
          <div
            className="bg-secondary size-[36px] rounded-full flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors outline-none"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-[18px] text-foreground" strokeWidth={3} />
          </div>

        </div>

        {/* Scrollable Content */}
        <div className="flex-1 w-full overflow-y-auto min-h-0 bg-muted">

          <div className="px-7 pt-3 pb-10 flex flex-col gap-10">
            {children}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-7 pt-3 shrink-0 border-t border-border bg-muted">

          {footer}
        </div>
      </DialogContent>
    </Dialog>
  );
}
