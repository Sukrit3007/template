"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { BackdropLayer } from "@/components/media/backdrop";
import { valueProps, type ValueProp } from "@/content/landing";

/**
 * Six-column track, matching `span-w-6`. The whitespace around `+` is required —
 * calc() drops the whole declaration without it.
 */
const SIX_COLUMN_TRACK = "calc(6 * var(--column) + 5 * var(--gutter))";

/** Hold at full opacity through the middle of the row, fade at both ends. */
const FADE_STOPS = [0.2, 0.36, 0.64, 0.8];
const FADE_OPACITY = [0, 1, 1, 0];

/**
 * One selling point. On desktop the copy is `fixed inset-0` — all three blocks
 * sit centred on top of each other and cross-fade as their row scrolls through,
 * which is why the text appears to hold still while the images move past. Below
 * `lg` the copy is in normal flow and simply stacks above its image.
 */
/** Seconds of loop offset between rows, so the panels do not drift in sync. */
const ROW_PHASE = 4.5;

function ValuePropRow({
  item,
  index,
}: {
  item: ValueProp;
  index: number;
}) {
  const rowRef = useRef<HTMLLIElement>(null);

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, FADE_STOPS, FADE_OPACITY);

  return (
    <li
      ref={rowRef}
      className="lg:margin-px-1 lg:grid lg:border-b lg:border-line lg:first:border-t"
      style={{
        gridTemplateColumns: `${SIX_COLUMN_TRACK} 1fr ${SIX_COLUMN_TRACK}`,
      }}
    >
      <div className="margin-px-1 relative py-64 text-center lg:col-start-2 lg:row-start-1 lg:[clip-path:border-box]">
        <motion.div
          style={{ opacity }}
          className="flex flex-col items-center justify-center gap-24 lg:fixed lg:inset-0 lg:gap-28"
        >
          <p className="font-mono text-12 text-ink-soft uppercase">
            {item.eyebrow}
          </p>
          <h2 className="span-w-11 lg:span-w-10 my-[-0.04em] py-[0.04em] text-35 font-medium text-ink lg:text-50">
            {item.heading}
          </h2>
        </motion.div>
      </div>

      <figure
        className={`relative overflow-clip lg:row-start-1 ${
          item.side === "right" ? "lg:col-start-3" : "lg:col-start-1"
        }`}
      >
        {/* The ratio is load-bearing, not decorative. On desktop this box is
            what gives the row its height, and the three panels differ — so each
            carries its own. A backdrop has no intrinsic size, so without this
            the row resizes as the section settles. Mobile keeps its own fixed
            band ratio, hence the CSS variable rather than an inline style. */}
        <div
          className="span-w-8 lg:span-w-6 relative mx-auto overflow-clip aspect-[220/275] lg:aspect-[var(--prop-ratio)]"
          style={
            { "--prop-ratio": `${item.width} / ${item.height}` } as React.CSSProperties
          }
        >
          <BackdropLayer
            backdrop={item.backdrop}
            phase={index * ROW_PHASE}
            sizes="(max-width: 1023px) 59vw, 25vw"
          />
        </div>
        {/* Rules that close the image band on mobile only. */}
        <div className="absolute top-0 z-0 block h-full w-full border-t border-line lg:hidden" />
        <div className="absolute bottom-0 z-0 block h-full w-full border-b border-line lg:hidden" />
      </figure>
    </li>
  );
}

export function ValueProps() {
  return (
    <section className="w-full overflow-clip">
      {/* The pseudo-elements draw the vertical rules framing the centre column:
          six columns wide, with a single inner border each. */}
      <ul className="relative flex flex-col gap-0 pb-64 before:span-w-6 after:span-w-6 before:pointer-events-none before:absolute before:top-0 before:bottom-0 before:z-10 before:hidden before:border-r before:border-line after:pointer-events-none after:absolute after:top-0 after:right-0 after:bottom-0 after:z-10 after:hidden after:border-l after:border-line lg:pt-180 lg:pb-180 lg:before:block lg:after:block">
        {valueProps.map((item, index) => (
          <ValuePropRow key={item.eyebrow} item={item} index={index} />
        ))}
      </ul>
    </section>
  );
}
