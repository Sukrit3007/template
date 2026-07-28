"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { useId } from "react";

import {
  CHART_MARKER_OPACITY,
  CHART_MARKER_PROGRESS,
  CHART_PROJECTION_OPACITY,
  CHART_PROJECTION_PROGRESS,
  CHART_REVEAL_PROGRESS,
  CHART_REVEAL_WIDTH,
  CHART_SVG_WIDTH,
} from "@/lib/animation";

const SVG_HEIGHT = 320;
/* Theme tokens rather than literals — SVG presentation attributes take a CSS
   value, so a palette change carries through here too. */
const CURVE_COLOR = "var(--color-brand)";
const MARKER_COLOR = "var(--color-contrast)";
const MARKER_OPACITY = 0.35;
/** x of the "today" gridline; both curves meet here. */
const MARKER_X = 350;

/** The week so far — revealed left-to-right by the clip rect. */
const ACTUAL_CURVE =
  "M 28 185.6 C 84 185.6, 84 249.60000000000002, 140 249.60000000000002 C 192.5 249.60000000000002, 192.5 208, 244.99999999999997 208 C 297.5 208, 297.5 176, 350 176 C 402.5 176, 402.5 128, 455 128 C 507.5 128, 507.5 70.4, 560 70.4 C 616 70.4, 616 38.4, 672 38.4";

/** The projection past today; fades up behind the actual curve. */
const PROJECTED_CURVE =
  "M 350 176 C 402.5 176, 402.5 102.4, 455 102.4 C 507.5 102.4, 507.5 57.599999999999994, 560 57.599999999999994 C 616 57.599999999999994, 616 160, 672 160";

/**
 * Step 3's energy readout. The curve draws itself as the card scrolls — the
 * clip rect widens left-to-right, then the marker line and the fainter
 * projection curve fade up behind it.
 *
 * `progress` is the parent card's own scroll progress, so the chart stays in
 * step with the card it belongs to.
 */
export function EnergyChart({
  progress,
  tabs,
  value,
  unit,
  delta,
  days,
  activeDay,
}: {
  progress: MotionValue<number>;
  tabs: readonly [string, string];
  value: string;
  unit: string;
  delta: string;
  days: readonly string[];
  activeDay: number;
}) {
  // Scoped so multiple charts can't collide on the same clip-path id.
  const clipId = useId();

  const revealWidth = useTransform(
    progress,
    CHART_REVEAL_PROGRESS,
    CHART_REVEAL_WIDTH,
  );
  const markerOpacity = useTransform(
    progress,
    CHART_MARKER_PROGRESS,
    CHART_MARKER_OPACITY,
  );
  const projectionOpacity = useTransform(
    progress,
    CHART_PROJECTION_PROGRESS,
    CHART_PROJECTION_OPACITY,
  );

  return (
    <div className="flex w-full flex-col gap-12 lg:max-w-[460px] lg:gap-16">
      <div className="flex flex-row items-center gap-20 px-4">
        <span className="font-sans text-16 font-medium text-contrast lg:text-18">
          {tabs[0]}
        </span>
        <span className="font-sans text-16 font-medium text-contrast/35 lg:text-18">
          {tabs[1]}
        </span>
      </div>

      <div className="relative flex aspect-[460/360] flex-col rounded-xl border border-contrast/15 bg-surface p-20 lg:p-24">
        <div className="flex flex-row items-start justify-between">
          <div className="flex flex-row items-baseline gap-8">
            <span className="font-serif text-[44px] leading-none font-normal text-contrast lg:text-[40px]">
              {value}
            </span>
            <span className="font-sans text-13 font-medium text-contrast/55 lg:text-15">
              {unit}
            </span>
          </div>
        </div>
        <span className="sr-only">{delta}</span>

        <div className="relative mt-16 flex-1 lg:mt-24">
          <svg
            viewBox={`0 0 ${CHART_SVG_WIDTH} ${SVG_HEIGHT}`}
            className="block h-full w-full overflow-visible"
            preserveAspectRatio="none"
          >
            <title>Chart</title>
            <defs>
              <clipPath id={clipId}>
                <motion.rect
                  x="0"
                  y="0"
                  height={SVG_HEIGHT}
                  style={{ width: revealWidth }}
                />
              </clipPath>
            </defs>

            <motion.path
              d={PROJECTED_CURVE}
              stroke={CURVE_COLOR}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={{ opacity: projectionOpacity }}
            />
            <path
              d={ACTUAL_CURVE}
              stroke={CURVE_COLOR}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              clipPath={`url(#${clipId})`}
            />
            <motion.line
              x1={MARKER_X}
              y1="0"
              x2={MARKER_X}
              y2={SVG_HEIGHT}
              stroke={MARKER_COLOR}
              strokeOpacity={MARKER_OPACITY}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              style={{ opacity: markerOpacity }}
            />
          </svg>
        </div>

        <div className="mt-12 grid grid-cols-7 text-center lg:mt-16">
          {days.map((day, index) => (
            <span
              key={day}
              className={`font-mono text-10 tracking-tight uppercase lg:text-12 ${
                index === activeDay ? "text-contrast/70" : "text-contrast/40"
              }`}
            >
              {day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
