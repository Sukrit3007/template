"use client";

import Image from "next/image";

import { BackdropLayer } from "@/components/media/backdrop";
import { useState } from "react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { siteNav } from "@/content/landing";
import { EASE_EXPO_OUT } from "@/lib/animation";

/* SVG stroke/border attributes can't take Tailwind classes, so they read the
   theme tokens directly — keeps the header in step with a palette change. */
const ICON_STROKE = "var(--color-ink)";
const CHEVRON_STROKE = "var(--color-ink-muted)";
const RULE_COLOR = "var(--color-line)";

/** Tapered hamburger — three rules of decreasing width. */
const MenuIcon = (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
    <line x1="0.75" y1="1.5" x2="17.25" y2="1.5" stroke={ICON_STROKE} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="3.25" y1="7" x2="14.75" y2="7" stroke={ICON_STROKE} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="5.75" y1="12.5" x2="12.25" y2="12.5" stroke={ICON_STROKE} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CloseIcon = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M1 1L13 13M13 1L1 13" stroke={ICON_STROKE} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ChevronIcon = (
  <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
    <path d="M1 1L7 7L1 13" stroke={CHEVRON_STROKE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** The two icons cross-fade and counter-rotate as the menu toggles. */
const iconTransition = "transition-[opacity,transform] duration-300 ease-out";

/**
 * Fixed header: a white pill on desktop, a rounded card with a collapsible nav
 * on mobile. It starts translated off-screen and drops in once mounted.
 *
 * Sizing here is deliberately hard px rather than the fluid design-pixel scale
 * the rest of the page uses — the header is chrome and stays constant at every
 * viewport.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      className="site-header margin-px-1 fixed top-12 left-0 z-100 w-full lg:top-22"
      initial={{ y: "-150%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: EASE_EXPO_OUT }}
    >
      {/* Desktop pill */}
      <div className="hidden rounded-[8px] bg-white lg:mx-auto lg:flex lg:w-fit lg:flex-row lg:items-center lg:gap-[28px] lg:py-[6px] lg:pr-[6px] lg:pl-[16px]">
        {/* The 2px nudge lives on the wrapper: padding on the <img> changes its
            rendered box and trips next/image's aspect-ratio check. */}
        <a href="#" aria-label="Home" className="flex items-center pt-[2px]">
          <Image
            src={siteNav.logo}
            alt=""
            width={117}
            height={17}
            className="h-[17px] w-[117px]"
            priority
          />
        </a>

        <nav className="flex flex-row items-center gap-[24px]">
          {siteNav.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-sans text-[14px] leading-[1.4] text-ink transition-opacity hover:opacity-60"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Button
          variant="hero"
          size="hero"
          nativeButton={false}
          render={<a href={siteNav.cta.href} />}
          className="w-fit origin-center"
        >
          <div className="pointer-events-none absolute inset-0 z-0">
            <BackdropLayer backdrop={siteNav.ctaBackdrop} />
          </div>
          <div className="pointer-events-none absolute inset-0 z-1 backdrop-blur-sm" />
          <span className="relative z-2">{siteNav.cta.label}</span>
        </Button>
      </div>

      {/* Mobile card */}
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="w-full overflow-hidden rounded-[12px] bg-white shadow-[0_2px_20px_rgba(0,0,0,0.1)] lg:hidden"
      >
        <div className="flex h-[72px] items-center justify-between">
          <a
            href="#"
            aria-label="Home"
            className="flex shrink-0 items-center pt-[2px] pl-[24px]"
          >
            <Image
              src={siteNav.logo}
              alt=""
              width={111}
              height={16}
              className="h-[16px] w-[111px]"
              priority
            />
          </a>

          <CollapsibleTrigger
            aria-label="Toggle navigation"
            className="relative mr-[12px] flex size-[52px] shrink-0 cursor-pointer items-center justify-center bg-transparent"
          >
            <span
              className={`absolute origin-center ${iconTransition}`}
              style={{
                opacity: open ? 0 : 1,
                transform: `rotate(${open ? 90 : 0}deg)`,
              }}
            >
              {MenuIcon}
            </span>
            <span
              className={`absolute origin-center ${iconTransition}`}
              style={{
                opacity: open ? 1 : 0,
                transform: `rotate(${open ? 0 : -90}deg)`,
              }}
            >
              {CloseIcon}
            </span>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="nav-panel">
          <div>
            <div
              className="px-[24px]"
              style={{ borderTop: `1px solid ${RULE_COLOR}` }}
            >
              {siteNav.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between py-[18px] no-underline"
                  style={{ borderBottom: `1px solid ${RULE_COLOR}` }}
                >
                  <span className="font-sans text-[18px] font-medium text-ink">
                    {link.label}
                  </span>
                  {ChevronIcon}
                </a>
              ))}
            </div>
            <div className="px-[24px] py-[16px]">
              <Button
                variant="heroSolid"
                size="heroBlock"
                nativeButton={false}
                render={<a href={siteNav.cta.href} />}
              >
                {siteNav.cta.label}
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.header>
  );
}
