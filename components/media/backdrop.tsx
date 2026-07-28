import Image from "next/image";

import {
  AnimatedBackdrop,
  type BackdropVariant,
} from "@/components/media/animated-backdrop";
import { BackgroundVideo } from "@/components/media/background-video";
import { cn } from "@/lib/utils";

/**
 * Every full-bleed media slot on the page goes through here, so choosing what
 * fills one is a content decision rather than a code change.
 *
 * Most slots ship as `animated` — drawn in code, so the template runs with no
 * third-party files. Point a slot at `image` or `video` in content/landing.ts
 * and nothing in the sections has to move.
 *
 * `BackgroundVideo` handles lazy fetching, the poster→video fade and pausing
 * off-screen; `next/image` handles responsive sizing and format negotiation.
 */

export type Backdrop =
  | { readonly kind: "video"; readonly src: string; readonly poster: string }
  | { readonly kind: "image"; readonly src: string }
  | { readonly kind: "animated"; readonly variant: BackdropVariant };

export function BackdropLayer({
  backdrop,
  dim = 0,
  eager = false,
  phase = 0,
  sizes,
  className,
}: {
  backdrop: Backdrop;
  dim?: number;
  eager?: boolean;
  /** Loop offset for animated backdrops; ignored for video. See AnimatedBackdrop. */
  phase?: number;
  sizes?: string;
  className?: string;
}) {
  if (backdrop.kind === "video") {
    return (
      <BackgroundVideo
        src={backdrop.src}
        poster={backdrop.poster}
        dim={dim}
        eager={eager}
        sizes={sizes}
        className={className}
      />
    );
  }

  if (backdrop.kind === "image") {
    return (
      <div className={cn("relative size-full overflow-clip", className)}>
        <Image
          src={backdrop.src}
          alt=""
          fill
          sizes={sizes ?? "100vw"}
          priority={eager}
          className="object-cover"
        />
        {dim > 0 ? (
          <div
            aria-hidden="true"
            className="absolute inset-0 z-1 bg-black"
            style={{ opacity: dim }}
          />
        ) : null}
      </div>
    );
  }

  return (
    <AnimatedBackdrop
      variant={backdrop.variant}
      dim={dim}
      phase={phase}
      className={className}
    />
  );
}
