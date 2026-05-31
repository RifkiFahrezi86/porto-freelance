import { useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import { Button } from "./ui/button";
import { SiteContent } from "./portfolio-store";

export function Navbar({
  siteContent,
}: {
  siteContent: SiteContent;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { href: "#journey", label: siteContent.navigation.journey },
    { href: "#experience", label: siteContent.navigation.experience },
    { href: "#projects", label: siteContent.navigation.projects },
    { href: "#certificates", label: siteContent.navigation.certificates },
    { href: "#contact", label: siteContent.navigation.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#fbf8f3]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-20 sm:gap-4 sm:px-6">
        <a href="#top" onClick={() => setMenuOpen(false)} className="flex min-w-0 items-center gap-3 no-underline">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-amber-200 bg-white text-sm font-semibold uppercase tracking-[0.18em] text-amber-700 shadow-sm sm:h-11 sm:w-11">
            RN
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-semibold tracking-tight text-stone-900 sm:text-sm md:text-base">{siteContent.brandName}</span>
            <span className="hidden items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-stone-500 sm:inline-flex">
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

        <div className="flex items-center gap-2">
          <Button asChild className="h-10 rounded-full bg-stone-900 px-3 text-sm text-stone-50 shadow-[0_18px_40px_rgba(28,25,23,0.16)] hover:bg-stone-800 sm:h-11 sm:px-5">
            <a href="#contact" onClick={() => setMenuOpen(false)}>{siteContent.navigation.cta}</a>
          </Button>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:border-amber-200 hover:text-stone-900"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-stone-200/80 px-4 pb-4 pt-3 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-[1.5rem] border border-stone-200 bg-white/95 p-3 shadow-[0_20px_40px_rgba(28,25,23,0.08)] backdrop-blur">
            <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">Menu cepat</p>
            <nav className="grid gap-1 md:grid-cols-2 xl:grid-cols-3">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-3 py-3 text-sm font-medium text-stone-700 no-underline transition hover:bg-amber-50 hover:text-stone-900"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
