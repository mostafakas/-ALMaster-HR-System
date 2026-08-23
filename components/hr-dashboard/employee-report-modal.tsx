"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  X,
  Download,
  FileText,
  ImageIcon,
  FileImage,
  FileJson,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { PerformanceLineChart } from "./charts/performance-line-chart";
import { TasksProgressBar } from "./charts/tasks-progress-bar";
import { AttendanceHeatmap } from "./charts/attendance-heatmap";
import {
  buildMockReport,
  formatHMS,
  reportToCsvSections,
  type EmployeeReportData,
  type EmployeeReportInput,
} from "@/lib/report-data";
import {
  exportDataToJson,
  exportNodeToJpeg,
  exportNodeToPdf,
  exportNodeToPng,
  exportRowsToCsv,
  placeSectionsHorizontally,
} from "@/lib/report-export";

interface EmployeeReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Employee + range to render. If omitted, modal renders nothing. */
  employee?: EmployeeReportInput;
  range?: { from: Date; to: Date };
  /** Optional pre-loaded report data — overrides the mock builder. */
  data?: EmployeeReportData;
  /** Fired when the user clicks "New Report" in the footer. */
  onNewReport?: () => void;
}

/** Color tokens — kept inline so they survive html-to-image serialization. */
const METRIC_STYLES = [
  { key: "working", label: "Working", text: "var(--success)", bg: "var(--success-10)" },
  { key: "meeting", label: "Meeting", text: "var(--warning)", bg: "var(--warning-10)" },
  { key: "break", label: "Break", text: "var(--muted-foreground)", bg: "var(--secondary)" },
  { key: "idle", label: "IDLE", text: "var(--destructive)", bg: "var(--destructive-10)" },
  { key: "overtime", label: "Overtime", text: "var(--primary)", bg: "var(--primary-10)" },
] as const;


export function EmployeeReportModal({
  open,
  onOpenChange,
  employee,
  range,
  data,
  onNewReport,
}: EmployeeReportModalProps) {
  // Build the report data when the modal opens. Memoized so the same
  // open-cycle never re-rolls mock numbers (deterministic from inputs anyway).
  const report = React.useMemo<EmployeeReportData | null>(() => {
    if (data) return data;
    if (!employee || !range) return null;
    return buildMockReport(employee, range);
  }, [data, employee, range]);

  // Export refs + busy state.
  const printRef = React.useRef<HTMLDivElement>(null);
  const [busy, setBusy] = React.useState<
    null | "png" | "jpeg" | "pdf" | "json" | "csv"
  >(null);

  const fileBase = report
    ? `${slugify(report.employee.name)}-report-${format(report.range.from, "yyyy-MM-dd")}_${format(report.range.to, "yyyy-MM-dd")}`
    : "employee-report";

  const handleExport = async (
    kind: "png" | "jpeg" | "pdf" | "json" | "csv",
  ) => {
    if (!report || busy) return;
    setBusy(kind);
    try {
      if (kind === "json") {
        exportDataToJson(report, fileBase);
      } else if (kind === "csv") {
        // CSV opens directly in Excel. We lay each section as its own
        // table side-by-side (header / metrics / tasks / attendance /
        // performance) with a 1-column gap between, so the user gets
        // five distinct mini-tables on a single sheet rather than one
        // long stacked file.
        exportRowsToCsv(
          placeSectionsHorizontally(reportToCsvSections(report)),
          fileBase,
        );
      } else if (printRef.current) {
        const node = printRef.current;
        if (kind === "png")
          await exportNodeToPng(node, { filename: fileBase });
        else if (kind === "jpeg")
          await exportNodeToJpeg(node, { filename: fileBase });
        else if (kind === "pdf")
          await exportNodeToPdf(node, { filename: fileBase });
      }
    } catch (err) {
      console.error("Report export failed:", err);
    } finally {
      setBusy(null);
    }
  };

  // Don't mount anything until we have both an open signal and resolved data.
  // The parent is responsible for keeping `employee` + `range` alive through
  // the close animation (it should clear them on a delay).
  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-foreground/70 backdrop-blur-[2px]" />
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[760px] max-w-[760px] p-0 gap-0 overflow-hidden border-none rounded-[16px] bg-muted shadow-2xl flex flex-col max-h-[92vh]"
      >


        {/* Header — outside the print surface so the close button is not
            captured in the PNG/PDF export. */}
        <div className="px-[28px] pt-[24px] pb-[12px] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-[12px] min-w-0">
            <Avatar className="size-[40px] rounded-full ring-2 ring-background shrink-0">
              <AvatarImage src={report.employee.avatar} alt={report.employee.name} />
              <AvatarFallback className="text-[12px] font-bold">
                {initials(report.employee.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col min-w-0">
              <Typography
                as="h2"
                className="text-[20px] font-bold text-foreground leading-[24px] truncate font-janna"
              >
                {report.employee.name}&apos;s Report
              </Typography>
              <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground leading-[18px] tabular-nums">
                <span>From: {format(report.range.from, "d/M/yyyy")}</span>
                <span>To: {format(report.range.to, "d/M/yyyy")}</span>
              </div>
            </div>

          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close report"
            className="bg-secondary size-9 rounded-full flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors shrink-0"
          >
            <X className="size-4 text-foreground" strokeWidth={3} />
          </button>

        </div>

        {/* Scrollable print surface — everything inside is what gets rastered.
            `no-scrollbar` hides the native scrollbar to match the design. */}
        <div className="overflow-y-auto no-scrollbar px-[28px] pb-3 flex-1 min-h-0">
          <div
            ref={printRef}
            className="flex flex-col gap-4 bg-muted py-3"
          >

            {/* Performance and stats card */}
            <section className="bg-background rounded-xl p-5 flex flex-col gap-4 ring-1 ring-border">
              <div className="flex flex-col gap-[2px]">
                <Typography
                  as="h3"
                  className="text-base font-bold text-foreground leading-[22px] font-janna"
                >
                  Performance and stats
                </Typography>
                <Typography className="text-sm font-bold text-muted-foreground leading-[18px] font-janna">
                  Your personal information and account details
                </Typography>
              </div>


              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {METRIC_STYLES.map((m) => {
                  const sec = secondsForMetric(report, m.key);
                  return (
                    <div
                      key={m.key}
                      className="rounded-[10px] px-3 py-2.5 flex flex-col items-center justify-center gap-[2px] min-h-[64px]"
                      style={{ backgroundColor: m.bg, color: m.text }}
                    >
                      <span
                        className="text-sm font-bold leading-[16px] font-janna"
                        style={{ color: m.text }}
                      >
                        {m.label}
                      </span>
                      <span
                        className="text-base font-bold leading-[20px] tabular-nums font-janna"
                        style={{ color: m.text }}
                      >
                        {formatHMS(sec)}
                      </span>
                    </div>
                  );
                })}
              </div>

            </section>

            {/* Two-column row: Tasks status + Attendance rate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tasks Status */}
              <section className="bg-background rounded-xl p-5 flex flex-col gap-3.5 ring-1 ring-border">
                <Typography
                  as="h3"
                  className="text-base font-bold text-foreground leading-[22px] font-janna"
                >
                  Tasks Status
                </Typography>
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] font-bold leading-[28px] text-primary tabular-nums font-janna">
                    {totalTasks(report)}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground leading-[18px] font-janna">
                    Total Tasks
                  </span>
                </div>
                <TasksProgressBar tasks={report.tasks} />
              </section>

              {/* Attendance Rate */}
              <section className="bg-background rounded-xl p-5 flex flex-col gap-3.5 ring-1 ring-border">
                <Typography
                  as="h3"
                  className="text-base font-bold text-foreground leading-[22px] font-janna"
                >
                  Attendance Rate
                </Typography>
                <span className="text-[28px] font-bold leading-[28px] text-primary tabular-nums font-janna">
                  {report.attendance.rate}%
                </span>
                <AttendanceHeatmap weeks={report.attendance.weeks} />
              </section>
            </div>


            {/* Performance Overview */}
            <section className="bg-background rounded-xl p-5 flex flex-col gap-3 ring-1 ring-border">
              <Typography
                as="h3"
                className="text-base font-bold text-foreground leading-[22px] font-janna"
              >
                Performance Overview
              </Typography>
              <span className="text-[28px] font-bold leading-[28px] text-primary tabular-nums font-janna">
                {report.performance.averagePct.toFixed(2)}%
              </span>
              <PerformanceLineChart data={report.performance.daily} />
            </section>

          </div>
        </div>

        {/* Footer actions */}
        <div className="px-[28px] py-4 flex items-center gap-2 shrink-0 border-t border-border bg-muted">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              onNewReport?.();
              onOpenChange(false);
            }}
            className="bg-secondary hover:bg-secondary/80 text-foreground h-[44px] px-5 rounded-xl font-bold text-sm font-janna shadow-none"
          >
            New Report
          </Button>


          {/* Split button: primary action defaults to PDF, dropdown picks the format. */}
          <div className="flex flex-1 items-stretch rounded-xl overflow-hidden">
            <Button
              type="button"
              onClick={() => handleExport("pdf")}
              disabled={!!busy}
              className={cn(
                "flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-[44px]",
                "rounded-l-xl rounded-r-none font-bold text-sm shadow-none",
                "transition-all active:scale-[0.99] font-janna px-5",
                "disabled:opacity-80",
              )}
              aria-label="Download report as PDF"
            >
              {busy === "pdf" ? (
                <Loader2 className="size-3.5 animate-spin" strokeWidth={2.5} />
              ) : (
                <Download className="size-3.5" strokeWidth={2.5} />
              )}
              {busy === "pdf" ? "Generating PDF…" : "Download Report"}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                disabled={!!busy}
                className={cn(
                  "bg-primary hover:bg-primary/90 text-primary-foreground px-3 h-[44px]",
                  "border-l border-primary-foreground/15 rounded-r-xl flex items-center justify-center",
                  "transition-colors disabled:opacity-80 outline-none",
                )}
                aria-label="Choose another export format"
              >

                <span className="i-chevron-down" aria-hidden>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="top"
                className="w-[200px] bg-background border border-border rounded-xl p-1 shadow-lg"
              >

                <ExportItem
                  icon={<FileText className="size-4 text-primary" />}
                  label="PDF document"
                  hint=".pdf"
                  busy={busy === "pdf"}
                  onSelect={() => handleExport("pdf")}
                />
                <ExportItem
                  icon={<ImageIcon className="size-4 text-primary" />}
                  label="PNG image"
                  hint=".png"
                  busy={busy === "png"}
                  onSelect={() => handleExport("png")}
                />
                <ExportItem
                  icon={<FileImage className="size-4 text-primary" />}
                  label="JPEG image"
                  hint=".jpg"
                  busy={busy === "jpeg"}
                  onSelect={() => handleExport("jpeg")}
                />
                <ExportItem
                  icon={<FileSpreadsheet className="size-4 text-success" />}
                  label="Excel (CSV)"
                  hint=".csv"
                  busy={busy === "csv"}
                  onSelect={() => handleExport("csv")}
                />
                <ExportItem
                  icon={<FileJson className="size-4 text-primary" />}
                  label="Raw data"
                  hint=".json"
                  busy={busy === "json"}
                  onSelect={() => handleExport("json")}
                />

              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- helpers ----------------------------------------------------------------

function ExportItem({
  icon,
  label,
  hint,
  busy,
  onSelect,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  busy?: boolean;
  onSelect: () => void;
}) {
  return (
    <DropdownMenuItem
      onClick={onSelect}
      disabled={busy}
      className="flex items-center justify-between gap-2 px-3 py-2 cursor-pointer focus:bg-secondary rounded-lg"
    >
      <span className="flex items-center gap-2">
        {busy ? <Loader2 className="size-4 animate-spin text-primary" /> : icon}
        <span className="text-sm font-bold text-foreground font-janna">
          {label}
        </span>
      </span>
      <span className="text-xs font-bold text-muted-foreground font-janna tabular-nums">
        {hint}
      </span>
    </DropdownMenuItem>

  );
}

function secondsForMetric(
  report: EmployeeReportData,
  key: (typeof METRIC_STYLES)[number]["key"],
): number {
  switch (key) {
    case "working":
      return report.metrics.workingSec;
    case "meeting":
      return report.metrics.meetingSec;
    case "break":
      return report.metrics.breakSec;
    case "idle":
      return report.metrics.idleSec;
    case "overtime":
      return report.metrics.overtimeSec;
  }
}

function totalTasks(report: EmployeeReportData): number {
  const t = report.tasks;
  return t.completed + t.inProgress + t.notStarted;
}

function initials(name: string): string {
  if (!name) return "??";
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function slugify(s: string): string {
  if (!s) return "unknown";
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
