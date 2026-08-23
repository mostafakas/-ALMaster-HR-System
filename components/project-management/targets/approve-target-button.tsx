"use client";

import * as React from "react";
import { Check } from "lucide-react";

interface ApproveTargetButtonProps {
  onClick?: () => void;
}

/**
 * "Approve Target" pill button shown above the calendar in frames
 * 2126:49594 / 2126:50432 / 2126:52613.
 */
export function ApproveTargetButton({ onClick }: ApproveTargetButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-9 px-3.5 rounded-[8px] bg-primary text-primary-foreground flex items-center gap-2 transition-colors hover:bg-primary/90 outline-none"
    >
      <Check className="size-3.5" strokeWidth={2.5} />
      <span className="text-[12px] font-bold leading-[14px]">Approve Target</span>
    </button>
  );
}
