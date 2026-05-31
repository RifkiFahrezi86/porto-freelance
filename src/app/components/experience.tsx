import { useState } from "react";
import { Briefcase, ChevronDown, ChevronUp, Code2, Sparkles } from "lucide-react";
import { isTechLogoAsset, resolveTechIconComponent } from "../../components/TechIcons.jsx";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { JourneyItem, SiteContent, TechStackItem } from "./portfolio-store";

const MOBILE_EXPERIENCE_LIMIT = 3;
const MOBILE_TECH_LIMIT = 6;

function ExperienceCard({ item }: { item: JourneyItem }) {
  return (
    <article className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-amber-700 sm:text-xs">
            <Briefcase className="h-3.5 w-3.5" />
            {item.place}
          </div>
          <h3 className="mt-2.5 text-lg tracking-tight text-stone-900 sm:mt-3 sm:text-2xl">{item.title}</h3>
        </div>
        <div className="w-fit rounded-full bg-[#f5f0e8] px-3 py-1 text-[11px] text-stone-600 sm:text-sm">{item.year}</div>
      </div>
      <p className="mt-3 text-sm leading-6 text-stone-600 sm:mt-4 sm:text-base sm:leading-7">{item.description}</p>
    </article>
  );
}

function TechVisual({ tech }: { tech: TechStackItem }) {
  const logoUrl = isTechLogoAsset(tech.icon) ? tech.icon : "";
  const Icon = resolveTechIconComponent(tech);

  if (logoUrl) {
    return (
      <span className="inline-flex h-full w-full items-center justify-center rounded-xl bg-white p-1.5 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.14)]">
        <ImageWithFallback src={logoUrl} alt={`${tech.name} logo`} className="h-5 w-5 object-contain sm:h-6 sm:w-6" />
      </span>
    );
  }

  if (!Icon) {
    return <Code2 className="h-4 w-4 text-amber-700" />;
  }

  return <Icon size={18} className="text-amber-700" />;
}

function TechCard({ tech }: { tech: TechStackItem }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white px-3 py-3 shadow-sm sm:px-4 sm:py-4">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-amber-50 sm:h-10 sm:w-10">
          <TechVisual tech={tech} />
        </div>
        <div>
          <div className="text-sm font-medium text-stone-900">{tech.name}</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-stone-500 sm:text-xs">{tech.level}</div>
        </div>
      </div>
    </div>
  );
}

export function Experience({
  items,
  techStack,
  siteContent,
}: {
  items: JourneyItem[];
  techStack: TechStackItem[];
  siteContent: SiteContent;
}) {
  const [showAllItems, setShowAllItems] = useState(false);
  const [showAllTech, setShowAllTech] = useState(false);

  const mobileItems = showAllItems ? items : items.slice(0, MOBILE_EXPERIENCE_LIMIT);
  const mobileTechStack = showAllTech ? techStack : techStack.slice(0, MOBILE_TECH_LIMIT);
  const hiddenItemCount = Math.max(0, items.length - MOBILE_EXPERIENCE_LIMIT);
  const hiddenTechCount = Math.max(0, techStack.length - MOBILE_TECH_LIMIT);

  return (
    <section id="experience" className="bg-[#fbf8f3] py-16 sm:py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10 sm:mb-14">
          <div className="mb-2 text-xs uppercase tracking-widest text-amber-700 sm:mb-3 sm:text-sm">{siteContent.experience.eyebrow}</div>
          <h2 className="max-w-3xl text-3xl tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
            {siteContent.experience.title}
          </h2>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
          <div>
            <div className="space-y-3.5 sm:space-y-5 lg:hidden">
              {mobileItems.map((item) => (
                <ExperienceCard key={item.id} item={item} />
              ))}
            </div>

            <div className="hidden space-y-5 lg:block">
              {items.map((item) => (
                <ExperienceCard key={item.id} item={item} />
              ))}
            </div>

            {items.length > MOBILE_EXPERIENCE_LIMIT ? (
              <button
                type="button"
                onClick={() => setShowAllItems((current) => !current)}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-300 hover:text-stone-900 lg:hidden"
              >
                {showAllItems ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showAllItems ? "Ringkas pengalaman" : `Tampilkan ${hiddenItemCount} pengalaman lagi`}
              </button>
            ) : null}
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div className="rounded-3xl border border-stone-200 bg-[#f5f0e8] p-4 sm:p-7">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-amber-700">
                <Sparkles className="h-3.5 w-3.5" />
                {siteContent.tech.eyebrow.replace(/^—\s*/, "")}
              </div>
              <h3 className="mt-2.5 text-lg tracking-tight text-stone-900 sm:mt-3 sm:text-2xl">
                {siteContent.tech.title}
              </h3>
              <div className="mt-4 grid gap-2 sm:mt-6 sm:gap-3 lg:hidden">
                {mobileTechStack.map((tech) => (
                  <TechCard key={tech.id} tech={tech} />
                ))}
              </div>

              <div className="mt-6 hidden gap-3 sm:grid-cols-2 lg:grid">
                {techStack.map((tech) => (
                  <TechCard key={tech.id} tech={tech} />
                ))}
              </div>

              {techStack.length > MOBILE_TECH_LIMIT ? (
                <button
                  type="button"
                  onClick={() => setShowAllTech((current) => !current)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-300 hover:text-stone-900 lg:hidden"
                >
                  {showAllTech ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {showAllTech ? "Ringkas tech stack" : `Tampilkan ${hiddenTechCount} stack lagi`}
                </button>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-stone-200 bg-white p-4 sm:p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-stone-500 sm:text-sm">{siteContent.highlights.focusLabel}</div>
                <div className="mt-2.5 text-base tracking-tight text-stone-900 sm:mt-3 sm:text-lg">{siteContent.highlights.focusText}</div>
              </div>
              <div className="rounded-3xl border border-stone-200 bg-white p-4 sm:p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-stone-500 sm:text-sm">{siteContent.highlights.workStyleLabel}</div>
                <div className="mt-2.5 text-base tracking-tight text-stone-900 sm:mt-3 sm:text-lg">{siteContent.highlights.workStyleText}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
