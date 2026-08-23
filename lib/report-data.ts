import { addDays, differenceInCalendarDays, startOfDay } from "date-fns";
import type {
  AttendanceCell,
  AttendanceLevel,
} from "@/components/hr-dashboard/charts/attendance-heatmap";
import type { PerformancePoint } from "@/components/hr-dashboard/charts/performance-line-chart";
import type { TasksBreakdown } from "@/components/hr-dashboard/charts/tasks-progress-bar";

export interface EmployeeReportInput {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface EmployeeReportData {
  employee: EmployeeReportInput;
  range: { from: Date; to: Date };
  // Performance + stats — mirror Figma metric chips.
  metrics: {
    workingSec: number;
    meetingSec: number;
    breakSec: number;
    idleSec: number;
    overtimeSec: number;
  };
  tasks: TasksBreakdown;
  attendance: {
    rate: number; // 0-100
    weeks: AttendanceCell[][];
  };
  performance: {
    averagePct: number; // 0-100
    daily: PerformancePoint[];
  };
}

/**
 * Build the CSV export as a list of independent sections. Each section is
 * itself a 2D table (rows × cols). Callers feed this into
 * `placeSectionsHorizontally()` (in `lib/report-export`) so the sections
 * render side-by-side in Excel rather than stacked vertically.
 *
 *   1. Header block — employee name + role + date range
 *   2. Performance and stats — one row per metric with its HH:MM:SS value
 *   3. Tasks Status — counts + percentages
 *   4. Attendance Rate — overall %, then a row per recorded day
 *   5. Performance Overview — average %, then a row per day
 */
export function reportToCsvSections(
  report: EmployeeReportData,
): Array<Array<Array<unknown>>> {
  const fmtDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;

  // 1. Header
  const header: Array<Array<unknown>> = [
    ["Employee Report", ""],
    ["Name", report.employee.name],
  ];
  if (report.employee.role) header.push(["Role", report.employee.role]);
  header.push(["Employee ID", report.employee.id]);
  header.push(["From", fmtDate(report.range.from)]);
  header.push(["To", fmtDate(report.range.to)]);

  // 2. Performance and stats
  const metricRows: Array<[string, number]> = [
    ["Working", report.metrics.workingSec],
    ["Meeting", report.metrics.meetingSec],
    ["Break", report.metrics.breakSec],
    ["IDLE", report.metrics.idleSec],
    ["Overtime", report.metrics.overtimeSec],
  ];
  const stats: Array<Array<unknown>> = [
    ["Performance and stats", "", ""],
    ["Metric", "Duration (HH:MM:SS)", "Total seconds"],
    ...metricRows.map(([label, sec]) => [label, formatHMS(sec), sec]),
  ];

  // 3. Tasks Status
  const t = report.tasks;
  const total = t.completed + t.inProgress + t.notStarted;
  const pct = (n: number) =>
    total === 0 ? 0 : Math.round((n / total) * 1000) / 10; // 1-decimal %
  const tasks: Array<Array<unknown>> = [
    ["Tasks Status", "", ""],
    ["Status", "Count", "Percent"],
    ["Completed", t.completed, pct(t.completed)],
    ["In Progress", t.inProgress, pct(t.inProgress)],
    ["Not started yet", t.notStarted, pct(t.notStarted)],
    ["Total", total, total === 0 ? 0 : 100],
  ];

  // 4. Attendance Rate
  const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const attendance: Array<Array<unknown>> = [
    ["Attendance Rate", "", "", ""],
    ["Overall", `${report.attendance.rate}%`, "", ""],
    ["Date", "Day of week", "Status", "Label"],
  ];
  for (const week of report.attendance.weeks) {
    for (const cell of week) {
      if (cell.level === "none") continue;
      attendance.push([
        fmtDate(cell.date),
        DOW[cell.date.getDay()],
        cell.level,
        cell.label ?? "",
      ]);
    }
  }

  // 5. Performance Overview
  const perf: Array<Array<unknown>> = [
    ["Performance Overview", ""],
    ["Average %", report.performance.averagePct],
    ["Date", "Performance %"],
    ...report.performance.daily.map((p) => [fmtDate(p.date), p.value]),
  ];

  return [header, stats, tasks, attendance, perf];
}

/** Format seconds to "HH:MM:SS" with zero-padding. */
export function formatHMS(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(r)}`;
}

/**
 * Build a deterministic mock report so the UI is fully populated even
 * without backend integration. Real data should come from the API service
 * via `generateReport()` — this is the fallback used by the modal in dev
 * and as the seed shape for the live integration.
 *
 * The seeding is hash-based on the employee id + range so the same inputs
 * always produce the same report (important for snapshot/PDF stability).
 */
export function buildMockReport(
  employee: EmployeeReportInput,
  range: { from: Date; to: Date },
): EmployeeReportData {
  // Cheap deterministic PRNG (mulberry32) seeded from id + range.
  const seedString = `${employee.id}|${range.from.getTime()}|${range.to.getTime()}`;
  let h = 2166136261;
  for (let i = 0; i < seedString.length; i++) {
    h ^= seedString.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rand = () => {
    h |= 0;
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const days = Math.max(
    1,
    differenceInCalendarDays(range.to, range.from) + 1,
  );
  const start = startOfDay(range.from);

  // Performance daily series — bias toward the 70-95% band.
  const daily: PerformancePoint[] = Array.from({ length: days }, (_, i) => ({
    date: addDays(start, i),
    value: Math.round(70 + rand() * 25 + (i % 3 === 0 ? -3 : 1)),
  }));
  const averagePct =
    daily.reduce((acc, p) => acc + p.value, 0) / Math.max(1, daily.length);

  // Tasks: ~48 total, ~70% complete bias.
  const total = 40 + Math.floor(rand() * 20);
  const completed = Math.floor(total * (0.6 + rand() * 0.15));
  const inProgress = Math.floor((total - completed) * (0.4 + rand() * 0.2));
  const notStarted = total - completed - inProgress;

  // Attendance: build 4 weeks of data ending on `range.to`.
  const WEEKS = 4;
  const DAYS = 7;
  const weeks: AttendanceCell[][] = [];
  let presentCount = 0;
  let totalCount = 0;
  // Start each row 7 days apart, oldest week first (top), most recent at bottom.
  for (let w = WEEKS - 1; w >= 0; w--) {
    const row: AttendanceCell[] = [];
    for (let d = 0; d < DAYS; d++) {
      const date = addDays(start, w * 7 + d);
      // Days outside the range render as `none` so the grid still aligns.
      if (date < start || date > range.to) {
        row.push({ date, level: "none" });
        continue;
      }
      const r = rand();
      let level: AttendanceLevel;
      if (r < 0.08) level = "absent";
      else if (r < 0.18) level = "low";
      else if (r < 0.45) level = "partial";
      else level = "full";
      if (level !== "absent") presentCount++;
      totalCount++;
      row.push({
        date,
        level,
        label:
          level === "absent"
            ? "Absent"
            : level === "low"
              ? "Half day"
              : level === "partial"
                ? "Partial"
                : "Full day",
      });
    }
    weeks.push(row);
  }
  const rate = totalCount === 0 ? 0 : (presentCount / totalCount) * 100;

  // Time-tracking metrics — derived per total range, not per day.
  // Working ~ 6-8h × days, meeting ~ 30-90m × days, etc.
  const dayCount = days;
  const workingSec = Math.round(dayCount * (6 + rand() * 2) * 3600);
  const meetingSec = Math.round(dayCount * (0.5 + rand() * 1) * 3600);
  const breakSec = Math.round(dayCount * (0.5 + rand() * 0.5) * 3600);
  const idleSec = Math.round(dayCount * (0.2 + rand() * 0.4) * 3600);
  const overtimeSec = Math.round(rand() < 0.5 ? 0 : rand() * 2 * 3600);

  return {
    employee,
    range,
    metrics: {
      workingSec,
      meetingSec,
      breakSec,
      idleSec,
      overtimeSec,
    },
    tasks: { completed, inProgress, notStarted },
    attendance: {
      rate: Math.round(rate),
      weeks,
    },
    performance: {
      averagePct: Math.round(averagePct * 100) / 100,
      daily,
    },
  };
}
