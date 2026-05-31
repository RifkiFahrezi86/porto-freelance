import { JourneyItem, SiteContent } from "./portfolio-store";

export function Journey({
  items,
  siteContent,
}: {
  items: JourneyItem[];
  siteContent: SiteContent;
}) {
  return (
    <section id="journey" className="bg-[#f5f0e8] py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <div>
            <div className="text-sm text-amber-700 uppercase tracking-widest mb-3">{siteContent.journey.eyebrow}</div>
            <h2 className="text-stone-900 tracking-tight text-4xl md:text-5xl max-w-2xl">
              {siteContent.journey.title}
            </h2>
          </div>
        </div>

        <ol className="relative border-l border-stone-300 ml-3 space-y-10">
          {items.map((j) => (
            <li key={j.id} className="pl-8 group relative">
              <span className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-amber-600 ring-4 ring-[#f5f0e8]" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-stone-500">{j.year}</div>
                  <div className="mt-1 text-stone-900 text-xl">{j.title}</div>
                  <div className="text-amber-700 text-sm mt-0.5">{j.place}</div>
                  <p className="mt-3 text-stone-600 max-w-2xl leading-relaxed">{j.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
