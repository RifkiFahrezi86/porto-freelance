import { ArrowDownRight, Mail, MapPin, Sparkles } from "lucide-react";
import { HeroStat, Profile, SiteContent } from "./portfolio-store";

export function Hero({
  profile,
  heroStats,
  siteContent,
}: {
  profile: Profile;
  heroStats: HeroStat[];
  siteContent: SiteContent;
}) {
  const stats = heroStats.filter((item) => item.visible);

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute top-40 -right-32 w-[420px] h-[420px] rounded-full bg-rose-200/40 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-10 pb-14 sm:px-6 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-[minmax(0,1.18fr)_minmax(280px,340px)]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/75 px-3.5 py-2 text-xs text-stone-600 shadow-sm sm:px-4 sm:text-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              {profile.status} - {profile.location}
            </div>

            <h1 className="mt-6 max-w-4xl text-[2.65rem] leading-[1.02] tracking-tight text-stone-900 sm:mt-8 sm:text-5xl md:text-7xl">
              {siteContent.hero.greeting}{" "}
              <span className="font-serif italic text-amber-700">{profile.name}</span>
              <br />
              <span className="text-2xl text-stone-700 sm:text-3xl md:text-5xl">{profile.title}</span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700 sm:text-lg md:text-xl">
              {profile.subtitle}
            </p>

            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
              {profile.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <a
                href="#projects"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-stone-50 shadow-[0_20px_45px_rgba(28,25,23,0.16)] transition-colors hover:bg-stone-800 sm:w-auto"
              >
                {siteContent.hero.primaryCtaLabel}
                <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              </a>
              <a
                href="#contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-stone-300 bg-white/60 px-6 py-3 text-stone-700 transition-colors hover:bg-white sm:w-auto"
              >
                {siteContent.hero.secondaryCtaLabel}
              </a>
            </div>
          </div>

          <div className="relative w-full max-w-[280px] justify-self-center sm:max-w-[320px] lg:justify-self-end">
            <div className="absolute -inset-4 rounded-[2rem] bg-white/60 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-white/75 p-4 shadow-[0_24px_80px_rgba(120,53,15,0.12)] backdrop-blur-sm sm:p-5">
              <div className="overflow-hidden rounded-[1.5rem] bg-[#f5f0e8] aspect-[4/4.9]">
                <img
                  src={profile.image || "/profile.jpeg"}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-start justify-between gap-3 sm:mt-5 sm:gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-amber-700 sm:text-sm">{siteContent.hero.cardLabel}</div>
                  <div className="mt-2 text-xl tracking-tight text-stone-900 sm:text-2xl">{siteContent.brandName}</div>
                  <div className="mt-1 text-sm text-stone-500">{profile.title}</div>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  {siteContent.hero.availabilityLabel}
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm text-stone-600 sm:mt-5">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-700" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-amber-700" />
                  <span>{profile.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:mt-16 sm:gap-4 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.id} className="rounded-[1.5rem] border border-stone-200 bg-white/70 px-4 py-4 shadow-sm backdrop-blur-sm sm:px-5 sm:py-5">
              <div className="text-2xl tracking-tight text-stone-900 sm:text-3xl">{item.value}</div>
              <div className="mt-2 text-xs leading-6 text-stone-500 sm:text-sm">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
