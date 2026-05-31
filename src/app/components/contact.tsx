import { Github, Instagram, Mail, MessageCircle, Settings2 } from "lucide-react";
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
    <section id="contact" className="bg-stone-900 text-stone-100 py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-sm text-amber-400 uppercase tracking-widest mb-4">{siteContent.contact.eyebrow}</div>
        <h2 className="text-4xl md:text-6xl tracking-tight leading-tight max-w-3xl">
          {siteContent.contact.title}{" "}
          <span className="italic font-serif text-amber-300">{siteContent.contact.accent}</span>
        </h2>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-400 text-stone-900 hover:bg-amber-300 transition"
          >
            <Mail className="w-4 h-4" /> {profile.email}
          </a>
          <a
            href={profile.social.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-700 hover:bg-stone-800 transition"
          >
            <Github className="w-4 h-4" /> GitHub
          </a>
          <a
            href={profile.social.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-700 hover:bg-stone-800 transition"
          >
            <Instagram className="w-4 h-4" /> Instagram
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-700 hover:bg-stone-800 transition"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
          <a
            href="/admin/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-700 hover:bg-stone-800 transition"
          >
            <Settings2 className="w-4 h-4" /> Admin
          </a>
        </div>

        <div className="mt-24 pt-8 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4 text-sm text-stone-500">
          <div>© 2026 {siteContent.brandName}. {siteContent.contact.footerNote}</div>
          <div>{profile.location}</div>
        </div>
      </div>
    </section>
  );
}
