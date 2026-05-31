import { useEffect, useState } from "react";
import { portfolioSeed } from "../data/portfolio-content.js";

export type Profile = {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
  location: string;
  email: string;
  phone: string;
  image: string;
  social: {
    github: string;
    instagram: string;
  };
};

export type HeroStat = {
  id: string;
  value: string;
  label: string;
  visible: boolean;
};

export type SiteContent = {
  brandName: string;
  brandBadge: string;
  navigation: {
    journey: string;
    experience: string;
    projects: string;
    certificates: string;
    contact: string;
    cta: string;
  };
  hero: {
    greeting: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    availabilityLabel: string;
    cardLabel: string;
  };
  journey: {
    eyebrow: string;
    title: string;
  };
  experience: {
    eyebrow: string;
    title: string;
  };
  tech: {
    eyebrow: string;
    title: string;
  };
  highlights: {
    focusLabel: string;
    focusText: string;
    workStyleLabel: string;
    workStyleText: string;
  };
  projects: {
    eyebrow: string;
    title: string;
  };
  certificates: {
    eyebrow: string;
    title: string;
    previewLabel: string;
    openLabel: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    accent: string;
    footerNote: string;
  };
  seo: {
    title: string;
    description: string;
  };
};

export type TechStackItem = {
  id: string;
  name: string;
  level: string;
  icon: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link?: string;
  date: string;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  credential?: string;
};

export type JourneyItem = {
  id: string;
  year: string;
  title: string;
  place: string;
  description: string;
};

type Data = {
  profile: Profile;
  siteContent: SiteContent;
  heroStats: HeroStat[];
  techStack: TechStackItem[];
  projects: Project[];
  certificates: Certificate[];
  journey: JourneyItem[];
};

function normalizeProfile(profile: Partial<Profile> = {}): Profile {
  const social = profile.social && typeof profile.social === "object" ? profile.social : {};
  const seed = portfolioSeed.profile;

  return {
    name: profile.name || seed.name || "",
    title: profile.title || seed.title || "",
    subtitle: profile.subtitle || seed.subtitle || "",
    description: profile.description || seed.description || "",
    status: profile.status || seed.status || "",
    location: profile.location || seed.location || "",
    email: profile.email || seed.email || "",
    phone: profile.phone || seed.phone || "",
    image: profile.image || seed.image || "/profile.jpeg",
    social: {
      github: social.github || seed.social.github || "",
      instagram: social.instagram || seed.social.instagram || "",
    },
  };
}

function normalizeSiteContent(content: Partial<SiteContent> = {}): SiteContent {
  const seed = portfolioSeed.siteContent;

  return {
    brandName: content.brandName || seed.brandName || "Rifki Nur Fahrezi Ahmad",
    brandBadge: content.brandBadge || seed.brandBadge || "Open for AI engineering, websites, and automation",
    navigation: {
      journey: content.navigation?.journey || seed.navigation.journey || "Perjalanan",
      experience: content.navigation?.experience || seed.navigation.experience || "Pengalaman",
      projects: content.navigation?.projects || seed.navigation.projects || "Karya",
      certificates: content.navigation?.certificates || seed.navigation.certificates || "Sertifikat",
      contact: content.navigation?.contact || seed.navigation.contact || "Kontak",
      cta: content.navigation?.cta || seed.navigation.cta || "Sapa Saya",
    },
    hero: {
      greeting: content.hero?.greeting || seed.hero.greeting || "Halo, saya",
      primaryCtaLabel: content.hero?.primaryCtaLabel || seed.hero.primaryCtaLabel || "Lihat Karya",
      secondaryCtaLabel: content.hero?.secondaryCtaLabel || seed.hero.secondaryCtaLabel || "Hubungi Saya",
      availabilityLabel: content.hero?.availabilityLabel || seed.hero.availabilityLabel || "Tersedia untuk proyek baru",
      cardLabel: content.hero?.cardLabel || seed.hero.cardLabel || "AI Engineer | Web & Automation",
    },
    journey: {
      eyebrow: content.journey?.eyebrow || seed.journey.eyebrow || "— Perjalanan",
      title: content.journey?.title || seed.journey.title || "Rangkaian pengalaman yang membentuk cara saya membangun solusi digital.",
    },
    experience: {
      eyebrow: content.experience?.eyebrow || seed.experience.eyebrow || "— Pengalaman",
      title: content.experience?.title || seed.experience.title || "Saya membangun website, AI workflow, automation, dan internal tools yang benar-benar dipakai.",
    },
    tech: {
      eyebrow: content.tech?.eyebrow || seed.tech.eyebrow || "— Tech Stack",
      title: content.tech?.title || seed.tech.title || "Stack untuk website modern, AI integration, backend systems, dan automation workflows.",
    },
    highlights: {
      focusLabel: content.highlights?.focusLabel || seed.highlights.focusLabel || "Fokus",
      focusText: content.highlights?.focusText || seed.highlights.focusText || "AI engineering, website development, automation, dan AI integration",
      workStyleLabel: content.highlights?.workStyleLabel || seed.highlights.workStyleLabel || "Cara kerja",
      workStyleText: content.highlights?.workStyleText || seed.highlights.workStyleText || "Cepat, rapi, strategis, dan tetap mudah dirawat setelah rilis",
    },
    projects: {
      eyebrow: content.projects?.eyebrow || seed.projects.eyebrow || "— Karya",
      title: content.projects?.title || seed.projects.title || "Pilihan proyek dari arsip kerja dan eksperimen yang saya bangun.",
    },
    certificates: {
      eyebrow: content.certificates?.eyebrow || seed.certificates.eyebrow || "— Sertifikat",
      title: content.certificates?.title || seed.certificates.title || "Bukti belajar, eksplorasi, dan peningkatan skill yang terus berjalan.",
      previewLabel: content.certificates?.previewLabel || seed.certificates.previewLabel || "Lihat credential",
      openLabel: content.certificates?.openLabel || seed.certificates.openLabel || "Buka sertifikat",
    },
    contact: {
      eyebrow: content.contact?.eyebrow || seed.contact.eyebrow || "— Kontak",
      title: content.contact?.title || seed.contact.title || "Punya ide, revisi, atau proyek baru?",
      accent: content.contact?.accent || seed.contact.accent || "Mari kita bahas langsung.",
      footerNote: content.contact?.footerNote || seed.contact.footerNote || "Dibuat dengan detail dan standar kerja profesional.",
    },
    seo: {
      title: content.seo?.title || seed.seo.title || "Rifki Nur Fahrezi Ahmad | AI Engineer, Website & Automation",
      description: content.seo?.description || seed.seo.description || "Portfolio Rifki Nur Fahrezi Ahmad untuk AI engineering, website development, automation workflow, dan integrasi AI yang siap dipakai.",
    },
  };
}

function normalizeHeroStat(item: Partial<HeroStat>, index: number): HeroStat {
  return {
    id: item.id || `hero-stat-${index + 1}`,
    value: item.value || "",
    label: item.label || "",
    visible: item.visible !== false,
  };
}

function normalizeTechStackItem(item: Partial<TechStackItem>, index: number): TechStackItem {
  return {
    id: item.id || `tech-${index + 1}`,
    name: item.name || "",
    level: item.level || "Mahir",
    icon: item.icon || item.name || "Code",
  };
}

const seed: Data = {
  profile: normalizeProfile(portfolioSeed.profile),
  siteContent: normalizeSiteContent(portfolioSeed.siteContent),
  heroStats: (portfolioSeed.heroStats || []).map(normalizeHeroStat),
  techStack: (portfolioSeed.techStack || []).map(normalizeTechStackItem),
  projects: portfolioSeed.projects,
  certificates: portfolioSeed.certificates,
  journey: portfolioSeed.journey,
};

type ApiData = {
  profile?: Profile;
  siteContent?: SiteContent;
  heroStats?: HeroStat[];
  techStack?: TechStackItem[];
  projects?: Project[];
  certificates?: Certificate[];
  journey?: JourneyItem[];
  updatedAt?: string;
};

function normalizeProject(project: Partial<Project>, index: number): Project {
  return {
    id: project.id || `project-${index + 1}`,
    title: project.title || "",
    description: project.description || "",
    tags: Array.isArray(project.tags) ? project.tags : [],
    image: project.image || "",
    link: project.link || "",
    date: project.date || "Portfolio Project",
  };
}

function normalizeCertificate(certificate: Partial<Certificate>, index: number): Certificate {
  return {
    id: certificate.id || `certificate-${index + 1}`,
    title: certificate.title || "",
    issuer: certificate.issuer || "",
    date: certificate.date || "",
    image: certificate.image || "",
    credential: certificate.credential || "",
  };
}

function normalizeJourneyItem(item: Partial<JourneyItem>, index: number): JourneyItem {
  return {
    id: item.id || `journey-${index + 1}`,
    year: item.year || "",
    title: item.title || "",
    place: item.place || "",
    description: item.description || "",
  };
}

export function usePortfolio() {
  const [data, setData] = useState<Data>(seed);

  useEffect(() => {
    let cancelled = false;

    async function loadPortfolio() {
      try {
        const response = await fetch("/api/portfolio");
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as ApiData;
        if (cancelled) {
          return;
        }

        setData({
          profile: normalizeProfile(payload.profile || seed.profile),
          siteContent: normalizeSiteContent(payload.siteContent || seed.siteContent),
          heroStats: (payload.heroStats || seed.heroStats).map(normalizeHeroStat),
          techStack: (payload.techStack || seed.techStack).map(normalizeTechStackItem),
          projects: (payload.projects || seed.projects).map(normalizeProject),
          certificates: (payload.certificates || seed.certificates).map(normalizeCertificate),
          journey: (payload.journey || seed.journey).map(normalizeJourneyItem),
        });
      } catch {
        // Keep bundled fallback content when the API is unavailable.
      }
    }

    loadPortfolio();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    data,
  };
}
