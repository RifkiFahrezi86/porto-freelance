import { BrainCircuit, Briefcase, Code2, ServerCog, Sparkles, Workflow } from "lucide-react";
import { techIconMap } from "../../components/TechIcons.jsx";
import { JourneyItem, SiteContent, TechStackItem } from "./portfolio-store";

const extraTechIcons = {
  AI: BrainCircuit,
  Automation: Workflow,
  Backend: ServerCog,
};

export function Experience({
  items,
  techStack,
  siteContent,
}: {
  items: JourneyItem[];
  techStack: TechStackItem[];
  siteContent: SiteContent;
}) {
  function renderTechIcon(tech: TechStackItem) {
    const iconKey = tech.icon || tech.name;
    const Icon = extraTechIcons[iconKey as keyof typeof extraTechIcons] || techIconMap[iconKey] || techIconMap[tech.name];

    if (!Icon) {
      return <Code2 className="h-4 w-4 text-amber-700" />;
    }

    return <Icon size={18} className="text-amber-700" />;
  }

  return (
    <section id="experience" className="bg-[#fbf8f3] py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <div className="text-sm text-amber-700 uppercase tracking-widest mb-3">{siteContent.experience.eyebrow}</div>
          <h2 className="text-stone-900 tracking-tight text-4xl md:text-5xl max-w-3xl">
            {siteContent.experience.title}
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
          <div className="space-y-5">
            {items.map((item) => (
              <article key={item.id} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-amber-700">
                      <Briefcase className="h-3.5 w-3.5" />
                      {item.place}
                    </div>
                    <h3 className="mt-3 text-2xl tracking-tight text-stone-900">{item.title}</h3>
                  </div>
                  <div className="rounded-full bg-[#f5f0e8] px-3 py-1 text-sm text-stone-600">{item.year}</div>
                </div>
                <p className="mt-4 text-stone-600 leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-stone-200 bg-[#f5f0e8] p-7">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-amber-700">
                <Sparkles className="h-3.5 w-3.5" />
                {siteContent.tech.eyebrow.replace(/^—\s*/, "")}
              </div>
              <h3 className="mt-3 text-2xl tracking-tight text-stone-900">
                {siteContent.tech.title}
              </h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {techStack.map((tech) => (
                  <div key={tech.id} className="rounded-2xl border border-stone-200 bg-white px-4 py-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50">
                        {renderTechIcon(tech)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-stone-900">{tech.name}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500">{tech.level}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-stone-200 bg-white p-5">
                <div className="text-sm uppercase tracking-[0.2em] text-stone-500">{siteContent.highlights.focusLabel}</div>
                <div className="mt-3 text-lg tracking-tight text-stone-900">{siteContent.highlights.focusText}</div>
              </div>
              <div className="rounded-3xl border border-stone-200 bg-white p-5">
                <div className="text-sm uppercase tracking-[0.2em] text-stone-500">{siteContent.highlights.workStyleLabel}</div>
                <div className="mt-3 text-lg tracking-tight text-stone-900">{siteContent.highlights.workStyleText}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
