/**
 * An animated dot grid, used as the network section's centrepiece.
 *
 * Deliberately a rendered SVG rather than a binary animation format: it's a few
 * hundred bytes, stays crisp at any size, needs no runtime, and can be recoloured
 * from the theme.
 *
 * The wave is pure CSS — each dot's `animationDelay` is derived from its distance
 * to the centre, so the pulse travels outward. Animating ~300 nodes through a JS
 * animation loop would cost far more than it's worth for a decorative element,
 * and CSS keyframes stay on the compositor. `dot-pulse` lives in
 * styles/globals.css, and honours `prefers-reduced-motion` there.
 */

const COLS = 32;
const ROWS = 18;
/** Grid pitch in viewBox units. Dot radius is a fraction of this. */
const STEP = 20;
const RADIUS = 2.6;
/** Seconds of delay added per unit of distance from the centre. */
const WAVE_SPREAD = 0.16;

export function DotGrid({
  className,
  ariaLabel,
}: {
  className?: string;
  ariaLabel?: string;
}) {
  const width = COLS * STEP;
  const height = ROWS * STEP;
  const centreX = (COLS - 1) / 2;
  const centreY = (ROWS - 1) / 2;

  const dots = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const dx = col - centreX;
      const dy = row - centreY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // Dots fade out toward the edges so the grid doesn't end on a hard line.
      const falloff = Math.max(0, 1 - distance / (COLS * 0.55));

      if (falloff <= 0) continue;

      dots.push(
        <circle
          key={`${row}-${col}`}
          cx={col * STEP + STEP / 2}
          cy={row * STEP + STEP / 2}
          r={RADIUS * (0.5 + falloff * 0.5)}
          className="animate-dot-pulse"
          style={{
            animationDelay: `${(distance * WAVE_SPREAD).toFixed(2)}s`,
            opacity: falloff,
          }}
        />,
      );
    }
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role={ariaLabel ? "img" : "presentation"}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      fill="currentColor"
    >
      {dots}
    </svg>
  );
}
