import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { SiteContent } from "./portfolio-store";

export function Navbar({
  siteContent,
}: {
  siteContent: SiteContent;
}) {
  const links = [
    { href: "#journey", label: siteContent.navigation.journey },
    { href: "#experience", label: siteContent.navigation.experience },
    { href: "#projects", label: siteContent.navigation.projects },
    { href: "#certificates", label: siteContent.navigation.certificates },
    { href: "#contact", label: siteContent.navigation.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#fbf8f3]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-6">
        <a href="#top" className="flex min-w-0 items-center gap-3 no-underline">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-200 bg-white text-sm font-semibold uppercase tracking-[0.18em] text-amber-700 shadow-sm">
            RN
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-tight text-stone-900 md:text-base">{siteContent.brandName}</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-stone-500">
              <Sparkles className="h-3 w-3 text-amber-700" />
              {siteContent.brandBadge}
            </span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-stone-600">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-stone-900 transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <Button asChild className="rounded-full bg-stone-900 px-5 hover:bg-stone-800 text-stone-50 shadow-[0_18px_40px_rgba(28,25,23,0.16)]">
          <a href="#contact">{siteContent.navigation.cta}</a>
        </Button>
      </div>
    </header>
  );
}
