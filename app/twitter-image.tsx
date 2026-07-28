/**
 * Twitter card image — the same render as the Open Graph card.
 *
 * Re-exported rather than relying on crawlers falling back to `og:image`, so a
 * `twitter:image` tag is emitted explicitly. No duplicated design.
 */
export { default, alt, size, contentType } from "./opengraph-image";
