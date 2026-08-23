"use client";

import * as React from "react";
import { format } from "date-fns";

export interface PerformancePoint {
  date: Date;
  value: number; // 0-100
}

interface PerformanceLineChartProps {
  data: PerformancePoint[];
  /** Inline height (px) for the SVG, defaults to 180 */
  height?: number;
  /** Hide hover affordances (used for static export snapshots). */
  staticMode?: boolean;
}

const COLOR_PRIMARY = "#0047FF";
const COLOR_FILL = "rgba(0, 71, 255, 0.08)";
const COLOR_GRID = "#E2E8F0";
const COLOR_AXIS_TEXT = "#707070";

/**
 * Step / Gantt-style daily performance chart.
 *
 * Each day gets a horizontal segment centered on its tick, drawn at that
 * day's percentage. Adjacent segments are linked by short vertical edges
 * to produce the staircase pattern shown in Figma. The area below the
 * staircase is filled with the primary tint.
 *
 * Renders as inline SVG so it serializes cleanly into PNG/PDF exports
 * and supports a hover crosshair + dot tooltip.
 */
export function PerformanceLineChart({
  data,
  height = 180,
  staticMode = false,
}: PerformanceLineChartProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(640);
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);

  // Responsive: track parent width.
  React.useEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 640;
      setWidth(Math.max(280, Math.floor(w)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Layout
  const padding = { top: 16, right: 16, bottom: 28, left: 36 };
  const innerW = Math.max(1, width - padding.left - padding.right);
  const innerH = Math.max(1, height - padding.top - padding.bottom);

  // X scale — center each day inside its column. The first/last segments
  // therefore extend to the chart edges (half a column on each side).
  const n = data.length;
  const stepW = n === 0 ? innerW : innerW / n;
  const xCenter = (i: number) => padding.left + stepW * (i + 0.5);
  const xLeft = (i: number) => padding.left + stepW * i;
  const xRight = (i: number) => padding.left + stepW * (i + 1);
  const yFor = (v: number) => padding.top + innerH - (v / 100) * innerH;
  const baseline = padding.top + innerH;

  // Build the step polyline. For each day i:
  //   - move horizontally across the day's column at y[i]
  //   - then drop a vertical edge to y[i+1] at the column boundary
  // The path implicitly closes vertically at column boundaries because the
  // horizontal end of one segment shares its X with the next segment's start.
  const stepPath = React.useMemo(() => {
    if (n === 0) return "";
    const cmds: string[] = [];
    cmds.push(`M ${xLeft(0)},${yFor(data[0].value)}`);
    for (let i = 0; i < n; i++) {
      const y = yFor(data[i].value);
      cmds.push(`L ${xRight(i)},${y}`);
      if (i < n - 1) {
        cmds.push(`L ${xRight(i)},${yFor(data[i + 1].value)}`);
      }
    }
    return cmds.join(" ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, width, height]);

  // Area path: same step shape but closed down to the baseline.
  const areaPath = React.useMemo(() => {
    if (n === 0) return "";
    const cmds: string[] = [];
    cmds.push(`M ${xLeft(0)},${baseline}`);
    cmds.push(`L ${xLeft(0)},${yFor(data[0].value)}`);
    for (let i = 0; i < n; i++) {
      const y = yFor(data[i].value);
      cmds.push(`L ${xRight(i)},${y}`);
      if (i < n - 1) {
        cmds.push(`L ${xRight(i)},${yFor(data[i + 1].value)}`);
      }
    }
    cmds.push(`L ${xRight(n - 1)},${baseline}`);
    cmds.push("Z");
    return cmds.join(" ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, width, height]);

  // Y grid (0/25/50/75/100)
  const yTicks = [0, 25, 50, 75, 100];

  // X axis labels — keep readable: ~10 evenly distributed.
  const xLabelStride = n <= 12 ? 1 : Math.ceil(n / 10);

  // Hover handler — convert pointer X into nearest day column.
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (staticMode || n === 0) return;
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const px = e.clientX - rect.left;
    const localX = (px / rect.width) * width - padding.left;
    const idx = Math.max(0, Math.min(n - 1, Math.floor(localX / stepW)));
    setHoverIdx(idx);
  };

  const active = hoverIdx !== null ? data[hoverIdx] : null;
  const activeX = hoverIdx !== null ? xCenter(hoverIdx) : 0;
  const activeY = hoverIdx !== null ? yFor(data[hoverIdx].value) : 0;

  return (
    <div ref={wrapperRef} className="w-full relative select-none">
      <svg
        role="img"
        aria-label="Daily performance trend"
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHoverIdx(null)}
        className="overflow-visible touch-none"
      >
        {/* Y grid + labels */}
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={yFor(t)}
              y2={yFor(t)}
              stroke={COLOR_GRID}
              strokeDasharray={t === 0 ? undefined : "2 4"}
              strokeWidth={1}
            />
            <text
              x={padding.left - 6}
              y={yFor(t) + 3}
              textAnchor="end"
              fontSize={10}
              fontWeight={700}
              fill={COLOR_AXIS_TEXT}
              fontFamily="inherit"
            >
              {t}%
            </text>
          </g>
        ))}

        {/* Filled area under the staircase */}
        {n > 0 && <path d={areaPath} fill={COLOR_FILL} />}

        {/* Stepped trend line */}
        {n > 0 && (
          <path
            d={stepPath}
            fill="none"
            stroke={COLOR_PRIMARY}
            strokeWidth={2}
            strokeLinejoin="miter"
            strokeLinecap="square"
          />
        )}

        {/* X axis labels — anchored at each day's center */}
        {data.map((d, i) => {
          if (i % xLabelStride !== 0 && i !== n - 1) return null;
          return (
            <text
              key={i}
              x={xCenter(i)}
              y={height - 8}
              textAnchor="middle"
              fontSize={10}
              fontWeight={700}
              fill={COLOR_AXIS_TEXT}
              fontFamily="inherit"
            >
              {format(d.date, "d MMM")}
            </text>
          );
        })}

        {/* Hover crosshair + dot — anchored on the active day's center */}
        {active && (
          <g pointerEvents="none">
            <line
              x1={activeX}
              x2={activeX}
              y1={padding.top}
              y2={padding.top + innerH}
              stroke={COLOR_PRIMARY}
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.4}
            />
            <circle
              cx={activeX}
              cy={activeY}
              r={5}
              fill={COLOR_PRIMARY}
              stroke="#fff"
              strokeWidth={2}
            />
          </g>
        )}
      </svg>

      {/* Hover tooltip — DOM-positioned so it stays crisp */}
      {active && hoverIdx !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-md bg-[#343434] px-2 py-1 text-[10px] font-bold text-white shadow-lg"
          style={{
            left: `${(activeX / width) * 100}%`,
            top: `${(activeY / height) * 100}%`,
            marginTop: -8,
          }}
        >
          {format(active.date, "d MMM")} · {active.value.toFixed(2)}%
        </div>
      )}
    </div>
  );
}
