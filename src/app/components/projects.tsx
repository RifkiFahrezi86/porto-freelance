import { useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Project, SiteContent } from "./portfolio-store";

const MOBILE_PROJECT_LIMIT = 4;

function ProjectCard({ project, featured, compact }: { project: Project; featured?: boolean; compact?: boolean }) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      <div className={`overflow-hidden ${compact ? "aspect-[16/10]" : featured ? "aspect-[2.2/1]" : "aspect-[4/3]"}`}>
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className={compact ? "p-4" : "p-5 sm:p-7"}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <div className="mb-1.5 text-xs text-stone-500 sm:mb-2">{project.date}</div>
            <h3 className={compact ? "text-lg tracking-tight text-stone-900" : "text-xl tracking-tight text-stone-900 sm:text-2xl"}>{project.title}</h3>
          </div>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-100 transition hover:bg-amber-600 hover:text-white"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>
        <p className={compact ? "mt-3 text-sm leading-6 text-stone-600" : "mt-3 text-sm leading-7 text-stone-600 sm:text-base"}>{project.description}</p>
        <div className={compact ? "mt-3 flex flex-wrap gap-1.5" : "mt-4 flex flex-wrap gap-2 sm:mt-5"}>
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function Projects({
  items,
  siteContent,
}: {
  items: Project[];
  siteContent: SiteContent;
}) {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const mobileItems = showAllProjects ? items : items.slice(0, MOBILE_PROJECT_LIMIT);
  const hiddenProjectCount = Math.max(0, items.length - MOBILE_PROJECT_LIMIT);

  return (
    <section id="projects" className="bg-[#f5f0e8] py-16 sm:py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10 sm:mb-14">
          <div>
            <div className="mb-2 text-xs uppercase tracking-widest text-amber-700 sm:mb-3 sm:text-sm">{siteContent.projects.eyebrow}</div>
            <h2 className="max-w-2xl text-3xl tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
              {siteContent.projects.title}
            </h2>
          </div>
        </div>

        <div className="space-y-4 md:hidden">
          {mobileItems.map((project) => (
            <ProjectCard key={project.id} project={project} compact />
          ))}
        </div>

        {items.length > MOBILE_PROJECT_LIMIT ? (
          <button
            type="button"
            onClick={() => setShowAllProjects((current) => !current)}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-300 hover:text-stone-900 md:hidden"
          >
            {showAllProjects ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showAllProjects ? "Ringkas project" : `Tampilkan ${hiddenProjectCount} project lagi`}
          </button>
        ) : null}

        <div className="hidden gap-5 sm:gap-6 md:grid md:grid-cols-2 lg:gap-8">
          {items.map((project, index) => (
            <ProjectCard key={project.id} project={project} featured={index % 3 === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
