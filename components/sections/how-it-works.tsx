"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";

import { BackdropLayer } from "@/components/media/backdrop";
import { EnergyChart } from "@/components/media/energy-chart";
import { WipeButton } from "@/components/marketing/wipe-button";
import { howItWorks, type HowItWorksStep, type StepMedia } from "@/content/landing";
import {
  CARD_RECEDE_OPACITY,
  CARD_RECEDE_PROGRESS,
  CARD_RECEDE_SCALE,
} from "@/lib/animation";

/** Each card is over two viewports tall, so it lingers while pinned. */
const CARD_HEIGHT = "h-[220lvh]";

/** Seconds of loop offset between adjacent cards, so they don't drift in sync. */
const STEP_PHASE = 3.5;

/**
 * The portrait media slot every step uses. The chart variant has its own, wider
 * panel and is rendered separately below.
 */
function StepMediaPanel({ media, index }: { media: StepMedia; index: number }) {
  if (media.kind === "backdrop") {
    return (
      <>
        <BackdropLayer
          backdrop={media.backdrop}
          phase={index * STEP_PHASE}
          sizes="(max-width: 1023px) 53vw, 19vw"
        />
        <Image
          src={media.overlayLogo}
          alt=""
          width={35}
          height={18}
          className="absolute top-1/2 left-1/2 z-2 h-auto w-22 -translate-x-1/2 -translate-y-1/2 lg:w-35"
        />
      </>
    );
  }

  return null;
}

/**
 * One card in the stack. Cards are `sticky top-0` and taller than the viewport,
 * so each pins while the next slides up over it, fading and shrinking as it
 * goes — that's what gives the stack its depth.
 *
 * The last card gets the same treatment even though nothing stacks on top of
 * it: it reaches zero exactly as the section ends, handing off to the next
 * section. Exempting it leaves a full-opacity card sitting over empty
 * background for the ~1150px between its content ending and the section ending.
 */
function StepCard({
  step,
  last,
  index,
}: {
  step: HowItWorksStep;
  last: boolean;
  index: number;
}) {
  const cardRef = useRef<HTMLLIElement>(null);
  const articleRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    CARD_RECEDE_PROGRESS,
    CARD_RECEDE_SCALE,
  );

  /**
   * Opacity is written straight to the node instead of going through Motion's
   * `style` prop. Passing it there makes Motion promote it to a WAAPI animation
   * with `fill: both`, which then holds a stale end state and overrides every
   * inline value — the card stops fading with scroll. Transform isn't promoted
   * that way, so `scale` can stay declarative.
   */
  const opacity = useTransform(
    scrollYProgress,
    CARD_RECEDE_PROGRESS,
    CARD_RECEDE_OPACITY,
  );
  useMotionValueEvent(opacity, "change", (value) => {
    if (articleRef.current) articleRef.current.style.opacity = String(value);
  });

  // `change` only fires on movement, so apply the current value once on mount —
  // otherwise a restored scroll position renders the card at full opacity until
  // the first scroll.
  useEffect(() => {
    if (articleRef.current) {
      articleRef.current.style.opacity = String(opacity.get());
    }
  }, [opacity]);

  return (
    <li
      ref={cardRef}
      className={`lg:margin-p-1 sticky top-0 ${CARD_HEIGHT} px-6 pt-(--nav-height) pb-6 ${
        last ? "origin-center lg:origin-bottom" : "origin-top"
      }`}
    >
      <motion.article
        ref={articleRef}
        style={{ scale }}
        /* The article is sticky in its own right, not just the <li>. The <li>
           is 220lvh and its sticky position is capped by the list, so without
           this the card scrolls off the top partway through and leaves ~1000px
           of bare background before the next section. */
        className="lg:span-pl-1-wide sticky top-(--nav-height) flex h-[calc(100lvh-0.375rem-var(--nav-height))] flex-col items-start justify-start gap-24 overflow-clip rounded-md bg-surface-muted pt-32 lg:top-(--margin) lg:h-[calc(100lvh-2*var(--margin))] lg:justify-center lg:gap-48 lg:pt-0"
      >
        <div className="gutter-gap-2 lg:span-w-6 flex w-full flex-row justify-between px-24 text-contrast lg:flex-col lg:gap-48 lg:px-0">
          <small className="order-last mt-8 shrink-0 font-mono text-12 uppercase lg:order-first">
            {step.step}
          </small>
          <h3 className="font-sans text-36 font-medium normal-case max-lg:whitespace-normal">
            {step.title}
          </h3>
        </div>

        <h4 className="lg:span-w-6-wide px-24 font-mono text-12 text-contrast uppercase lg:px-0">
          {step.kicker}
        </h4>

        <p className="lg:span-w-6-wide px-24 font-sans text-14 text-contrast lg:px-0">
          {step.body}
        </p>

        <div className="lg:span-w-6-wide px-24 max-lg:hidden lg:px-0">
          <WipeButton
            href={step.cta.href}
            hoverTextClass="group-hover/wipe:text-contrast"
          >
            {step.cta.label}
          </WipeButton>
        </div>

        {step.media.kind === "chart" ? (
          <div className="relative z-1 flex h-full w-full flex-1 flex-col items-stretch justify-end gap-12 px-24 pb-32 lg:absolute lg:left-1/2 lg:h-[calc(100lvh-2*var(--margin))] lg:w-1/2 lg:items-center lg:justify-center lg:gap-20 lg:px-0 lg:pb-0">
            <EnergyChart
              progress={scrollYProgress}
              tabs={step.media.tabs}
              value={step.media.value}
              unit={step.media.unit}
              delta={step.media.delta}
              days={step.media.days}
              activeDay={step.media.activeDay}
            />
          </div>
        ) : (
          <div
            aria-hidden="true"
            className="relative z-1 flex size-full items-center justify-center max-lg:pb-32 lg:absolute lg:top-0 lg:right-0 lg:left-1/2 lg:h-lvh lg:w-1/2"
          >
            <div className="lg:span-w-5 relative aspect-[175/380] h-[inherit] max-h-[80lvh] w-auto overflow-hidden rounded-xl lg:h-auto lg:rounded-2xl">
              <StepMediaPanel media={step.media} index={index} />
            </div>
          </div>
        )}
      </motion.article>
    </li>
  );
}

/**
 * A pinned intro panel over a dimmed photo, then a stack of sticky cards.
 * The surface plate fades in beneath the cards so the photo doesn't show through
 * the gaps between them.
 */
export function HowItWorks() {
  const stackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start end", "start start"],
  });
  const backdropOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="[clip-path:border-box]">
      <div className="sticky top-0 z-1 h-lvh">
        <div className="size-full overflow-clip *:size-full lg:*:h-[calc(100lvh+300px)]">
          <div className="relative size-full">
            <BackdropLayer backdrop={howItWorks.background} sizes="100vw" />
            <div className="absolute inset-0 z-1 bg-black opacity-30" />
          </div>
        </div>

        <div className="absolute inset-0 z-1">
          <div className="flex size-full flex-col items-center justify-center gap-24 text-center text-surface">
            <small className="font-mono text-12 uppercase">
              {howItWorks.eyebrow}
            </small>
            <h2 className="lg:span-w-16 font-serif text-40 leading-[0.95] normal-case lg:text-85">
              {howItWorks.heading}
            </h2>
            <p className="span-w-10 lg:span-w-12 mt-24 font-sans text-14 lg:mt-36 lg:text-20 lg:font-medium">
              {howItWorks.body}
            </p>
            <div className="mt-36">
              <WipeButton
                tone="light"
                href={howItWorks.cta.href}
                hoverTextClass="group-hover/wipe:text-white"
              >
                {howItWorks.cta.label}
              </WipeButton>
            </div>
          </div>
        </div>
      </div>

      <div ref={stackRef} className="relative overflow-clip">
        <motion.div
          aria-hidden="true"
          style={{ opacity: backdropOpacity }}
          className="fixed inset-0 z-2 h-lvh w-full bg-surface"
        />
        <ul className="relative z-3 flex flex-col gap-y-300 overflow-clip">
          {howItWorks.steps.map((step, index) => (
            <StepCard
              key={step.step}
              step={step}
              index={index}
              last={index === howItWorks.steps.length - 1}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
