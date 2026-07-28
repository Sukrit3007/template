/**
 * Every string and asset path on the landing page.
 *
 * This is the only file you need to touch to re-skin the page: swap the copy
 * and point the `/media/**` paths at new files. Sections are presentational and
 * read from here, so a campaign variant is one edit rather than a sweep through
 * eight components.
 *
 * Copy keeps its authored line breaks — `body { white-space: pre-wrap }` in
 * styles/globals.css renders them, so `\n` is a real line break on the page.
 *
 * Everything here is placeholder text. Several slots are sized around a specific
 * number of lines; those carry a note where the line count matters.
 *
 * Media slots take one of three kinds — `animated` (drawn in code, no file),
 * `image`, or `video`. Most ship as `animated` so the template runs with almost
 * no media files. Switching a slot is a change here and nowhere else.
 */

import type { Backdrop } from "@/components/media/backdrop";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type NavLink = {
  readonly label: string;
  readonly href: string;
};


/**
 * `width` and `titleSize` hold Tailwind class names that are applied
 * dynamically. This works because Tailwind scans this file and finds the string
 * literals — do NOT rewrite them as computed strings (`` `lg:text-${n}` ``) or
 * the classes stop being generated and the panels silently lose their sizing.
 */
export type WhyPanel = {
  readonly eyebrow: string;
  readonly align: "center" | "left";
  readonly width: string;
  readonly titleSize: string;
  readonly title: string | null;
  readonly lines: readonly { readonly text: string; readonly align: string }[] | null;
  readonly backdrop: Backdrop;
};

export type ValueProp = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly backdrop: Backdrop;
  /**
   * The slot's aspect ratio, as width × height. The three differ, so the row
   * needs each one's real proportions reserved up front — otherwise it resizes
   * mid-scroll as content settles.
   */
  readonly width: number;
  readonly height: number;
  /** Which column the image occupies on desktop; copy stays centred. */
  readonly side: "left" | "right";
};

export type StepMedia =
  | { readonly kind: "backdrop"; readonly backdrop: Backdrop; readonly overlayLogo: string }
  /**
   * The energy readout on the final step. Only the copy lives here — the curve
   * geometry is design, and stays in components/media/energy-chart.tsx.
   */
  | {
      readonly kind: "chart";
      readonly tabs: readonly [string, string];
      readonly value: string;
      readonly unit: string;
      /** Period-over-period change; announced to screen readers only. */
      readonly delta: string;
      readonly days: readonly string[];
      /** Index into `days` that reads as "today". */
      readonly activeDay: number;
    };

export type HowItWorksStep = {
  readonly step: string;
  readonly title: string;
  readonly kicker: string;
  readonly body: string;
  readonly cta: NavLink;
  readonly media: StepMedia;
};

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Every link is inert. Point these at real routes when you wire the template up.
 */
const INERT_HREF = "#";

/**
 * Placeholder body text. Sections are sized around specific line counts, so when
 * you swap these for real copy keep an eye on length — see the notes on each
 * field below.
 */
const LOREM_SHORT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.";
const LOREM_LONG =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

/** Film-grain overlay laid over the footer at `mix-blend-overlay`. */
export const GRAIN_TEXTURE_SRC = "/media/img/grain.png";

/**
 * Site-level metadata. Read by `app/layout.tsx`, `app/opengraph-image.tsx`,
 * `app/robots.ts` and `app/sitemap.ts`, so each value is defined once.
 *
 * ⚠️ `url` is a placeholder. Change it to your real domain before deploying —
 * it's what `metadataBase` resolves OG image and canonical URLs against, and
 * what `robots.txt` and `sitemap.xml` advertise. It is the only line here that
 * must change for a deploy to be correct.
 */
export const siteMeta = {
  name: "Acme",
  title: "Acme — Landing Page Template",
  /** `%s` is the page's own title; the root layout supplies the default above. */
  titleTemplate: "%s — Acme",
  description:
    "A scroll-driven marketing landing page template built with Next.js, Tailwind and Motion.",
  url: "https://example.com",
  /** Alt text for the generated Open Graph image. */
  ogAlt: "Acme — Landing Page Template",
  locale: "en_US",
} as const;

export const siteNav = {
  logo: "/media/logo/wordmark.svg",
  links: [
    { label: "Nav one", href: INERT_HREF },
    { label: "Nav two", href: INERT_HREF },
    { label: "Nav three", href: INERT_HREF },
    { label: "Nav four", href: INERT_HREF },
  ],
  cta: { label: "Call to action", href: INERT_HREF },
  /** Sits behind the CTA label, under a backdrop-blur. */
  ctaBackdrop: { kind: "animated", variant: "wash" },
} as const satisfies {
  logo: string;
  links: readonly NavLink[];
  cta: NavLink;
  ctaBackdrop: Backdrop;
};

export const hero = {
  eyebrow: "Eyebrow label",
  /** Designed as two lines — keep the `\n` or the display type reflows. */
  heading: "Headline goes\nhere",
  body: "Supporting line one goes here.\nSupporting line two goes here.",
  addressPlaceholder: "Placeholder text",
  /** The input has no visible <label>; this is its accessible name. */
  addressLabel: "Input label",
  /** One button, two label lengths — the long form doesn't fit on phones. */
  addressCta: { short: "Submit", long: "Call to action" },
  /** The plate behind everything, dimmed heavily so the copy stays legible. */
  background: { kind: "image", src: "/media/img/hero-plate.jpg" },
  /** Seen only through the hero's clip mask — a narrow strip, right of centre. */
  backdrop: { kind: "animated", variant: "aurora" },
  readoutIcon: "/media/img/readout-icon.svg",
  /** Decorative readouts pinned to the reveal window's corners. */
  readouts: {
    generated: { label: "Metric one", value: "0.0 – 0.0" },
    stored: { label: "Metric two", fill: 0.72 },
    thermostat: { label: "Metric three", value: "00" },
  },
} as const;

export const valueProps = [
  {
    eyebrow: "One",
    heading: "First value prop\nheadline",
    backdrop: { kind: "animated", variant: "panel" },
    width: 960,
    height: 1454,
    side: "right",
  },
  {
    eyebrow: "Two",
    heading: "Second value prop\nheadline",
    backdrop: { kind: "animated", variant: "panel" },
    width: 960,
    height: 1118,
    side: "left",
  },
  {
    eyebrow: "Three",
    heading: "Third value prop\nheadline",
    backdrop: { kind: "animated", variant: "panel" },
    width: 960,
    height: 1192,
    side: "right",
  },
] as const satisfies readonly ValueProp[];

export const howItWorks = {
  eyebrow: "Section eyebrow",
  heading: "Section heading\ngoes here",
  body: LOREM_LONG,
  cta: { label: "Call to action", href: INERT_HREF },
  /** Dimmed 30%, white type over it. */
  background: { kind: "animated", variant: "deep" },
  steps: [
    {
      step: "Step 1",
      /** Two lines by design — the `\n` is load-bearing on desktop. */
      title: "First step\ntitle",
      kicker: "Step kicker line",
      body: LOREM_SHORT,
      cta: { label: "Call to action", href: INERT_HREF },
      media: {
        kind: "backdrop",
        backdrop: { kind: "animated", variant: "panel" },
        overlayLogo: "/media/logo/icon.svg",
      },
    },
    {
      step: "Step 2",
      title: "Second step",
      kicker: "Step kicker line",
      body: LOREM_SHORT,
      cta: { label: "Call to action", href: INERT_HREF },
      media: {
        kind: "backdrop",
        backdrop: { kind: "animated", variant: "panel" },
        overlayLogo: "/media/logo/icon.svg",
      },
    },
    {
      step: "Step 3",
      title: "Third step",
      kicker: "Step kicker line",
      body: LOREM_SHORT,
      cta: { label: "Call to action", href: INERT_HREF },
      media: {
        kind: "backdrop",
        backdrop: { kind: "animated", variant: "panel" },
        overlayLogo: "/media/logo/icon.svg",
      },
    },
  ],
} as const satisfies {
  eyebrow: string;
  heading: string;
  body: string;
  cta: NavLink;
  background: Backdrop;
  steps: readonly HowItWorksStep[];
};

export const whyPanels = [
  {
    eyebrow: "Panel eyebrow",
    align: "center",
    width: "lg:span-w-18-wide",
    titleSize: "lg:text-85",
    title: "A short statement sized for the largest display type",
    lines: null,
    backdrop: { kind: "animated", variant: "deep" },
  },
  {
    /** Alternating alignment is the point of this panel — keep three lines. */
    eyebrow: "Panel eyebrow",
    align: "left",
    width: "lg:span-w-22",
    titleSize: "lg:text-70",
    title: null,
    lines: [
      { text: "First line, aligned left", align: "text-left" },
      { text: "Second line, aligned right", align: "lg:text-right" },
      { text: "Third line, aligned centre", align: "lg:text-center" },
    ],
    backdrop: { kind: "animated", variant: "deep" },
  },
  {
    eyebrow: "Panel eyebrow",
    align: "center",
    width: "lg:span-w-18-wide",
    titleSize: "lg:text-70",
    title:
      "A longer statement that runs to roughly two lines at this size, showing how the panel handles wrapping copy",
    lines: null,
    backdrop: { kind: "animated", variant: "deep" },
  },
] as const satisfies readonly WhyPanel[];

export const network = {
  eyebrow: "Section eyebrow",
  heading: "Section heading\ngoes here",
  body: LOREM_LONG,
  cta: { label: "Call to action", href: INERT_HREF },
  /** Accessible name for the dot grid, which is otherwise opaque to a reader. */
  visualLabel: "Animated dot grid",
} as const;

export const closingCta = {
  eyebrow: "Section eyebrow",
  /** Rendered one line per entry at the page's largest type size. */
  wordmarkLines: ["Closing", "headline"],
  body: LOREM_SHORT,
  cta: { label: "Call to action", href: INERT_HREF },
  logo: "/media/logo/icon-dark.svg",
  backdrop: { kind: "animated", variant: "aurora" },
} as const;

export const siteFooter = {
  logo: "/media/logo/wordmark-footer.svg",
  tagline: "Tagline",
  links: [
    { label: "Footer link one", href: INERT_HREF },
    { label: "Footer link two", href: INERT_HREF },
    { label: "Footer link three", href: INERT_HREF },
    { label: "Footer link four", href: INERT_HREF },
    { label: "Footer link five", href: INERT_HREF },
    { label: "Footer link six", href: INERT_HREF },
    { label: "Footer link seven", href: INERT_HREF },
  ],
  socials: [
    { label: "Social one", href: INERT_HREF },
    { label: "Social two", href: INERT_HREF },
    { label: "Social three", href: INERT_HREF },
  ],
  /** Its aspect ratio sets the footer height -- see site-footer.tsx. */
  backdrop: { kind: "animated", variant: "sweep" },
} as const satisfies {
  logo: string;
  tagline: string;
  links: readonly NavLink[];
  socials: readonly NavLink[];
  backdrop: Backdrop;
};
