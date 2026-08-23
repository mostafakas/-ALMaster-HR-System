"use client";

import * as React from "react";
import { X, Search, BarChart3 } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { reportSchema, type ReportValues } from "@/lib/validations/report";
import { cn } from "@/lib/utils";
import { generateReport } from "@/lib/api-service";

interface NewReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Called once the form is submitted successfully. Receives the fully-typed
   * report values plus the resolved employee record so callers can pivot
   * straight into <EmployeeReportModal>.
   */
  onSubmitted?: (payload: {
    values: ReportValues;
    employee: EmployeeOption;
  }) => void;
}

interface EmployeeOption {
  id: string;
  name: string;
  avatar: string;
}

export function NewReportModal({
  open,
  onOpenChange,
  onSubmitted,
}: NewReportModalProps) {
  const form = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      employeeId: "1", // Mock default
      fromDate: undefined,
      toDate: undefined,
    },
  });

  const { handleSubmit, control, reset, formState: { errors } } = form;

  // Mock data for display (in a real app, this would come from the form state or a lookup)
  const [selectedEmployee, setSelectedEmployee] = React.useState<EmployeeOption | null>({
    id: "1",
    name: "Daniel Scott",
    avatar: "https://github.com/shadcn.png"
  });

  React.useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit: SubmitHandler<ReportValues> = async (data) => {
    try {
      console.log("Generating report:", data);
      await generateReport(data);
      onOpenChange(false);
      // Bubble the resolved selection back so the caller can render the
      // generated report. We fall back to a stub employee if none is selected
      // (the form requires `employeeId`, so this only protects against
      // out-of-band state).
      onSubmitted?.({
        values: data,
        employee:
          selectedEmployee ?? {
            id: data.employeeId,
            name: "Selected Employee",
            avatar: "",
          },
      });
    } catch (error) {
      console.error("Failed to generate report:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-foreground/70 backdrop-blur-[2px]" />
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[551px] max-w-[551px] p-0 gap-0 overflow-hidden border-none rounded-[16px] bg-muted shadow-2xl flex flex-col max-h-[90vh]"
      >

        {/* Header Section (Figma 145:71905) */}
        <div className="p-[28px] pb-[12px] flex flex-row items-center justify-between shrink-0 relative">
          <div className="flex flex-col gap-[4px] items-start">
            <Typography className="text-foreground text-[20px] font-bold leading-[22.4px] font-janna">
              New Report
            </Typography>
            <Typography className="text-muted-foreground text-[14px] leading-[22.4px] font-bold text-left font-janna">
              Export an employee report
            </Typography>
          </div>

          <div
            className="bg-secondary size-[36px] rounded-full flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors outline-none"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-[18px] text-foreground" strokeWidth={3} />
          </div>

        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          {/* Content Section (Figma 145:71912) */}
          <div className="px-[28px] pt-[12px] pb-[28px] flex flex-col gap-[40px]">
            <div className="flex flex-col gap-[12px]">
              {/* Employee Selection (Node 145:73761) */}
              <div className="flex flex-col gap-[6px] items-start w-full relative">
                <Typography className="text-foreground text-[14px] font-bold leading-[22.4px] font-janna">
                  Employee
                </Typography>

                <Controller
                  control={control}
                  name="employeeId"
                  render={({ field }) => (
                    selectedEmployee ? (
                      <div className={cn(
                        "bg-secondary h-[40px] w-full rounded-[8px] px-[12px] py-[4px] flex items-center justify-between group transition-all",
                        errors.employeeId && "ring-1 ring-destructive"
                      )}>

                        <div className="flex items-center gap-[6px]">
                          <Avatar className="size-[32px] rounded-[16px]">
                            <AvatarImage src={selectedEmployee.avatar} />
                            <AvatarFallback className="text-[10px]">DS</AvatarFallback>
                          </Avatar>
                          <Typography className="text-foreground text-[14px] font-bold font-janna">
                            {selectedEmployee.name}
                          </Typography>
                        </div>

                        <X
                          className="size-[16px] text-foreground cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                          onClick={() => {
                            setSelectedEmployee(null);
                            field.onChange("");
                          }}
                          strokeWidth={3}
                        />

                      </div>
                    ) : (
                      <div className="relative w-full">
                        <div className="absolute left-[12px] top-1/2 -translate-y-1/2 size-[12px] flex items-center justify-center">
                          <Search className="size-[12px] text-muted-foreground" strokeWidth={2.5} />
                        </div>

                        <input
                          placeholder="Search by name or role..."
                          onChange={(e) => {
                            // Simple mock: if they type something, we don't change the ID yet
                            // In real app, search results would set the field ID
                            field.onChange(e.target.value);
                          }}
                          className={cn(
                            "w-full h-[40px] pl-[32px] bg-secondary border-none rounded-[8px] focus:outline-none focus:ring-1 focus:ring-primary/20 text-[12px] font-bold text-foreground placeholder:text-muted-foreground font-janna",
                            errors.employeeId && "ring-1 ring-destructive"
                          )}

                        />
                      </div>
                    )
                  )}
                />
                {errors.employeeId && (
                  <span className="absolute -bottom-[18px] right-0 text-destructive text-[10px] font-bold font-janna">
                    {errors.employeeId.message}
                  </span>
                )}

              </div>

              <div className="flex gap-[12px] w-full">
                <div className="flex-1 flex flex-col gap-[6px] items-start relative">
                  <Typography className="text-foreground text-[14px] font-bold leading-[22.4px] font-janna">
                    From
                  </Typography>

                  <Controller
                    control={control}
                    name="fromDate"
                    render={({ field }) => (
                      <div className={cn("w-full transition-all", errors.fromDate && "ring-1 ring-destructive rounded-[8px]")}>
                        <DatePicker

                          date={field.value as Date | undefined}
                          setDate={field.onChange}
                          placeholder="dd/mm/yyyy"
                        />
                      </div>
                    )}
                  />
                  {errors.fromDate && (
                    <span className="absolute -bottom-[18px] right-0 text-destructive text-[10px] font-bold font-janna">
                      {errors.fromDate.message}
                    </span>
                  )}

                </div>
                <div className="flex-1 flex flex-col gap-[6px] items-start relative">
                  <Typography className="text-foreground text-[14px] font-bold leading-[22.4px] font-janna">
                    To
                  </Typography>

                  <Controller
                    control={control}
                    name="toDate"
                    render={({ field }) => (
                      <div className={cn("w-full transition-all", errors.toDate && "ring-1 ring-destructive rounded-[8px]")}>
                        <DatePicker

                          date={field.value as Date | undefined}
                          setDate={field.onChange}
                          placeholder="dd/mm/yyyy"
                        />
                      </div>
                    )}
                  />
                  {errors.toDate && (
                    <span className="absolute -bottom-[18px] right-0 text-destructive text-[10px] font-bold font-janna">
                      {errors.toDate.message}
                    </span>
                  )}

                </div>
              </div>
            </div>

            {/* Footer Actions Row (Figma 145:71932) */}
            <div className="flex items-center gap-[8px] w-full">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="bg-secondary hover:bg-secondary/80 text-foreground h-[40px] px-[20px] rounded-[12px] font-bold text-[12px] font-janna shadow-none"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-[8px] h-[40px] rounded-[12px] font-bold text-[12px] shadow-none transition-all active:scale-[0.98] font-janna px-[20px] py-[16px]"
              >
                <BarChart3 className="size-[12px]" strokeWidth={2.5} />
                Generate Report
              </Button>

            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
