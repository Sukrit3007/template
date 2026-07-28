import type { MetadataRoute } from "next";

import { siteMeta } from "@/content/landing";

/**
 * Serves /sitemap.xml. One entry, because the template is a single page — add a
 * row here for each route you add.
 *
 * URLs are built from `siteMeta.url`, so they're only correct once that
 * placeholder is pointed at your real domain.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteMeta.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
