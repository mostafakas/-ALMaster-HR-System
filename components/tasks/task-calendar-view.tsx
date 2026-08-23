"use client";

import * as React from "react";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { Typography } from "@/components/ui/typography";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  TASK_STATUS_META,
  type TaskCalendarRange,
  type TaskRecord,
} from "@/lib/types/task";
import { TASK_DRAG_MIME, useTaskDrag } from "./use-task-drag";

export interface TaskCalendarViewProps {
  tasks: TaskRecord[];
  range: TaskCalendarRange;
  anchor: Date;
  onOpenTask?: (task: TaskRecord) => void;
  onMoveTaskToDay?: (taskId: string, nextDay: Date, hour?: number) => void;
}

const WEEKDAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"];
const WEEKDAY_INDICES = [6, 0, 1, 2, 3, 4];
const ROW_DAYS = 6;

export function TaskCalendarView(props: TaskCalendarViewProps) {
  const drag = useTaskDrag();
  if (props.range === "month") return <MonthCalendar {...props} drag={drag} />;
  if (props.range === "week") return <WeekCalendar {...props} drag={drag} />;
  return <DayCalendar {...props} drag={drag} />;
}

type DragApi = ReturnType<typeof useTaskDrag>;

function buildMonthGrid(anchor: Date): Date[] {
  const first = startOfMonth(anchor);
  const last = endOfMonth(anchor);
  const leading: Date[] = [];
  const firstWeekdayIdx = WEEKDAY_INDICES.indexOf(first.getDay());
  for (let i = firstWeekdayIdx; i > 0; i--) leading.push(addDays(first, -i));
  const all = [...leading, ...eachDayOfInterval({ start: first, end: last })];
  while (all.length % ROW_DAYS !== 0) all.push(addDays(all[all.length - 1]!, 1));
  return all;
}

/* ─── Month calendar ───────────────────────────────────────────────── */

function MonthCalendar({
  tasks,
  anchor,
  onOpenTask,
  onMoveTaskToDay,
  drag,
}: TaskCalendarViewProps & { drag: DragApi }) {
  const days = React.useMemo(() => buildMonthGrid(anchor), [anchor]);

  return (
    <div className="w-full mb-4">
      {/* Sticky weekday header — lives outside overflow-clip so sticky works */}
      <div className="sticky top-0 z-10 rounded-t-[20px] bg-secondary border-[0.5px] border-b-0 border-secondary grid grid-cols-6">
        {WEEKDAYS.map((day) => (
          <div key={day} className="flex items-center justify-center py-3.5">
            <Typography className="text-[16px] leading-[20px] text-muted-foreground">
              {day}
            </Typography>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-6 border-[0.5px] border-t-0 border-secondary rounded-b-[20px] overflow-clip bg-background">
        {days.map((day) => {
          const dayTasks = tasks.filter((t) => {
            try {
              return isSameDay(parseISO(t.dueDate), day);
            } catch {
              return false;
            }
          });
          const outside = !isSameMonth(day, anchor);
          const today = isToday(day);
          const targetKey = `day-${day.toISOString()}`;
          const hovered = drag.hoveredTarget === targetKey && drag.draggingId !== null;
          const drop = drag.dropHandlers(targetKey, (id) => onMoveTaskToDay?.(id, day));

          return (
            <div
              key={day.toISOString()}
              {...drop}
              className={cn(
                "relative border border-[#e3e8ed] p-3 flex flex-col gap-3 items-start min-h-[152px] transition-colors",
                outside && "bg-muted/40",
                today && "bg-primary/15 border-b-2 border-b-primary",
                hovered && "ring-2 ring-inset ring-primary/50 z-10"
              )}
            >
              <div className="flex items-center justify-between w-full h-4">
                {today ? (
                  <div className="flex items-center gap-1">
                    <span className="size-1 rounded-full bg-primary shrink-0" />
                    <Typography as="span" className="text-[14px] leading-[16px] text-primary">
                      {format(day, "d")}
                    </Typography>
                    <Typography as="span" className="text-[14px] leading-[16px] text-primary">
                      (Today)
                    </Typography>
                  </div>
                ) : (
                  <Typography
                    as="span"
                    className={cn(
                      "text-[14px] leading-[16px] tabular-nums",
                      outside ? "text-text-disabled" : "text-muted-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </Typography>
                )}
                {dayTasks.length > 0 && (
                  <Typography as="span" className="text-[14px] leading-[16px] tabular-nums text-primary">
                    {dayTasks.length}
                  </Typography>
                )}
              </div>

              <div className="flex flex-col gap-1 w-full">
                {dayTasks.slice(0, 4).map((task) => (
                  <CalendarTaskChip
                    key={task.id}
                    task={task}
                    onClick={onOpenTask}
                    dragHandlers={drag.dragHandlers(task.id)}
                    isDragging={drag.draggingId === task.id}
                  />
                ))}
                {dayTasks.length > 4 && (
                  <ShowMorePopover day={day} tasks={dayTasks} onOpenTask={onOpenTask} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Shared hour constants ─────────────────────────────────────────── */

const HOUR_HEIGHT = 140;
const HOURS = Array.from({ length: 12 }, (_, i) => 8 + i);

function hourLabel(h: number) {
  return format(new Date(new Date(0).setHours(h, 0, 0, 0)), "ha");
}

/* ─── Week calendar ────────────────────────────────────────────────── */
/*
 * Layout: hour labels float LEFT of the rounded card (outside it).
 * Both the label column AND the card live inside ONE scroll container
 * so they scroll together naturally — no JS scroll-sync needed.
 *
 * The day-header row is rendered ABOVE the scroll area so it stays
 * visible while the user scrolls through hours. A matching spacer in
 * the label column preserves alignment.
 */

function WeekCalendar({
  tasks,
  anchor,
  onOpenTask,
  onMoveTaskToDay,
  drag,
}: TaskCalendarViewProps & { drag: DragApi }) {
  const weekStart = startOfWeek(anchor, { weekStartsOn: 6 });
  const days = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 5) });

  const gridRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = React.useState(72);
  const [hover, setHover] = React.useState<{ dayKey: string; hour: number } | null>(null);

  React.useLayoutEffect(() => {
    if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
  }, []);

  const compute = (e: React.DragEvent): { day: Date; hour: number } | null => {
    const grid = gridRef.current;
    if (!grid) return null;
    const rect = grid.getBoundingClientRect();
    const colWidth = rect.width / days.length;
    const dayIdx = Math.floor((e.clientX - rect.left) / colWidth);
    const hourIdx = Math.floor((e.clientY - rect.top) / HOUR_HEIGHT);
    if (dayIdx < 0 || dayIdx >= days.length) return null;
    if (hourIdx < 0 || hourIdx >= HOURS.length) return null;
    return { day: days[dayIdx]!, hour: HOURS[hourIdx]! };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const c = compute(e);
    if (!c) return;
    const key = c.day.toISOString();
    if (hover?.dayKey !== key || hover.hour !== c.hour) setHover({ dayKey: key, hour: c.hour });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData(TASK_DRAG_MIME) || e.dataTransfer.getData("text/plain");
    const c = compute(e);
    if (id && c) onMoveTaskToDay?.(id, c.day, c.hour);
    setHover(null);
    drag.endDrag();
  };

  const colTemplate = `repeat(${days.length}, minmax(0, 1fr))`;

  return (
    <div className="mb-4">
      {/* ── Non-scrolling header row ── */}
      <div className="flex gap-4">
        {/* Spacer aligns with the label column */}
        <div className="w-12 shrink-0" />
        {/* Day-name header — top half of the rounded card */}
        <div
          ref={headerRef}
          className="flex-1 rounded-t-[20px] overflow-clip bg-secondary border-[0.5px] border-b-0 border-secondary grid"
          style={{ gridTemplateColumns: colTemplate }}
        >
          {days.map((day) => {
            const today = isToday(day);
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "flex flex-col items-center justify-center py-3 gap-0.5",
                  "border-l border-[#e3e8ed] first:border-l-0",
                  today && "bg-primary/15"
                )}
              >
                <div className="flex items-center gap-1">
                  {today && <span className="size-1 rounded-full bg-primary shrink-0" />}
                  <Typography
                    className={cn(
                      "text-[14px] leading-[16px]",
                      today ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {today ? `${format(day, "EEE")} (Today)` : format(day, "EEE")}
                  </Typography>
                </div>
                <Typography
                  className={cn(
                    "text-[16px] leading-[20px] tabular-nums",
                    today ? "text-primary" : "text-foreground"
                  )}
                >
                  {format(day, "d")}
                </Typography>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Scrollable body: label column + grid in the SAME container ── */}
      <div className="max-h-[600px] overflow-y-auto no-scrollbar">
        <div className="flex gap-4">
          {/* Hour labels — scroll naturally with the grid */}
          <div className="w-12 shrink-0">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="flex items-start justify-end pr-2 pt-3"
                style={{ height: HOUR_HEIGHT }}
              >
                <Typography className="text-[12px] leading-[14px] text-muted-foreground tabular-nums">
                  {hourLabel(hour)}
                </Typography>
              </div>
            ))}
          </div>

          {/* Grid — bottom half of the rounded card */}
          <div className="flex-1 rounded-b-[20px] overflow-clip bg-background border-[0.5px] border-secondary">
            <div
              ref={gridRef}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragLeave={(e) => {
                if (!gridRef.current?.contains(e.relatedTarget as Node)) setHover(null);
              }}
              className="grid"
              style={{ gridTemplateColumns: colTemplate }}
            >
              {HOURS.map((hour, hourIdx) => (
                <React.Fragment key={hour}>
                  {days.map((day) => {
                    const dayTasks = tasks.filter((t) => {
                      try {
                        if (!isSameDay(parseISO(t.dueDate), day)) return false;
                        if (!t.startTime) return hour === 8;
                        return parseInt(t.startTime.split(":")[0]!, 10) === hour;
                      } catch {
                        return false;
                      }
                    });
                    const today = isToday(day);
                    const isHover =
                      hover?.dayKey === day.toISOString() && hover.hour === hour;

                    return (
                      <div
                        key={day.toISOString() + hour}
                        style={{ height: HOUR_HEIGHT }}
                        className={cn(
                          "relative p-2 flex flex-col gap-1 overflow-hidden transition-colors",
                          "border-l border-[#e3e8ed] first:border-l-0",
                          hourIdx !== 0 && "border-t border-[#e3e8ed]",
                          today && "bg-primary/15",
                          isHover && "bg-primary/20 ring-2 ring-inset ring-primary/50 z-10"
                        )}
                      >
                        {dayTasks.slice(0, 3).map((task) => (
                          <CalendarTaskChip
                            key={task.id}
                            task={task}
                            onClick={onOpenTask}
                            dragHandlers={drag.dragHandlers(task.id)}
                            isDragging={drag.draggingId === task.id}
                          />
                        ))}
                        {dayTasks.length > 3 && (
                          <ShowMorePopover day={day} tasks={dayTasks} onOpenTask={onOpenTask} />
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Day calendar ─────────────────────────────────────────────────── */
/*
 * Layout: hour labels float LEFT (same scroll container as the card).
 * D&D: handlers are on the OVERLAY div — not on gridRef.
 *   Placing them on the overlay guarantees every dragover/drop event
 *   that occurs anywhere inside the grid is handled directly (no
 *   bubbling needed through child elements). gridRef is kept only for
 *   getBoundingClientRect() to compute the hovered hour.
 * Chips: lane-based layout — overlapping tasks render side-by-side.
 */

interface TaskLayout {
  task: TaskRecord;
  lane: number;
  totalLanes: number;
}

function computeLanes(tasks: TaskRecord[]): TaskLayout[] {
  if (tasks.length === 0) return [];
  const items = tasks.map((task) => ({
    task,
    start: parseHour(task.startTime, 8),
    end: parseHour(task.startTime, 8) + parseDuration(task.startTime, task.endTime),
    lane: 0,
    totalLanes: 1,
  }));
  items.sort((a, b) => a.start - b.start);

  const laneEndTimes: number[] = [];
  for (const item of items) {
    const available = laneEndTimes.findIndex((et) => et <= item.start);
    if (available === -1) {
      item.lane = laneEndTimes.length;
      laneEndTimes.push(item.end);
    } else {
      item.lane = available;
      laneEndTimes[available] = item.end;
    }
  }
  const total = laneEndTimes.length;
  for (const item of items) item.totalLanes = total;
  return items;
}

function DayCalendar({
  tasks,
  anchor,
  onOpenTask,
  onMoveTaskToDay,
  drag,
}: TaskCalendarViewProps & { drag: DragApi }) {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [hoverHour, setHoverHour] = React.useState<number | null>(null);

  const dayTasks = React.useMemo(
    () =>
      tasks.filter((t) => {
        try {
          return isSameDay(parseISO(t.dueDate), anchor);
        } catch {
          return false;
        }
      }),
    [tasks, anchor]
  );

  const layouts = React.useMemo(() => computeLanes(dayTasks), [dayTasks]);

  /* Compute which hour row the cursor is over, using the grid div's rect
   * (the overlay is inset-0 so their rects are identical). */
  const computeHour = (e: React.DragEvent): number => {
    const grid = gridRef.current;
    if (!grid) return HOURS[0]!;
    const rect = grid.getBoundingClientRect();
    const idx = Math.floor((e.clientY - rect.top) / HOUR_HEIGHT);
    return HOURS[Math.max(0, Math.min(HOURS.length - 1, idx))]!;
  };

  /* Handlers live on the OVERLAY div so they fire directly on every
   * drag event inside the grid — no bubbling chain that could break. */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const h = computeHour(e);
    if (h !== hoverHour) setHoverHour(h);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id =
      e.dataTransfer.getData(TASK_DRAG_MIME) ||
      e.dataTransfer.getData("text/plain");
    if (id) onMoveTaskToDay?.(id, anchor, computeHour(e));
    setHoverHour(null);
    drag.endDrag();
  };

  return (
    <div className="mb-4">
      {/* Single scroll container — labels and card scroll together */}
      <div className="max-h-[680px] overflow-y-auto no-scrollbar">
        <div className="flex gap-4">
          {/* Hour labels column */}
          <div className="w-12 shrink-0">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="flex items-start justify-end pr-2 pt-3"
                style={{ height: HOUR_HEIGHT }}
              >
                <Typography className="text-[12px] leading-[14px] text-muted-foreground tabular-nums">
                  {hourLabel(hour)}
                </Typography>
              </div>
            ))}
          </div>

          {/* Rounded calendar card */}
          <div className="flex-1 rounded-[20px] overflow-clip border-[0.5px] border-secondary bg-background">
            <div ref={gridRef} className="relative">
              {/* Hour row backgrounds — also carry the hover highlight */}
              {HOURS.map((hour, i) => (
                <div
                  key={hour}
                  style={{ height: HOUR_HEIGHT }}
                  className={cn(
                    i !== 0 && "border-t border-[#e3e8ed]",
                    hoverHour === hour && "bg-primary/10"
                  )}
                />
              ))}

              {/* ── Overlay ──────────────────────────────────────────────
               * Covers the full grid (inset-0). Receives ALL dragover /
               * drop events directly — no pointer-events toggling, no
               * bubbling dependency. Chips inside it do not have their
               * own drag-over handlers; events from chip children bubble
               * here and are handled immediately.
               * ─────────────────────────────────────────────────────── */}
              <div
                className="absolute inset-0"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragLeave={(e) => {
                  const overlay = e.currentTarget;
                  if (!overlay.contains(e.relatedTarget as Node)) {
                    setHoverHour(null);
                  }
                }}
              >
                {layouts.map(({ task, lane, totalLanes }) => {
                  const start = parseHour(task.startTime, 8);
                  const duration = parseDuration(task.startTime, task.endTime);
                  const top = (start - HOURS[0]!) * HOUR_HEIGHT + 8;
                  const height = duration * HOUR_HEIGHT - 16;
                  const laneWidth = 100 / totalLanes;
                  return (
                    <div
                      key={task.id}
                      className="absolute p-1"
                      style={{
                        top,
                        height,
                        left: `${lane * laneWidth}%`,
                        width: `${laneWidth}%`,
                      }}
                    >
                      <CalendarTaskChip
                        task={task}
                        onClick={onOpenTask}
                        dragHandlers={drag.dragHandlers(task.id)}
                        isDragging={drag.draggingId === task.id}
                        fill
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Helpers ──────────────────────────────────────────────────────── */

function parseHour(time: string | undefined, fallback: number): number {
  if (!time) return fallback;
  const parts = time.split(":");
  const h = parseInt(parts[0]!, 10);
  const m = parts[1] ? parseInt(parts[1], 10) : 0;
  return Math.max(8, Math.min(20, h + m / 60));
}

function parseDuration(start: string | undefined, end: string | undefined): number {
  const s = parseHour(start, 8);
  const e = parseHour(end, s + 1);
  return Math.max(1, e - s);
}

/* ─── Chip ─────────────────────────────────────────────────────────── */

function CalendarTaskChip({
  task,
  onClick,
  dragHandlers,
  isDragging,
  expanded,
  fill,
}: {
  task: TaskRecord;
  onClick?: (t: TaskRecord) => void;
  dragHandlers?: React.HTMLAttributes<HTMLDivElement> & { draggable?: boolean };
  isDragging?: boolean;
  expanded?: boolean;
  fill?: boolean;
}) {
  const status = TASK_STATUS_META[task.status];
  const justDragged = React.useRef(false);

  return (
    <div
      role="button"
      tabIndex={0}
      {...dragHandlers}
      onDragStart={(e) => {
        justDragged.current = true;
        dragHandlers?.onDragStart?.(e);
      }}
      onClick={() => {
        if (justDragged.current) {
          justDragged.current = false;
          return;
        }
        onClick?.(task);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick?.(task);
      }}
      className={cn(
        "rounded-[4px] border-l-2 px-3 w-full text-left transition-all outline-none cursor-grab active:cursor-grabbing",
        "hover:translate-y-[-1px]",
        fill
          ? "relative flex items-start py-2 h-full"
          : "flex items-center justify-between gap-2 py-1.5",
        expanded && !fill && "py-2",
        isDragging && "opacity-40"
      )}
      style={{
        backgroundColor: status.cssTintVar,
        borderLeftColor: status.cssVar,
      }}
    >
      <Typography
        as="span"
        className="text-[12px] leading-[20px] text-foreground truncate flex-1"
      >
        {task.title}
      </Typography>
      {fill ? (
        <span
          className="absolute top-2 right-2 size-1.5 rounded-full"
          style={{ backgroundColor: status.cssVar }}
        />
      ) : (
        <span
          className="size-1 rounded-full shrink-0"
          style={{ backgroundColor: status.cssVar }}
        />
      )}
    </div>
  );
}

/* ─── "+ N more" popover ───────────────────────────────────────────── */

function ShowMorePopover({
  day,
  tasks,
  onOpenTask,
}: {
  day: Date;
  tasks: TaskRecord[];
  onOpenTask?: (task: TaskRecord) => void;
}) {
  const remaining = tasks.length - 4;
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="text-left text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors w-fit outline-none"
          />
        }
      >
        +{remaining} more
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="w-[280px] bg-background border border-border shadow-xl p-3 flex flex-col gap-2 max-h-[420px] overflow-y-auto no-scrollbar rounded-[12px]"
      >
        <div className="flex items-center justify-between">
          <Typography className="text-[14px] text-foreground">
            {format(day, "EEE, d MMM")}
          </Typography>
          <Typography className="text-[12px] text-primary">
            {tasks.length} tasks
          </Typography>
        </div>
        <div className="h-px bg-border w-full" />
        <div className="flex flex-col gap-1.5">
          {tasks.map((task) => (
            <CalendarTaskChip
              key={task.id}
              task={task}
              onClick={(t) => {
                setOpen(false);
                onOpenTask?.(t);
              }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
