import { Github, Instagram, Mail, MessageCircle } from "lucide-react";
import { Profile, SiteContent } from "./portfolio-store";

export function Contact({
  profile,
  siteContent,
}: {
  profile: Profile;
  siteContent: SiteContent;
}) {
  const whatsappUrl = `https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}`;

  return (
    <section id="contact" className="bg-stone-900 py-16 text-stone-100 sm:py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-3 text-xs uppercase tracking-widest text-amber-400 sm:mb-4 sm:text-sm">{siteContent.contact.eyebrow}</div>
        <h2 className="max-w-3xl text-3xl leading-tight tracking-tight sm:text-4xl md:text-6xl">
          {siteContent.contact.title}{" "}
          <span className="italic font-serif text-amber-300">{siteContent.contact.accent}</span>
        </h2>

        <div className="mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:gap-4">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-stone-900 transition hover:bg-amber-300 sm:w-auto"
          >
            <Mail className="w-4 h-4" /> {profile.email}
          </a>
          <a
            href={profile.social.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-stone-700 px-6 py-3 transition hover:bg-stone-800 sm:w-auto"
          >
            <Github className="w-4 h-4" /> GitHub
          </a>
          <a
            href={profile.social.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-stone-700 px-6 py-3 transition hover:bg-stone-800 sm:w-auto"
          >
            <Instagram className="w-4 h-4" /> Instagram
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-stone-700 px-6 py-3 transition hover:bg-stone-800 sm:w-auto"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        </div>

        <div className="mt-14 flex flex-col items-start gap-2 border-t border-stone-800 pt-6 text-sm text-stone-500 sm:mt-24 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:pt-8">
          <div>© 2026 {siteContent.brandName}. {siteContent.contact.footerNote}</div>
          <div>{profile.location}</div>
        </div>
      </div>
    </section>
  );
}
