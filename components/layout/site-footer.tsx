import Image from "next/image";

import { BackdropLayer } from "@/components/media/backdrop";
import { GrainOverlay } from "@/components/media/grain-overlay";
import { BracketLink } from "@/components/marketing/bracket-link";
import { siteFooter } from "@/content/landing";

/**
 * Full-viewport closing panel. The gradient is a video, not CSS — and its
 * poster sits in normal flow (`posterMode="flow"`) because that poster's 16:9
 * ratio is what gives the footer its height once that exceeds one viewport.
 */
export function SiteFooter() {
  return (
    <footer
      id="footer"
      aria-label="Footer"
      className="relative z-10 grid min-h-lvh grid-cols-1 grid-rows-1 overflow-clip lg:h-fit"
    >
      {/* `aspect-video` is load-bearing: this box is what gives the footer its
          height once that exceeds one viewport. The backdrop inside is
          absolutely positioned and contributes no layout height of its own, so
          removing the ratio collapses the footer to `min-h-lvh`. */}
      <div className="relative col-start-1 row-start-1 aspect-video w-full">
        <BackdropLayer backdrop={siteFooter.backdrop} sizes="100vw" />
      </div>

      <div className="grid-container relative z-1 col-start-1 row-start-1 flex flex-col justify-center overflow-x-hidden text-surface max-lg:pt-96">
        {/* The outer two take equal flexible width (`lg:flex-1`) so the link
            column lands on true centre. `justify-around` can't do that — it
            spaces around three items of different widths, which puts the middle
            one off-centre by half their difference. */}
        <div className="flex items-center justify-between max-lg:flex-col max-lg:gap-y-96 lg:mt-auto lg:flex-row">
          <div className="span-w-8 lg:flex-1 pt-10">
            <Image
              src={siteFooter.logo}
              alt=""
              width={200}
              height={100}
              className="span-w-8 mx-auto object-center lg:hidden"
            />
            <Image
              src={siteFooter.logo}
              alt=""
              width={262}
              height={100}
              className="lg:span-w-5 mx-auto hidden object-center lg:block"
            />
          </div>

          <ul className="span-w-8 lg:span-w-4 flex flex-col items-center gap-y-27">
            {siteFooter.links.map((link) => (
              <li key={link.label}>
                <BracketLink href={link.href}>{link.label}</BracketLink>
              </li>
            ))}
          </ul>

          <h2 className="font-medium text-35 lg:flex-1 lg:text-center lg:text-50">
            {siteFooter.tagline}
          </h2>
        </div>

        <div className="mt-auto mb-12 flex flex-col items-center justify-between font-mono text-12 uppercase max-lg:gap-24 max-lg:pt-90 lg:mb-24 lg:flex-row">
          <ul className="flex w-full items-center gap-x-48 max-lg:justify-between lg:w-fit">
            {siteFooter.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  className="block p-5 outline-ink outline-offset-4 focus-visible:outline-2"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <GrainOverlay />
    </footer>
  );
}
