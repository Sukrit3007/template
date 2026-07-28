/**
 * A code-drawn backdrop: a flat base colour with a few large radial-gradient
 * blobs drifting over it. Stands in for video/photography in every media slot.
 *
 * Two deliberate performance choices:
 *
 *   - **No `filter: blur()`.** A full-viewport blur is expensive, and a radial
 *     gradient is already soft — the blur would buy nothing and cost a lot on a
 *     page that runs scroll-linked work every frame.
 *   - **The loops are CSS keyframes, not a JS animation.** Transform-only
 *     keyframes stay on the compositor. Driving a continuous background from
 *     Motion's frame loop would put it in direct competition with the scroll
 *     tweens that actually need it. Same reasoning as `dot-grid.tsx`.
 *
 * Each blob ping-pongs via `animation-direction: alternate`, so there's no seam
 * to match — the loop is symmetric by construction.
 */

import { cn } from "@/lib/utils";

export type BackdropVariant = "aurora" | "deep" | "sweep" | "panel" | "wash";

type Blob = {
  /** Centre, as a percentage of the container. */
  x: number;
  y: number;
  /** Diameter, as a percentage of the container's larger axis. */
  size: number;
  color: string;
  alpha: number;
  /** Drift offset in percent, and scale delta, at the far end of the loop. */
  dx: number;
  dy: number;
  ds: number;
  seconds: number;
  delay: number;
};

const BRAND = "46, 34, 229"; //   #2e22e5 — --color-brand
const LIFT = "90, 77, 245"; //    lightened brand
const INDIGO = "27, 21, 128"; //  deepened brand
const MIDNIGHT = "13, 10, 61"; // near-black, blue cast

type VariantSpec = { base: string; blobs: Blob[] };

const VARIANTS: Record<BackdropVariant, VariantSpec> = {
  /** Mid-brightness, full-field. The hero mask only reveals a narrow strip, so
      there is no centred subject to miss. */
  aurora: {
    base: `rgb(${INDIGO})`,
    blobs: [
      { x: 72, y: 38, size: 95, color: BRAND, alpha: 0.95, dx: -8, dy: 6, ds: 1.15, seconds: 19, delay: 0 },
      { x: 24, y: 68, size: 80, color: LIFT, alpha: 0.55, dx: 10, dy: -8, ds: 1.2, seconds: 24, delay: -6 },
      { x: 50, y: 12, size: 70, color: MIDNIGHT, alpha: 0.8, dx: 6, dy: 10, ds: 1.1, seconds: 29, delay: -13 },
    ],
  },
  /** Dark by requirement: these sit under a 50% dim with white type over them. */
  deep: {
    base: `rgb(${MIDNIGHT})`,
    blobs: [
      { x: 30, y: 30, size: 85, color: INDIGO, alpha: 0.9, dx: 9, dy: 7, ds: 1.18, seconds: 23, delay: 0 },
      { x: 78, y: 72, size: 75, color: BRAND, alpha: 0.42, dx: -11, dy: -6, ds: 1.12, seconds: 31, delay: -9 },
      { x: 55, y: 95, size: 65, color: MIDNIGHT, alpha: 1, dx: 4, dy: -9, ds: 1.08, seconds: 27, delay: -15 },
    ],
  },
  /** Brand → ink, so the footer's wordmark and links stay legible over it. */
  sweep: {
    base: `linear-gradient(115deg, rgb(${BRAND}) 0%, rgb(${INDIGO}) 45%, #141414 100%)`,
    blobs: [
      { x: 18, y: 30, size: 80, color: LIFT, alpha: 0.4, dx: 8, dy: 8, ds: 1.15, seconds: 26, delay: 0 },
      { x: 82, y: 78, size: 70, color: MIDNIGHT, alpha: 0.7, dx: -7, dy: -5, ds: 1.1, seconds: 33, delay: -11 },
    ],
  },
  /** Portrait card slots — smaller, so fewer and larger blobs read better. */
  panel: {
    base: `rgb(${INDIGO})`,
    blobs: [
      { x: 40, y: 28, size: 120, color: BRAND, alpha: 0.9, dx: 8, dy: 10, ds: 1.2, seconds: 21, delay: 0 },
      { x: 70, y: 82, size: 100, color: LIFT, alpha: 0.5, dx: -9, dy: -8, ds: 1.15, seconds: 28, delay: -8 },
    ],
  },
  /** Tiny, behind the nav CTA label and under a backdrop-blur. */
  wash: {
    base: `rgb(${BRAND})`,
    blobs: [
      { x: 30, y: 40, size: 140, color: LIFT, alpha: 0.85, dx: 20, dy: 12, ds: 1.25, seconds: 14, delay: 0 },
    ],
  },
};

export function AnimatedBackdrop({
  variant,
  dim = 0,
  phase = 0,
  className,
}: {
  variant: BackdropVariant;
  /** Black overlay laid over the backdrop, 0–1 — mirrors `BackgroundVideo`. */
  dim?: number;
  /**
   * Seconds to shift this instance along its loop. Blob delays live in the
   * variant spec, so without an offset every instance of a variant animates in
   * perfect sync — three identical panels side by side read as a glitch rather
   * than a coincidence. Pass something derived from the item's index, not
   * `Math.random()`, or server and client render different values.
   */
  phase?: number;
  className?: string;
}) {
  const spec = VARIANTS[variant];

  return (
    <div
      aria-hidden="true"
      className={cn("relative size-full overflow-clip", className)}
      style={{ background: spec.base }}
    >
      {spec.blobs.map((blob, index) => (
        <div
          key={index}
          className="animate-backdrop-drift absolute rounded-full"
          style={
            {
              left: `${blob.x}%`,
              top: `${blob.y}%`,
              width: `${blob.size}%`,
              aspectRatio: "1",
              marginLeft: `-${blob.size / 2}%`,
              marginTop: `-${blob.size / 2}%`,
              background: `radial-gradient(circle closest-side, rgba(${blob.color}, ${blob.alpha}), rgba(${blob.color}, 0) 100%)`,
              animationDuration: `${blob.seconds}s`,
              /* Negative delays start the loop already in progress, which is
                 what puts each instance at a different point in the cycle. */
              animationDelay: `${(blob.delay - phase).toFixed(2)}s`,
              "--drift-x": `${blob.dx}%`,
              "--drift-y": `${blob.dy}%`,
              "--drift-scale": blob.ds,
            } as React.CSSProperties
          }
        />
      ))}

      {dim > 0 ? (
        <div className="absolute inset-0 bg-black" style={{ opacity: dim }} />
      ) : null}
    </div>
  );
}
