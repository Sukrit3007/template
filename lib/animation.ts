/**
 * Shared animation constants.
 *
 * The easing curves mirror the `--ease-*` custom properties in
 * styles/globals.css — CSS transitions use the tokens, Motion uses these arrays.
 * Keep the two in sync; they describe the same curves.
 */

/** `--ease-expo-out`, the page's default entrance curve. */
export const EASE_EXPO_OUT = [0.16, 1, 0.3, 1] as const;

/** Symmetric ease-in-out used for the hero's scroll-linked clip. */
export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

/**
 * The hero's reveal window. It opens at rest and tightens as the section
 * scrolls away; the floating readouts and the hairline frame sit on these exact
 * edges, so changing one means changing all three.
 */
export const HERO_CLIP_FROM = "inset(30% 15% 30% 67.15%)";
export const HERO_CLIP_TO = "inset(35% 20% 35% 72%)";

/** Percentages the hero's frame lines and readouts align to. */
export const HERO_WINDOW = {
  top: "30%",
  bottom: "30%",
  left: "67.15%",
  right: "15%",
} as const;

/**
 * How a HowItWorks card recedes as the next one slides over it — and, for the
 * last card, how it clears the screen as the section ends.
 *
 * Stops span a card's own scroll range. Opacity and scale are driven by one
 * eased value, holding flat until ~19% then easing in; the stops are fed
 * straight to `useTransform` rather than fitted to a curve.
 */
export const CARD_RECEDE_PROGRESS = [0, 0.19, 0.29, 0.4, 0.5, 0.6, 0.71, 0.81, 0.92, 1];
export const CARD_RECEDE_OPACITY = [1, 1, 0.976, 0.913, 0.813, 0.687, 0.532, 0.352, 0.161, 0];

/**
 * Scale mirrors opacity as `0.9 + 0.1 × opacity`. Written out rather than
 * derived at runtime: chaining `useTransform` off the opacity value makes Motion
 * animate opacity as keyframes instead of binding it to scroll.
 */
export const CARD_RECEDE_SCALE = [
  1, 1, 0.9976, 0.9913, 0.9813, 0.9687, 0.9532, 0.9352, 0.9161, 0.9,
];

/**
 * Step 3's chart draws itself as the card scrolls: the curve wipes in
 * left-to-right, then a marker line and a faint projection curve fade up.
 * Ranges are expressed in the card's own scroll progress.
 */
export const CHART_SVG_WIDTH = 700;
/** The curve is already part-drawn when the card pins, hence the 84 floor. */
export const CHART_REVEAL_PROGRESS = [0, 0.55, 1];
export const CHART_REVEAL_WIDTH = [84, CHART_SVG_WIDTH, CHART_SVG_WIDTH];
export const CHART_MARKER_PROGRESS = [0.21, 0.37];
export const CHART_MARKER_OPACITY = [0, 1];
export const CHART_PROJECTION_PROGRESS = [0.26, 0.5];
export const CHART_PROJECTION_OPACITY = [0, 0.3];

/** Entrance used by every hero element; staggered by `delay`. */
export const RISE_VARIANTS = {
  initial: { y: "120%", opacity: 0 },
  animate: { y: 0, opacity: 1 },
} as const;
