import path from "node:path";
import { BlobNotFoundError, head, put } from "@vercel/blob";
import { portfolioSeed } from "../../src/app/data/portfolio-content.js";

const PORTFOLIO_DATA_PATH = "portfolio/content.json";
const PORTFOLIO_DATA_CACHE_SECONDS = 60;

const ALLOWED_CONTENT_TYPES = [
  "application/pdf",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
];

const EXTENSION_BY_CONTENT_TYPE = {
  "application/pdf": "pdf",
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/svg+xml": "svg",
  "image/webp": "webp",
};

const SAFE_UPLOAD_FOLDERS = new Set(["profile", "projects", "certificates"]);

function slugify(value, fallback = "item") {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || fallback;
}

function toNullableString(value) {
  if (value == null) {
    return null;
  }

  const text = String(value).trim();
  return text ? text : null;
}

function toStringArray(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function toProjectId(project, index) {
  return slugify(project?.id || project?.title, `project-${index + 1}`);
}

function toCertificateId(certificate, index) {
  return slugify(certificate?.id || certificate?.title, `certificate-${index + 1}`);
}

function toJourneyId(item, index) {
  return slugify(item?.id || `${item?.title}-${item?.place}`, `journey-${index + 1}`);
}

function toTechId(item, index) {
  return slugify(item?.id || item?.name, `tech-${index + 1}`);
}

function toHeroStatId(item, index) {
  return slugify(item?.id || item?.label, `hero-stat-${index + 1}`);
}

function useSeedWhenLegacy(value, seedValue, legacyValues = []) {
  const text = String(value || "").trim();

  if (!text) {
    return String(seedValue || "").trim();
  }

  return legacyValues.includes(text) ? String(seedValue || "").trim() : text;
}

const LEGACY_PROFILE_TITLES = [
  "Fullstack Developer, AI Builder, dan Digital Problem Solver",
  "Fullstack Web Developer",
  "Jasa Pemrograman Profesional",
];

const LEGACY_PROFILE_SUBTITLES = [
  "Website | Dashboard | Automation | AI Tools | Sistem Informasi",
  "React.js | Next.js | Laravel | Node.js",
  "Website | Dashboard | Tugas IT | Skripsi",
];

const LEGACY_PROFILE_DESCRIPTIONS = [
  "Saya membantu membangun website, dashboard, sistem informasi, automation workflow, dan solusi berbasis AI yang terasa rapi di frontend, stabil di backend, dan benar-benar berguna setelah rilis.",
  "Seorang Fullstack Web Developer yang passionate dalam membangun aplikasi web modern. Berpengalaman mengembangkan website, dashboard, dan sistem informasi menggunakan teknologi terkini.",
  "Butuh website, dashboard, atau bantuan tugas pemrograman? Saya siap membantu Anda dengan hasil profesional, pengerjaan cepat, dan harga terjangkau. Konsultasi gratis!",
];

const LEGACY_BRAND_BADGES = ["Open for web, AI, dan automation projects"];
const LEGACY_HERO_CARD_LABELS = ["Web, AI, & Digital Systems"];
const LEGACY_FOCUS_TEXTS = ["Website, dashboard, AI workflow, dan sistem informasi"];
const LEGACY_SEO_TITLES = [
  "Rifki Nur Fahrezi Ahmad | Fullstack, AI, dan Digital Solutions",
  "Portfolio Website Design",
];
const LEGACY_SEO_DESCRIPTIONS = [
  "Portfolio Rifki Nur Fahrezi Ahmad untuk website, dashboard, automation workflow, AI tools, dan sistem informasi yang siap dipakai.",
  "Showcase your portfolio by storing certificates and project images, tracking your progress and experiences in a visually appealing format.",
];

function normalizeSiteContent(content = {}) {
  const seed = portfolioSeed.siteContent || {};

  return {
    brandName: String(content?.brandName || seed?.brandName || "Rifki Nur Fahrezi Ahmad").trim(),
    brandBadge: useSeedWhenLegacy(content?.brandBadge, seed?.brandBadge || "Open for AI engineering, websites, and automation", LEGACY_BRAND_BADGES),
    navigation: {
      journey: String(content?.navigation?.journey || seed?.navigation?.journey || "Perjalanan").trim(),
      experience: String(content?.navigation?.experience || seed?.navigation?.experience || "Pengalaman").trim(),
      projects: String(content?.navigation?.projects || seed?.navigation?.projects || "Karya").trim(),
      certificates: String(content?.navigation?.certificates || seed?.navigation?.certificates || "Sertifikat").trim(),
      contact: String(content?.navigation?.contact || seed?.navigation?.contact || "Kontak").trim(),
      cta: String(content?.navigation?.cta || seed?.navigation?.cta || "Sapa Saya").trim(),
    },
    hero: {
      greeting: String(content?.hero?.greeting || seed?.hero?.greeting || "Halo, saya").trim(),
      primaryCtaLabel: String(content?.hero?.primaryCtaLabel || seed?.hero?.primaryCtaLabel || "Lihat Karya").trim(),
      secondaryCtaLabel: String(content?.hero?.secondaryCtaLabel || seed?.hero?.secondaryCtaLabel || "Hubungi Saya").trim(),
      availabilityLabel: String(content?.hero?.availabilityLabel || seed?.hero?.availabilityLabel || "Tersedia untuk proyek baru").trim(),
      cardLabel: useSeedWhenLegacy(content?.hero?.cardLabel, seed?.hero?.cardLabel || "AI Engineer | Web & Automation", LEGACY_HERO_CARD_LABELS),
    },
    journey: {
      eyebrow: String(content?.journey?.eyebrow || seed?.journey?.eyebrow || "— Perjalanan").trim(),
      title: String(content?.journey?.title || seed?.journey?.title || "Rangkaian pengalaman yang membentuk cara saya membangun solusi digital.").trim(),
    },
    experience: {
      eyebrow: String(content?.experience?.eyebrow || seed?.experience?.eyebrow || "— Pengalaman").trim(),
      title: String(content?.experience?.title || seed?.experience?.title || "Saya membangun website, AI workflow, automation, dan internal tools yang benar-benar dipakai.").trim(),
    },
    tech: {
      eyebrow: String(content?.tech?.eyebrow || seed?.tech?.eyebrow || "— Tech Stack").trim(),
      title: String(content?.tech?.title || seed?.tech?.title || "Stack untuk website modern, AI integration, backend systems, dan automation workflows.").trim(),
    },
    highlights: {
      focusLabel: String(content?.highlights?.focusLabel || seed?.highlights?.focusLabel || "Fokus").trim(),
      focusText: useSeedWhenLegacy(content?.highlights?.focusText, seed?.highlights?.focusText || "AI engineering, website development, automation, dan AI integration", LEGACY_FOCUS_TEXTS),
      workStyleLabel: String(content?.highlights?.workStyleLabel || seed?.highlights?.workStyleLabel || "Cara kerja").trim(),
      workStyleText: String(content?.highlights?.workStyleText || seed?.highlights?.workStyleText || "Cepat, rapi, strategis, dan tetap mudah dirawat setelah rilis").trim(),
    },
    projects: {
      eyebrow: String(content?.projects?.eyebrow || seed?.projects?.eyebrow || "— Karya").trim(),
      title: String(content?.projects?.title || seed?.projects?.title || "Pilihan proyek dari arsip kerja dan eksperimen yang saya bangun.").trim(),
    },
    certificates: {
      eyebrow: String(content?.certificates?.eyebrow || seed?.certificates?.eyebrow || "— Sertifikat").trim(),
      title: String(content?.certificates?.title || seed?.certificates?.title || "Bukti belajar, eksplorasi, dan peningkatan skill yang terus berjalan.").trim(),
      previewLabel: String(content?.certificates?.previewLabel || seed?.certificates?.previewLabel || "Lihat credential").trim(),
      openLabel: String(content?.certificates?.openLabel || seed?.certificates?.openLabel || "Buka sertifikat").trim(),
    },
    contact: {
      eyebrow: String(content?.contact?.eyebrow || seed?.contact?.eyebrow || "— Kontak").trim(),
      title: String(content?.contact?.title || seed?.contact?.title || "Punya ide, revisi, atau proyek baru?").trim(),
      accent: String(content?.contact?.accent || seed?.contact?.accent || "Mari kita bahas langsung.").trim(),
      footerNote: String(content?.contact?.footerNote || seed?.contact?.footerNote || "Dibuat dengan detail dan standar kerja profesional.").trim(),
    },
    seo: {
      title: useSeedWhenLegacy(content?.seo?.title, seed?.seo?.title || "Rifki Nur Fahrezi Ahmad | AI Engineer, Website & Automation", LEGACY_SEO_TITLES),
      description: useSeedWhenLegacy(content?.seo?.description, seed?.seo?.description || "Portfolio Rifki Nur Fahrezi Ahmad untuk AI engineering, website development, automation workflow, dan integrasi AI yang siap dipakai.", LEGACY_SEO_DESCRIPTIONS),
    },
  };
}

function normalizeProfile(profile = {}) {
  const seed = portfolioSeed.profile || {};
  const social = profile?.social && typeof profile.social === "object" ? profile.social : {};

  return {
    name: String(profile?.name || seed.name || "").trim(),
    title: useSeedWhenLegacy(profile?.title, seed.title || "AI Engineer, Web Developer, dan Automation Specialist", LEGACY_PROFILE_TITLES),
    subtitle: useSeedWhenLegacy(profile?.subtitle, seed.subtitle || "AI Engineer | Website Development | Automation | AI Integration", LEGACY_PROFILE_SUBTITLES),
    description: useSeedWhenLegacy(profile?.description, seed.description || "Saya membangun website modern, workflow automation, AI integration, dan internal tools yang membantu bisnis bekerja lebih cepat, lebih cerdas, dan lebih efisien.", LEGACY_PROFILE_DESCRIPTIONS),
    status: String(profile?.status || seed.status || "").trim(),
    location: String(profile?.location || seed.location || "").trim(),
    email: String(profile?.email || seed.email || "").trim(),
    phone: String(profile?.phone || seed.phone || "").trim(),
    image: toNullableString(profile?.image) || toNullableString(seed.image) || "/profile.jpeg",
    social: {
      github: String(social?.github || seed?.social?.github || "").trim(),
      instagram: String(social?.instagram || seed?.social?.instagram || "").trim(),
    },
  };
}

function normalizeHeroStatItem(item, index) {
  return {
    id: toHeroStatId(item, index),
    value: String(item?.value || "").trim(),
    label: String(item?.label || "").trim(),
    visible: item?.visible !== false,
  };
}

function normalizeProject(project, index) {
  return {
    id: toProjectId(project, index),
    title: String(project?.title || "").trim(),
    description: String(project?.description || "").trim(),
    tags: toStringArray(project?.tags),
    image: toNullableString(project?.image),
    link: toNullableString(project?.link),
    date: String(project?.date || "").trim() || "Portfolio Project",
  };
}

function normalizeCertificate(certificate, index) {
  return {
    id: toCertificateId(certificate, index),
    title: String(certificate?.title || "").trim(),
    issuer: String(certificate?.issuer || "").trim(),
    date: String(certificate?.date || "").trim(),
    image: toNullableString(certificate?.image),
    credential: toNullableString(certificate?.credential),
  };
}

function normalizeJourneyItem(item, index) {
  return {
    id: toJourneyId(item, index),
    year: String(item?.year || "").trim(),
    title: String(item?.title || "").trim(),
    place: String(item?.place || "").trim(),
    description: String(item?.description || "").trim(),
  };
}

function normalizeTechStackItem(item, index) {
  return {
    id: toTechId(item, index),
    name: String(item?.name || "").trim(),
    level: String(item?.level || "").trim() || "Mahir",
    icon: String(item?.icon || item?.name || "").trim() || "Code",
  };
}

export function normalizePortfolioData(data = {}) {
  const profile = normalizeProfile(data.profile);
  const siteContent = normalizeSiteContent(data.siteContent);
  const heroStats = Array.isArray(data.heroStats) ? data.heroStats : portfolioSeed.heroStats;
  const journey = Array.isArray(data.journey) ? data.journey : portfolioSeed.journey;
  const techStack = Array.isArray(data.techStack) ? data.techStack : portfolioSeed.techStack;
  const projects = Array.isArray(data.projects) ? data.projects : portfolioSeed.projects;
  const certificates = Array.isArray(data.certificates) ? data.certificates : portfolioSeed.certificates;

  return {
    profile,
    siteContent,
    heroStats: heroStats.map(normalizeHeroStatItem),
    journey: journey.map(normalizeJourneyItem),
    techStack: techStack.map(normalizeTechStackItem),
    projects: projects.map(normalizeProject),
    certificates: certificates.map(normalizeCertificate),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

function createBlobReadUrl(blobUrl, uploadedAt) {
  const url = new URL(blobUrl);
  const version = uploadedAt instanceof Date ? uploadedAt.getTime() : Date.now();
  url.searchParams.set("v", String(version));
  return url.toString();
}

export async function readPortfolioData() {
  try {
    const blob = await head(PORTFOLIO_DATA_PATH);
    const response = await fetch(createBlobReadUrl(blob.url, blob.uploadedAt), {
      cache: "no-store",
    });

    if (!response.ok) {
      return normalizePortfolioData();
    }

    const text = await response.text();
    return normalizePortfolioData(JSON.parse(text));
  } catch (error) {
    if (error instanceof BlobNotFoundError) {
      return normalizePortfolioData();
    }

    console.warn("Falling back to bundled portfolio seed:", error);
    return normalizePortfolioData();
  }
}

export async function writePortfolioData(data) {
  const normalized = normalizePortfolioData({
    ...data,
    updatedAt: new Date().toISOString(),
  });

  await put(PORTFOLIO_DATA_PATH, JSON.stringify(normalized, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: PORTFOLIO_DATA_CACHE_SECONDS,
    contentType: "application/json",
  });

  return normalized;
}

function guessExtension(sourceUrl, contentType) {
  const cleanContentType = String(contentType || "").split(";")[0].trim().toLowerCase();
  const byContentType = EXTENSION_BY_CONTENT_TYPE[cleanContentType];

  if (byContentType) {
    return byContentType;
  }

  try {
    const parsedUrl = new URL(sourceUrl);
    const extname = path.extname(parsedUrl.pathname).replace(/^\./, "").toLowerCase();
    if (extname) {
      return extname;
    }
  } catch {
    return "bin";
  }

  return "bin";
}

function guessExtensionFromFilename(filename, contentType) {
  const cleanContentType = String(contentType || "").split(";")[0].trim().toLowerCase();
  const byContentType = EXTENSION_BY_CONTENT_TYPE[cleanContentType];

  if (byContentType) {
    return byContentType;
  }

  const extname = path.extname(String(filename || "")).replace(/^\./, "").toLowerCase();
  return extname || "bin";
}

function toSafeUploadFolder(folder) {
  const safeFolder = String(folder || "projects").trim().toLowerCase();
  return SAFE_UPLOAD_FOLDERS.has(safeFolder) ? safeFolder : "projects";
}

function validateUploadContentType(folder, contentType) {
  const cleanContentType = String(contentType || "").split(";")[0].trim().toLowerCase();

  if (!cleanContentType) {
    throw new Error("Tipe file tidak dikenali.");
  }

  if (folder === "certificates") {
    if (cleanContentType === "application/pdf" || cleanContentType.startsWith("image/")) {
      return cleanContentType;
    }

    throw new Error("File sertifikat harus berupa PDF atau gambar.");
  }

  if (!cleanContentType.startsWith("image/")) {
    throw new Error("File ini harus berupa gambar.");
  }

  return cleanContentType;
}

async function putAssetBody({ body, folder = "projects", filenameHint = "asset", extension = "bin", contentType }) {
  const safeFolder = toSafeUploadFolder(folder);
  const safeFilename = slugify(
    filenameHint,
    safeFolder === "profile"
      ? "profile-image"
      : safeFolder === "projects"
        ? "project-image"
        : "certificate-file",
  );
  const targetPath = `portfolio/${safeFolder}/${safeFilename}.${extension}`;

  return put(targetPath, body, {
    access: "public",
    addRandomSuffix: true,
    cacheControlMaxAge: 60 * 60 * 24 * 30,
    contentType,
  });
}

export async function importRemoteAsset({ sourceUrl, folder = "projects", filenameHint = "asset" }) {
  let parsedUrl;

  try {
    parsedUrl = new URL(sourceUrl);
  } catch {
    throw new Error("URL aset tidak valid.");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("URL aset harus memakai http atau https.");
  }

  const response = await fetch(parsedUrl, {
    headers: {
      "User-Agent": "RifkiPortfolioImporter/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil file dari URL (${response.status}).`);
  }

  const contentType = String(response.headers.get("content-type") || "application/octet-stream")
    .split(";")[0]
    .trim()
    .toLowerCase();

  const safeFolder = toSafeUploadFolder(folder);
  const validatedContentType = validateUploadContentType(safeFolder, contentType);

  if (!ALLOWED_CONTENT_TYPES.includes(validatedContentType) && !validatedContentType.startsWith("image/")) {
    throw new Error("File dari URL harus berupa gambar atau PDF.");
  }

  const extension = guessExtension(sourceUrl, contentType);
  const body = await response.arrayBuffer();

  return putAssetBody({
    body,
    folder: safeFolder,
    filenameHint,
    extension,
    contentType: validatedContentType,
  });
}

export async function uploadAsset({ fileBase64, originalFilename, contentType, folder = "projects", filenameHint = "asset" }) {
  const safeFolder = toSafeUploadFolder(folder);
  const validatedContentType = validateUploadContentType(safeFolder, contentType);

  if (!ALLOWED_CONTENT_TYPES.includes(validatedContentType) && !validatedContentType.startsWith("image/")) {
    throw new Error("File upload harus berupa gambar atau PDF.");
  }

  const base64 = String(fileBase64 || "").trim();
  if (!base64) {
    throw new Error("File upload kosong.");
  }

  let body;

  try {
    body = Buffer.from(base64, "base64");
  } catch {
    throw new Error("Format file upload tidak valid.");
  }

  if (!body.length) {
    throw new Error("File upload kosong.");
  }

  const extension = guessExtensionFromFilename(originalFilename, validatedContentType);

  return putAssetBody({
    body,
    folder: safeFolder,
    filenameHint,
    extension,
    contentType: validatedContentType,
  });
}