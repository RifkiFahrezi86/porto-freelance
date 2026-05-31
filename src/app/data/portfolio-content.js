import {
  profile as legacyProfile,
  heroStats as legacyHeroStats,
  siteContent as legacySiteContent,
  certificates as legacyCertificates,
  experiences as legacyExperiences,
  projects as legacyProjects,
  techStack as legacyTechStack,
} from "../../data/portfolio.js";

function slugify(value, fallback) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || fallback;
}

function toProject(project, index) {
  return {
    id: slugify(project.title, `project-${index + 1}`),
    title: project.title,
    description: project.description,
    tags: Array.isArray(project.tech) ? project.tech.slice(0, 4) : [],
    image: project.image || "",
    link: project.demo || project.github || "",
    date: project.duration || (project.clientType === "client" ? "Client Project" : "Personal Project"),
  };
}

function toProfile(profile) {
  return {
    name: profile.name,
    title: profile.title,
    subtitle: profile.subtitle,
    description: profile.description,
    status: profile.status,
    location: profile.location,
    email: profile.email,
    phone: profile.phone,
    image: profile.image || "/profile.jpeg",
    social: {
      github: profile.social?.github || "",
      instagram: profile.social?.instagram || "",
    },
  };
}

function toHeroStat(item, index) {
  return {
    id: slugify(item.id || item.label, `hero-stat-${index + 1}`),
    value: item.value || "",
    label: item.label || "",
    visible: item.visible !== false,
  };
}

function toSiteContent(content) {
  return {
    brandName: content?.brandName || "Rifki Nur Fahrezi Ahmad",
    brandBadge: content?.brandBadge || "Open for AI engineering, websites, and automation",
    navigation: {
      journey: content?.navigation?.journey || "Perjalanan",
      experience: content?.navigation?.experience || "Pengalaman",
      projects: content?.navigation?.projects || "Karya",
      certificates: content?.navigation?.certificates || "Sertifikat",
      contact: content?.navigation?.contact || "Kontak",
      cta: content?.navigation?.cta || "Sapa Saya",
    },
    hero: {
      greeting: content?.hero?.greeting || "Halo, saya",
      primaryCtaLabel: content?.hero?.primaryCtaLabel || "Lihat Karya",
      secondaryCtaLabel: content?.hero?.secondaryCtaLabel || "Hubungi Saya",
      availabilityLabel: content?.hero?.availabilityLabel || "Tersedia untuk proyek baru",
      cardLabel: content?.hero?.cardLabel || "AI Engineer | Web & Automation",
    },
    journey: {
      eyebrow: content?.journey?.eyebrow || "— Perjalanan",
      title: content?.journey?.title || "Rangkaian pengalaman yang membentuk cara saya membangun solusi digital.",
    },
    experience: {
      eyebrow: content?.experience?.eyebrow || "— Pengalaman",
      title: content?.experience?.title || "Saya membangun website, AI workflow, automation, dan internal tools yang benar-benar dipakai.",
    },
    tech: {
      eyebrow: content?.tech?.eyebrow || "— Tech Stack",
      title: content?.tech?.title || "Stack untuk website modern, AI integration, backend systems, dan automation workflows.",
    },
    highlights: {
      focusLabel: content?.highlights?.focusLabel || "Fokus",
      focusText: content?.highlights?.focusText || "AI engineering, website development, automation, dan AI integration",
      workStyleLabel: content?.highlights?.workStyleLabel || "Cara kerja",
      workStyleText: content?.highlights?.workStyleText || "Cepat, rapi, strategis, dan tetap mudah dirawat setelah rilis",
    },
    projects: {
      eyebrow: content?.projects?.eyebrow || "— Karya",
      title: content?.projects?.title || "Pilihan proyek dari arsip kerja dan eksperimen yang saya bangun.",
    },
    certificates: {
      eyebrow: content?.certificates?.eyebrow || "— Sertifikat",
      title: content?.certificates?.title || "Bukti belajar, eksplorasi, dan peningkatan skill yang terus berjalan.",
      previewLabel: content?.certificates?.previewLabel || "Lihat credential",
      openLabel: content?.certificates?.openLabel || "Buka sertifikat",
    },
    contact: {
      eyebrow: content?.contact?.eyebrow || "— Kontak",
      title: content?.contact?.title || "Punya ide, revisi, atau proyek baru?",
      accent: content?.contact?.accent || "Mari kita bahas langsung.",
      footerNote: content?.contact?.footerNote || "Dibuat dengan detail dan standar kerja profesional.",
    },
    seo: {
      title: content?.seo?.title || "Rifki Nur Fahrezi Ahmad | AI Engineer, Website & Automation",
      description: content?.seo?.description || "Portfolio Rifki Nur Fahrezi Ahmad untuk AI engineering, website development, automation workflow, dan integrasi AI yang siap dipakai.",
    },
  };
}

function toCertificate(certificate, index) {
  return {
    id: slugify(certificate.title, `certificate-${index + 1}`),
    title: certificate.title,
    issuer: certificate.issuer,
    date: certificate.date,
    image: String(certificate.image || "").trim() === "#" ? "" : (certificate.image || ""),
    credential: certificate.credential || "",
  };
}

function toJourney(item, index) {
  return {
    id: slugify(`${item.role}-${item.company}`, `journey-${index + 1}`),
    year: item.period,
    title: item.role,
    place: item.company,
    description: item.description,
  };
}

function toTechItem(item, index) {
  return {
    id: slugify(item.name, `tech-${index + 1}`),
    name: item.name,
    level: item.level || "Mahir",
    icon: item.icon || item.name,
  };
}

export const portfolioSeed = {
  profile: toProfile(legacyProfile),
  heroStats: (legacyHeroStats || []).map(toHeroStat),
  siteContent: toSiteContent(legacySiteContent),
  techStack: legacyTechStack.map(toTechItem),
  projects: legacyProjects.map(toProject),
  certificates: legacyCertificates.map(toCertificate),
  journey: legacyExperiences.map(toJourney),
};