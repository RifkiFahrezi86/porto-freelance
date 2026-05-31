import { JourneyItem, SiteContent } from "./portfolio-store";

export function Journey({
  items,
  siteContent,
}: {
  items: JourneyItem[];
  siteContent: SiteContent;
}) {
  return (
    <section id="journey" className="bg-[#f5f0e8] py-16 sm:py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10 sm:mb-14">
          <div>
            <div className="mb-2 text-xs uppercase tracking-widest text-amber-700 sm:mb-3 sm:text-sm">{siteContent.journey.eyebrow}</div>
            <h2 className="max-w-2xl text-3xl tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
              {siteContent.journey.title}
            </h2>
          </div>
        </div>

        <ol className="relative ml-2 space-y-7 border-l border-stone-300 sm:ml-3 sm:space-y-10">
          {items.map((j) => (
            <li key={j.id} className="group relative pl-6 sm:pl-8">
              <span className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-amber-600 ring-4 ring-[#f5f0e8]" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-stone-500 sm:text-sm">{j.year}</div>
                  <div className="mt-1 text-lg text-stone-900 sm:text-xl">{j.title}</div>
                  <div className="mt-0.5 text-xs text-amber-700 sm:text-sm">{j.place}</div>
                  <p className="mt-2.5 max-w-2xl text-sm leading-7 text-stone-600 sm:mt-3 sm:text-base">{j.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
