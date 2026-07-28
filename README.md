# marketing-template

A single-page, scroll-driven marketing landing page. Next.js App Router, Tailwind v4,
Motion, Lenis, and shadcn/ui primitives.

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build
pnpm generate:css   # regenerate the grid + type utilities (see below)
pnpm generate:grain # regenerate the film-grain tile
```

Everything ships as **placeholder content** — lorem ipsum, an `ACME` wordmark, and code-drawn
backdrops instead of photography. There are **no third-party media files at all**, so the repo is
~56KB of assets and has nothing to attribute. It's meant to be replaced, not shipped as-is.

---

## The one file you'll actually edit

**`content/landing.ts`** holds every string and every asset path on the page. Sections are
presentational and read from it, so re-skinning the page — new copy, new images, new video —
is a single-file change.

Copy keeps its authored line breaks: `body { white-space: pre-wrap }` means `\n` in a string
is a real line break on the page. A few slots are sized around a specific number of lines and
carry a note saying so — the hero heading and the middle `whyPanels` entry especially.

Every full-bleed media slot is a `Backdrop`, and swapping one is a content change:

```ts
// drawn in code, no file
backdrop: { kind: "animated", variant: "aurora" }

// a still
backdrop: { kind: "image", src: "/media/img/hero-plate.jpg" }

// looping footage
backdrop: { kind: "video", src: "/media/video/hero.mp4", poster: "/media/poster/hero.jpg" }
```

`components/media/backdrop.tsx` dispatches on `kind`, so no section component changes either
way. `BackgroundVideo` is still there and still handles lazy fetching, the poster→video fade and
pausing off-screen — it's the landing pad for real footage.

For `valueProps`, also set `width` / `height` to the asset's true pixel dimensions. They're not
decorative: on desktop that ratio is what gives the row its height, and the three panels differ.

---

## The design system

This is the part worth understanding before changing any layout.

`--spacing: .0625rem` combined with a **fluid root font-size** means every numeric Tailwind
utility is a *design pixel* that scales with the viewport. `pt-140` is literally 140px at the
breakpoint's reference width, and grows or shrinks from there.

| Breakpoint | Reference width | Columns |
| ---------- | --------------- | ------- |
| base       | 375px           | 12      |
| ≥ 48rem    | 768px           | 12      |
| ≥ 64rem    | 1440px          | 24      |

Four custom properties drive the grid — `--margin`, `--gutter`, `--column`, `--grid-width` —
all `vw`-based, each minus `--sbw` (the classic-scrollbar width, measured on the client by
`components/layout/scrollbar-width.tsx`) so the grid stays aligned whether or not a scrollbar
is present.

Type follows the same idea: `text-N` resolves to `max(Npx, N/16rem)`, so it tracks the fluid
root but never drops below N physical pixels on narrow screens.

### Colour

Tokens are named by **role**, not by hue, so recolouring is a value change in one place rather
than a rename across every component:

| Token | Used for |
| ----- | -------- |
| `surface` / `surface-muted` | page background, card fills, light text on dark media |
| `line` | hairline borders and rules |
| `ink` / `ink-soft` / `ink-muted` | body text, secondary text, disabled text |
| `contrast` | text on `surface-muted` cards |
| `brand` | primary buttons, chart curve, the dot grid |
| `panel` / `panel-ink` | the closing CTA's full-bleed colour field and the type on it |

`brand` is `#2E22E5`. White on it is 8.48:1 (AAA) — but it's only 2.17:1 against `ink`, so never
pair the two. `panel` is the same value, used as a full field with near-white type.

They live in the `@theme` block in `styles/globals.css`, with the shadcn semantic tokens
(`--primary`, `--border`, …) pointed at the same values just below. **Change both** — they're
deliberately duplicated so shadcn components inherit the page palette.

`bg-black` is left as Tailwind's own black in four places; those are dim scrims over media, not
palette colours.

**Don't name a palette token after a shadcn one.** The `@theme inline` block at the bottom of
`styles/globals.css` maps `--color-accent`, `--color-primary`, `--color-muted` and friends to
shadcn's semantic values, and it comes *after* the `@theme` block — so a same-named token there
is silently overwritten. That's why the page accent is `brand` and not `accent`. Nothing errors;
the colour just resolves to shadcn's value, so check the computed style rather than trusting a
clean build.

### Generated CSS — don't hand-edit

`styles/grid.generated.css` and `styles/type.generated.css` are produced by
`scripts/generate-utilities.mjs`. They're emitted rather than expressed as Tailwind
`@utility name-*` patterns because each needs its numeric value more than once inside a single
declaration, and `--value()` only resolves once per declaration.

Change the `COLUMNS`, `SIZES` or `DEFAULTS` tables in that script, then:

```bash
pnpm generate:css
```

---

## Layout

```
app/
  layout.tsx             root layout, metadata + viewport exports
  page.tsx               the landing page
  error.tsx              route error boundary
  not-found.tsx          404
  icon.svg               favicon
  apple-icon.tsx         180×180, generated
  opengraph-image.tsx    1200×630, generated
  twitter-image.tsx      re-export of the above
  robots.ts              /robots.txt
  sitemap.ts             /sitemap.xml
styles/
  globals.css            design system — tokens, fluid grid, custom utilities
  *.generated.css        ← pnpm generate:css
components/
  ui/                    vendored shadcn — safe to re-run `shadcn add`
  media/                 backdrop (dispatcher), animated-backdrop, background-video,
                         dot-grid, energy-chart, grain-overlay
  marketing/             wipe-button, bracket-link, address-form
  layout/                site-header, site-footer, smooth-scroll, scrollbar-width
  sections/              one file per page section, in page order
content/landing.ts       all copy + asset paths
lib/
  animation.ts           easing curves and the hero's clip-path endpoints
  utils.ts               shadcn `cn`
```

Conventions: kebab-case files, PascalCase components with named exports, `SCREAMING_SNAKE_CASE`
module constants, camelCase content objects.

`components/ui/` is vendored shadcn and nothing else — keep bespoke components out of it so
`shadcn add` stays safe to run.

---

## Things that will bite you

- **Lenis owns scrolling.** `window.scrollTo()` moves native scroll but does *not* drive Lenis'
  animation loop, so scroll-linked values won't update. To test scroll behaviour, dispatch real
  `wheel` events.
- **Lenis and Motion share one RAF loop.** Lenis runs with `autoRaf: false` and is ticked from
  Motion's frame loop (`components/layout/smooth-scroll.tsx`). Don't give either its own loop.
- **`calc()` needs whitespace around `+` and `-`.** `calc(6*var(--column)+5*var(--gutter))` is
  invalid and the whole declaration is silently dropped.
- **Dynamic Tailwind classes in content.** `whyPanels[].width` and `.titleSize` are class-name
  strings applied at runtime. They only work because Tailwind scans `content/landing.ts` and
  finds the literals — never build them with template strings.
- **The footer's height comes from an `aspect-video` box**, not from its content. Backdrops are
  absolutely positioned and contribute no layout height, so dropping that ratio collapses the
  footer to `min-h-lvh`. Same trap in `valueProps`, where each row's ratio comes from the item's
  `width`/`height`.
- **Videos are deferred and paused off-screen.** `BackgroundVideo` only fetches a clip once it's
  within 200px of the viewport, and pauses playback when it leaves. Pass `eager` for
  above-the-fold ones.
- **Backdrop loops are CSS, not Motion.** Continuous background animation driven from Motion's
  frame loop competes directly with the scroll-linked tweens that actually need it. Transform-only
  CSS keyframes stay on the compositor — see `animated-backdrop.tsx` and `dot-grid.tsx`.
- **Scaling an SVG shape needs `transform-box: fill-box`.** Without it a `transform: scale()` is
  measured from the SVG's origin, not the shape's own centre, so things slide instead of growing.
  `components/media/dot-grid.tsx` depends on this.

---

## Fonts

Geist Sans / Geist Mono (Vercel) and Instrument Serif (Google), all self-hosted via `next/font`
and wired to `--font-sans`, `--font-mono` and `--font-serif`. Components only ever reference
those three tokens, never a family name — so swapping a typeface is a one-line edit in
`app/layout.tsx`.

---

## Metadata

**Change `siteMeta.url` in `content/landing.ts` before deploying.** It ships as
`https://example.com`. It is the single value that `metadataBase`, the canonical link, the OG
image URL, `robots.txt` and `sitemap.xml` all resolve against — every one of them is wrong until
you change it. Title, description and the OG alt text live in the same object.

Icons and social cards use Next's file conventions in `app/`, so they're wired up by being there:

| File | Notes |
| ---- | ----- |
| `icon.svg` | Favicon. Hand-authored; matches `public/media/logo/wordmark.svg` |
| `apple-icon.tsx` | 180×180 PNG, generated. Apple doesn't accept SVG, hence generating it |
| `opengraph-image.tsx` | 1200×630 PNG, generated from `siteMeta` so it can't drift from the page |
| `twitter-image.tsx` | One-line re-export of the OG image |

Two things to know before editing the generated images:

- **`ImageResponse` supports flexbox and a CSS subset only** — no `display: grid`. Unsupported
  CSS produces a broken image rather than an error, so open `/opengraph-image` and look at it
  rather than trusting a 200.
- **It has no access to `next/font`**, so the cards render in the built-in font, not Instrument
  Serif. To match the brand face, read a `.woff`/`.ttf` into a buffer and pass it via the `fonts`
  option of `ImageResponse`.

`themeColor` and `colorScheme` are a **separate `viewport` export** in `app/layout.tsx`, not part
of `metadata` — they've been deprecated inside `metadata` since Next 14 and are silently ignored
there.

---

## Media

**The template ships no photography or video.** Every full-bleed slot is an `AnimatedBackdrop` —
a flat base colour with a few large radial-gradient blobs drifting over it, drawn entirely in
code. `public/media/` holds only the grain tile, one small glyph and four logo SVGs: ~56KB, all
hand-authored or generated, all MIT.

Variants live in `components/media/animated-backdrop.tsx`, each picked for what its slot needs:

| Variant | Used by | Constraint it satisfies |
| ------- | ------- | ----------------------- |
| `aurora` | hero, closing CTA | Mid-brightness, full-field — the hero mask reveals only a narrow strip |
| `deep` | the three `why` panels, hero plate, how-it-works | Dark enough for white type under a 50% dim |
| `sweep` | footer | Brand → ink, so the wordmark and links stay legible |
| `panel` | step cards, value props | Portrait slots |
| `wash` | nav CTA | Tiny, sits under a `backdrop-blur` |

### Bringing in real footage

Point the slot at a file instead — see [the content section](#the-one-file-youll-actually-edit).
Then two rules:

1. **Posters must be the first frame of their video.** A mismatched poster flashes on load.
   Extract rather than source separately:
   `ffmpeg -i video/hero.mp4 -frames:v 1 -q:v 3 poster/hero.jpg`
2. **Record every file in `MEDIA-CREDITS.md`.** This template gets re-hosted by other people, so
   each asset needs a licence that permits *redistribution*, not merely your own use. Pexels
   states its licence covers "a template you sell"; several other free-stock sites explicitly
   forbid redistributing their assets, which is exactly what shipping them here would do.

---

## Licence

Code is MIT — see `LICENSE`. Media carries its own licences, tracked in `MEDIA-CREDITS.md`.
