import { BackdropLayer } from "@/components/media/backdrop";
import { whyPanels } from "@/content/landing";

/** How much the video is dimmed so the surface type stays legible over it. */
const PANEL_DIM = 0.5;

/**
 * Three full-height statements, each over its own dimmed video. The middle
 * panel splits into lines that alternate alignment, so the eye zig-zags down
 * the viewport rather than reading one block.
 */
export function WhyPanels() {
  return (
    <section>
      {whyPanels.map((panel) => (
        <article
          key={panel.eyebrow}
          className="relative grid h-(--screen-height-max) grid-cols-1 grid-rows-1 overflow-clip"
        >
          <div className="col-start-1 row-start-1 size-full overflow-clip">
            <BackdropLayer backdrop={panel.backdrop} dim={PANEL_DIM} />
          </div>

          <div
            className={`grid-container ${panel.width} relative z-10 col-start-1 row-start-1 flex flex-col justify-center gap-y-48 overflow-x-hidden text-surface`}
          >
            <h2
              className={`font-mono text-12 uppercase ${
                panel.align === "center" ? "text-center" : "text-left"
              }`}
            >
              {panel.eyebrow}
            </h2>

            {panel.title ? (
              <p
                className={`w-full text-center font-serif text-40 normal-case ${panel.titleSize}`}
              >
                {panel.title}
              </p>
            ) : (
              <p className="w-full space-y-48 font-sans normal-case lg:space-y-12">
                {panel.lines?.map((line) => (
                  <span
                    key={line.text}
                    className={`block text-20 font-medium lg:text-45 ${line.align}`}
                  >
                    {line.text}
                  </span>
                ))}
              </p>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
