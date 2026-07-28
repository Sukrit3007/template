import type { MetadataRoute } from "next";

import { siteMeta } from "@/content/landing";

/**
 * Serves /robots.txt. Allows everything — this is a marketing page, there is
 * nothing to hide from crawlers.
 *
 * The advertised sitemap URL comes from `siteMeta.url`, so it is only correct
 * once that placeholder is pointed at your real domain.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteMeta.url}/sitemap.xml`,
  };
}
