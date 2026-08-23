  "use client";

import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";

interface RemoveEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeName?: string;
  onConfirm?: () => void;
}

export function RemoveEmployeeModal({
  open,
  onOpenChange,
  onConfirm,
}: RemoveEmployeeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-[#343434]/60 backdrop-blur-[12px]" />
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[507px] max-w-[507px] p-0 gap-0 border-none rounded-[16px] bg-[#F8FAFC] shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col items-center gap-[40px] p-[32px]">
          {/* Icon + title */}
          <div className="flex flex-col items-center gap-[8px] w-full">
            <div className="size-[140px] bg-[rgba(245,80,80,0.1)] rounded-full flex items-center justify-center">
              <Trash2 className="size-[56px] text-[#F55050]" strokeWidth={1.5} />
            </div>
            <h2 className="font-bold text-[24px] text-[#F55050] font-janna text-center">
              Remove Employee?
            </h2>
            <p className="font-bold text-[18px] text-[#343434] leading-[28px] font-janna text-center w-full">
              This employee will be permanently removed from the system. This action cannot be undone.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-[8px] w-full">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 h-[40px] bg-[#EDF2F7] hover:bg-[#e2e8f0] rounded-[12px] flex items-center justify-center transition-colors"
            >
              <span className="text-[12px] font-bold text-[#343434] font-janna">Cancel</span>
            </button>
            <button
              onClick={() => {
                onConfirm?.();
                onOpenChange(false);
              }}
              className="flex-1 h-[40px] bg-[#F55050] hover:bg-[#e03e3e] rounded-[12px] flex items-center justify-center gap-[8px] transition-colors active:scale-[0.98]"
            >
              <Trash2 className="size-[12px] text-white" />
              <span className="text-[12px] font-bold text-white font-janna">Remove Employee</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
