import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge needs to be taught about this project's type scale.
 *
 * Sizes here are `text-<number>` (see styles/type.generated.css). Out of the
 * box tailwind-merge doesn't recognise a bare number as a font size, so it
 * files `text-14` under text *colour* — and then silently drops a real colour
 * that appeared earlier in the same `cn()` call. That's how `text-white` was
 * being stripped from every `size="step"` button, leaving black text on a
 * black surface.
 *
 * Registering the pattern under `font-size` keeps colour and size in separate
 * groups, so both survive.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [(value: string) => /^\d+$/.test(value)] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
