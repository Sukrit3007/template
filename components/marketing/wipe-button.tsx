import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The page's CTA: a solid button whose label inverts as a rotated block wipes
 * up from below. Used in five places, where only the surface colour and the
 * hover label colour differ.
 *
 * The wipe is a rotated, over-scaled square rather than a translated bar —
 * that's what produces the diagonal sweep. `overflow-hidden` on the button
 * variant clips it.
 */

type Tone = "dark" | "light" | "pill";

/** Surface variant paired with the wipe colour that reads against it. */
const TONES = {
  dark: { variant: "stepDark", wipe: "bg-white" },
  light: { variant: "stepLight", wipe: "bg-ink" },
  pill: { variant: "pill", wipe: "bg-surface" },
} as const;

type WipeButtonProps = {
  children: React.ReactNode;
  tone?: Tone;
  /**
   * The label's hover colour, written as a full Tailwind variant against this
   * component's group — e.g. `"group-hover/wipe:text-contrast"`. It has to be a
   * complete literal so Tailwind can find and generate it.
   */
  hoverTextClass: string;
  /** Renders an anchor when set; a submit button when omitted. */
  href?: string;
  size?: "step" | "pill";
  /** Step CTAs lift their label on hover; the address pill only recolours. */
  lift?: boolean;
  ariaLabel?: string;
  className?: string;
};

export function WipeButton({
  children,
  tone = "dark",
  hoverTextClass,
  href,
  size = "step",
  lift = true,
  ariaLabel,
  className,
}: WipeButtonProps) {
  const { variant, wipe } = TONES[tone];

  return (
    <Button
      variant={variant}
      size={size}
      aria-label={ariaLabel}
      className={cn("group/wipe", className)}
      {...(href
        ? { nativeButton: false as const, render: <a href={href} /> }
        : { type: "submit" as const })}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-1 size-full origin-center translate-y-[200%] rotate-[15deg] scale-[1.8] rounded-lg transition-transform duration-1000 ease-expo-out group-hover/wipe:translate-y-0 group-hover/wipe:rotate-[8deg]",
          wipe,
        )}
      />
      <span
        className={cn(
          "relative z-2 duration-300 ease-expo-out",
          lift
            ? "transition-[transform,color] group-hover/wipe:-translate-y-1"
            : "transition-colors",
          hoverTextClass,
        )}
      >
        {children}
      </span>
    </Button>
  );
}
