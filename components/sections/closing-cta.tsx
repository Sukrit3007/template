import Image from "next/image";

import { BackdropLayer } from "@/components/media/backdrop";
import { WipeButton } from "@/components/marketing/wipe-button";
import { closingCta } from "@/content/landing";

/**
 * Closing panel: lilac copy column beside a sticky full-height video. The
 * wordmark is the only place the display face runs at its largest size.
 */
export function ClosingCta() {
  return (
    <section>
      <div className="grid h-fit grid-cols-1 overflow-clip bg-panel lg:h-lvh lg:grid-cols-2">
        <div className="margin-px-1 col-start-1 row-start-2 flex h-full flex-col gap-60 py-48 lg:row-start-1 lg:w-full lg:justify-between lg:pt-65 lg:pb-60">
          <h2 className="lg:span-pl-1-wide w-full font-serif text-40 font-normal text-panel-ink normal-case lg:text-120 lg:leading-[1.22]">
            {closingCta.wordmarkLines.map((line) => (
              <span key={line} className="block w-full overflow-clip">
                {line}
              </span>
            ))}
          </h2>

          <div className="lg:span-w-10 grid grid-cols-1 gap-60 lg:grid-cols-2 lg:justify-between lg:gap-x-0 lg:gap-y-60">
            <figure className="relative block h-fit w-full overflow-clip">
              <Image
                src={closingCta.logo}
                alt=""
                width={30}
                height={15}
                className="span-w-1-wide lg:span-w-1 lg:span-ml-1-wide h-auto self-start"
              />
            </figure>

            <div className="lg:span-w-5-wide lg:col-start-2 lg:row-start-1">
              <h3 className="relative mb-24 overflow-clip font-mono text-12 text-panel-ink uppercase">
                {closingCta.eyebrow}
              </h3>
              <p className="font-sans text-20 font-medium text-panel-ink">
                {closingCta.body}
              </p>
            </div>

            <div className="relative block w-full overflow-clip lg:col-start-2 lg:row-start-2">
              {/* Hover colour is `ink`, not `panel-ink`: this button's wipe is
                  white, and `panel-ink` is the near-white used for type on the
                  blue panel — the label would vanish as the wipe lands. */}
              <WipeButton
                href={closingCta.cta.href}
                hoverTextClass="group-hover/wipe:text-ink"
              >
                {closingCta.cta.label}
              </WipeButton>
            </div>
          </div>
        </div>

        <div className="relative isolate h-475 w-full overflow-clip lg:h-lvh">
          <div className="sticky top-0 h-475 w-full overflow-clip lg:h-lvh">
            <BackdropLayer
              backdrop={closingCta.backdrop}
              sizes="(max-width: 1023px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
