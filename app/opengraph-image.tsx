import { ImageResponse } from "next/og";

import { siteMeta } from "@/content/landing";

/**
 * Open Graph card, generated at build time from `siteMeta` so the title and
 * description can never drift from the page's own metadata.
 *
 * Two constraints worth knowing before editing:
 *   - `ImageResponse` supports flexbox and a CSS subset only. `display: grid`
 *     silently produces a broken image rather than an error, so look at the
 *     rendered result, don't just check for a 200.
 *   - It has no access to `next/font`, so this renders in the built-in font
 *     rather than the page's Instrument Serif. To match the brand face, read a
 *     .woff/.ttf into a buffer and pass it via the `fonts` option.
 */

export const alt = siteMeta.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f5f5f4",
          padding: 80,
        }}
      >
        {/* Mark + wordmark, mirroring public/media/logo/wordmark.svg */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#2E22E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "#f5f5f4",
              }}
            />
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 600,
              letterSpacing: 2,
              color: "#141414",
            }}
          >
            {siteMeta.name.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: -2,
              color: "#141414",
            }}
          >
            {siteMeta.title}
          </div>
          <div
            style={{
              fontSize: 32,
              lineHeight: 1.4,
              color: "#57574f",
              maxWidth: 900,
            }}
          >
            {siteMeta.description}
          </div>
        </div>

        {/* Accent rule, keyed to --color-brand */}
        <div style={{ display: "flex", height: 12, background: "#2E22E5" }} />
      </div>
    ),
    size,
  );
}
