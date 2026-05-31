import { ArrowUpRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Project, SiteContent } from "./portfolio-store";

export function Projects({
  items,
  siteContent,
}: {
  items: Project[];
  siteContent: SiteContent;
}) {
  return (
    <section id="projects" className="bg-[#f5f0e8] py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <div>
            <div className="text-sm text-amber-700 uppercase tracking-widest mb-3">{siteContent.projects.eyebrow}</div>
            <h2 className="text-stone-900 tracking-tight text-4xl md:text-5xl max-w-2xl">
              {siteContent.projects.title}
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {items.map((p, i) => (
            <article
              key={p.id}
              className={`group relative bg-white rounded-3xl overflow-hidden border border-stone-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                i % 3 === 0 ? "md:col-span-2" : ""
              }`}
            >
              <div className={`overflow-hidden ${i % 3 === 0 ? "aspect-[2.2/1]" : "aspect-[4/3]"}`}>
                <ImageWithFallback
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-stone-500 mb-2">{p.date}</div>
                    <h3 className="text-stone-900 text-2xl tracking-tight">{p.title}</h3>
                  </div>
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 w-10 h-10 rounded-full bg-stone-100 hover:bg-amber-600 hover:text-white flex items-center justify-center transition"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className="mt-3 text-stone-600 leading-relaxed">{p.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="text-xs px-3 py-1 rounded-full bg-stone-100 text-stone-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
