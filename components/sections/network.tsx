import { DotGrid } from "@/components/media/dot-grid";
import { WipeButton } from "@/components/marketing/wipe-button";
import { network } from "@/content/landing";

/** Centred statement above the animated dot grid. */
export function Network() {
  return (
    <section className="pt-140 pb-60 lg:pt-150">
      <div className="flex flex-col items-center gap-24 text-center text-ink lg:mb-40">
        <small className="margin-px-1 font-mono text-12 uppercase">
          {network.eyebrow}
        </small>

        <h2 className="margin-px-1 lg:span-w-14 font-serif text-40 normal-case lg:text-85">
          {network.heading}
        </h2>

        <p className="margin-px-1 span-w-11 lg:span-w-10 mt-24 text-14 text-pretty lg:mt-36 lg:text-20">
          {network.body}
        </p>

        <div className="margin-px-1 mt-36">
          <WipeButton
            href={network.cta.href}
            hoverTextClass="group-hover/wipe:text-ink"
          >
            {network.cta.label}
          </WipeButton>
        </div>

        <DotGrid
          ariaLabel={network.visualLabel}
          className="lg:span-w-14 mx-auto h-300 w-full text-brand lg:h-[max(37.5rem,50vw)]"
        />
      </div>
    </section>
  );
}
