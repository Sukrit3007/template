# Media credits

**Every file under `public/media/` is the work of the repo author and carries the same MIT
licence as the code.** There is no third-party media — nothing to attribute, and nothing to
re-check before redistributing.

Full-bleed slots are drawn in code by `components/media/animated-backdrop.tsx`, so there is no
video at all and only one image.

If you add a file, add a row. An unlisted file is an unlicensed file.

---

## Generated

| File | Produced by | Command |
| --- | --- | --- |
| `img/grain.png` | `scripts/generate-grain.mjs` | `pnpm generate:grain` |

## Authored by the repo author

| File | Notes |
| --- | --- |
| `img/hero-plate.jpg` | Hero background. Created by the repo author; MIT, same as the code |
| `img/readout-icon.svg` | Small glyph beside a hero readout |
| `logo/wordmark.svg` | Placeholder `ACME` wordmark, dark — for the white header pill |
| `logo/wordmark-footer.svg` | Same, light — sits over the footer backdrop |
| `logo/icon.svg` | Placeholder mark, light |
| `logo/icon-dark.svg` | Same mark, white — sits on the closing panel's blue field |

`app/icon.svg`, `app/apple-icon.tsx` and `app/opengraph-image.tsx` are also authored here; they
live in `app/` because Next resolves icons and social images by file convention.

---

## If you bring in third-party media

- **Check the licence covers redistribution.** A template gets downloaded and re-hosted by other
  people, so a licence permitting only *your* use isn't enough. Pexels states its licence covers
  "a template you sell". Several other free-stock sites explicitly forbid redistributing their
  assets — which is exactly what shipping them in a template does. Read before assuming.
- **Public-domain artwork is the cleanest option.** Museum open-access programmes (the Met,
  Rijksmuseum, Art Institute of Chicago) publish high-resolution images under CC0, with a
  per-object public-domain flag, and no restrictions at all.
- **Never put stock imagery in the logo.** Most stock licences, Pexels' included, explicitly
  forbid using the imagery as part of a trade or design mark.
- **Avoid identifiable faces and visible real-world brands.**
- Add a row above with the file, source URL, author and licence.
