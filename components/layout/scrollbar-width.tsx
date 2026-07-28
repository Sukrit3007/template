"use client";

import { useEffect } from "react";

/**
 * Publishes the classic-scrollbar width as `--sbw`.
 *
 * Every grid length is a `vw` expression, and `vw` includes the scrollbar.
 * Without subtracting its width the grid overflows by however many pixels the
 * scrollbar occupies — visible on Windows/Linux, invisible on macOS overlay
 * scrollbars (where this correctly measures 0).
 */
export function ScrollbarWidth() {
  useEffect(() => {
    const measure = () => {
      const width = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty("--sbw", `${width}px`);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return null;
}
