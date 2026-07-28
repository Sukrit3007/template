"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { BackdropLayer } from "@/components/media/backdrop";
import { AddressForm } from "@/components/marketing/address-form";
import { hero } from "@/content/landing";
import {
  EASE_EXPO_OUT,
  HERO_CLIP_FROM,
  HERO_CLIP_TO,
  HERO_WINDOW,
  RISE_VARIANTS,
  easeInOutCubic,
} from "@/lib/animation";

/** Copy enters bottom-up, each element a beat after the last. */
const rise = (delay: number) => ({
  ...RISE_VARIANTS,
  transition: { duration: 1, delay, ease: EASE_EXPO_OUT },
});

/** Readouts fade in place rather than rising; they label the window's corners. */
const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE_EXPO_OUT },
});

/**
 * One viewport tall, built from four stacked sticky layers sharing a grid cell:
 *   1. photographic background, over-scaled and dimmed
 *   2. the video, visible only through a clipped window on the right
 *   3. a hairline frame aligned to that window's edges
 *   4. the copy column and address form
 * The floating readouts sit on the window's corners, which is why they share
 * the same percentages.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // The window tightens as the section scrolls away.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    [HERO_CLIP_FROM, HERO_CLIP_TO],
    { ease: easeInOutCubic },
  );

  return (
    <section ref={sectionRef} className="overflow-clip">
      <div className="relative isolate h-svh w-screen overflow-clip [clip-path:border-box]">
        {/* 1 — background plate */}
        <div className="relative size-full overflow-clip">
          <div className="sticky top-0 h-svh w-full scale-110">
            <div className="absolute inset-0">
              <BackdropLayer backdrop={hero.background} eager sizes="100vw" />
            </div>
            <div className="absolute inset-0 z-1 bg-black opacity-40" />
          </div>
          <div className="absolute inset-0 bg-black/[12.5%]" />
        </div>

        <div className="absolute inset-0 z-1 grid grid-cols-1 grid-rows-1">
          {/* 2 — the reveal window */}
          <motion.div
            style={{ clipPath }}
            className="sticky top-0 z-2 col-start-1 row-start-1 grid h-svh w-full grid-cols-1 grid-rows-1"
          >
            <BackdropLayer
              backdrop={hero.backdrop}
              eager
              className="col-start-1 row-start-1"
            />
          </motion.div>

          {/* 3 — hairline frame on the window's edges, extending off-screen */}
          <div
            aria-hidden="true"
            className="sticky top-0 z-1 col-start-1 row-start-1 grid h-svh w-full"
          >
            <div
              className="absolute left-0 h-1 w-full bg-white/30"
              style={{ top: HERO_WINDOW.top }}
            />
            <div
              className="absolute left-0 h-1 w-full bg-white/30"
              style={{ bottom: HERO_WINDOW.bottom }}
            />
            <div
              className="absolute top-0 h-full w-1 bg-white/30"
              style={{ left: HERO_WINDOW.left }}
            />
            <div
              className="absolute top-0 h-full w-1 bg-white/30"
              style={{ right: HERO_WINDOW.right }}
            />
          </div>

          {/* 4 — copy */}
          <div className="grid-container !sticky top-0 z-2 col-start-1 row-start-1 flex h-svh flex-col items-start justify-end !overflow-visible lg:justify-center">
            <div className="lg:span-pl-1-wide col-start-1 row-start-1 mb-24 flex flex-col gap-12 lg:mb-4 lg:translate-y-[min(8vh,72px)] lg:gap-24">
              <motion.small
                {...rise(0.5)}
                className="font-mono text-12 tracking-tight text-white uppercase"
              >
                {hero.eyebrow}
              </motion.small>

              <motion.h1
                {...rise(0.6)}
                className="lg:span-w-15 font-serif text-40 text-surface normal-case lg:text-85"
              >
                {hero.heading}
              </motion.h1>

              <motion.p
                {...rise(0.7)}
                className="span-w-10 lg:span-w-8 mt-12 text-14 text-surface lg:mt-24 lg:text-20 lg:font-medium"
              >
                {hero.body}
              </motion.p>

              <motion.div {...rise(0.8)} className="mt-24">
                <AddressForm
                  placeholder={hero.addressPlaceholder}
                  label={hero.addressLabel}
                  cta={hero.addressCta}
                />
              </motion.div>
            </div>
          </div>

          {/* Floating readouts, pinned to the window's corners */}
          <div className="!sticky top-0 z-1 col-start-1 row-start-1 block h-svh">
            <motion.ul
              {...fadeIn(1.1)}
              className="-translate-x-full absolute flex h-fit w-fit flex-row items-center gap-12 p-10 text-surface lg:translate-x-0 lg:-translate-y-full lg:px-16 lg:py-15"
              style={{ inset: `${HERO_WINDOW.top} 0 0 ${HERO_WINDOW.left}` }}
            >
              <li className="flex flex-col gap-4 lg:gap-8">
                <p className="text-8 lg:text-11">
                  {hero.readouts.generated.label}
                </p>
                <p className="text-10 font-medium lg:text-12">
                  {hero.readouts.generated.value}
                </p>
              </li>
            </motion.ul>

            <motion.div
              {...fadeIn(1.2)}
              className="absolute flex h-fit w-fit translate-x-full flex-col gap-4 p-13 text-12 text-surface lg:gap-8 lg:p-20"
              style={{
                bottom: HERO_WINDOW.bottom,
                right: HERO_WINDOW.right,
              }}
            >
              <p className="text-8 lg:text-11">{hero.readouts.stored.label}</p>
              <div
                aria-hidden="true"
                className="relative h-4 w-75 origin-left bg-surface/40 lg:h-10 lg:w-100"
              >
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hero.readouts.stored.fill }}
                  transition={{ duration: 1.4, delay: 1.4, ease: EASE_EXPO_OUT }}
                  className="absolute inset-0 origin-left bg-surface"
                />
              </div>
            </motion.div>

            <motion.div
              {...fadeIn(1.3)}
              className="absolute flex h-fit w-fit translate-y-full flex-col gap-2 p-14 text-10 text-surface lg:gap-4 lg:p-20 lg:text-12"
              style={{
                bottom: HERO_WINDOW.bottom,
                left: HERO_WINDOW.left,
              }}
            >
              <p className="text-8 lg:text-11">
                <span className="inline-flex items-center gap-4 lg:gap-8">
                  <Image
                    src={hero.readoutIcon}
                    alt=""
                    width={10}
                    height={10}
                    className="block size-10 lg:size-14"
                  />
                  <span>{hero.readouts.thermostat.label}</span>
                </span>
              </p>
              <p className="text-9 lg:text-11">
                {hero.readouts.thermostat.value}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
