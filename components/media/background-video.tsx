"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * A looping background video sitting over its own poster frame.
 *
 * The poster shows immediately and the video fades in over it once it can play,
 * so there's never a blank frame. Playback is tied to visibility, and
 * below-the-fold clips aren't fetched until they're approached — which matters
 * here because several are 9MB+.
 */
export function BackgroundVideo({
  src,
  poster,
  dim = 0,
  posterMode = "fill",
  eager = false,
  sizes = "100vw",
  className,
  videoClassName,
}: {
  src: string;
  poster: string;
  /** Black overlay laid over the video, 0–1. */
  dim?: number;
  /**
   * `fill` absolutely positions the poster — the usual case, where the parent
   * already has a height. `flow` leaves it in normal flow so its aspect ratio
   * *sets* the height; the footer depends on this to grow past one viewport.
   */
  posterMode?: "fill" | "flow";
  /** Above-the-fold videos load immediately; everything else waits. */
  eager?: boolean;
  sizes?: string;
  className?: string;
  videoClassName?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(eager);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    if (eager) return;
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [eager]);

  // Pause once off-screen so we're not decoding video nobody can see.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "100px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div
      ref={containerRef}
      className={cn("relative size-full overflow-clip", className)}
    >
      <Image
        src={poster}
        alt=""
        {...(posterMode === "fill"
          ? { fill: true }
          : { width: 1920, height: 1080 })}
        sizes={sizes}
        priority={eager}
        className={cn(
          "object-cover",
          posterMode === "flow" && "block h-auto w-full",
        )}
      />

      {shouldLoad ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          loop
          muted
          playsInline
          preload="metadata"
          onCanPlay={() => setCanPlay(true)}
          className={cn(
            "absolute top-0 left-0 z-1 size-full object-cover transition-opacity duration-100 ease-quart-out",
            canPlay ? "opacity-100" : "opacity-0",
            videoClassName,
          )}
        />
      ) : null}

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
