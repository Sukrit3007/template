import { GRAIN_TEXTURE_SRC } from "@/content/landing";
import { cn } from "@/lib/utils";

/** Tile size and strength of the grain; tuned to break up flat colour fields. */
const TILE_SIZE = "300px";
const OPACITY = 0.4;

/**
 * Film-grain overlay. `mix-blend-overlay` is what stops large flat colour
 * fields from banding and gives the closing panels their texture.
 */
export function GrainOverlay({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-[9999] bg-center bg-repeat mix-blend-overlay",
        className,
      )}
      style={{
        backgroundImage: `url(${GRAIN_TEXTURE_SRC})`,
        backgroundSize: TILE_SIZE,
        opacity: OPACITY,
      }}
    />
  );
}
