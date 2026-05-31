import path from "node:path";
import { get, put } from "@vercel/blob";
import { portfolioSeed } from "../../src/app/data/portfolio-content.js";

const PORTFOLIO_DATA_PATH = "portfolio/content.json";

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

export function normalizePortfolioData(data = {}) {
  const projects = Array.isArray(data.projects) ? data.projects : portfolioSeed.projects;
  const certificates = Array.isArray(data.certificates) ? data.certificates : portfolioSeed.certificates;

  return {
    projects: projects.map(normalizeProject),
    certificates: certificates.map(normalizeCertificate),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

export async function readPortfolioData() {
  try {
    const blob = await get(PORTFOLIO_DATA_PATH, { access: "private" });

    if (!blob || blob.statusCode !== 200 || !blob.stream) {
      return normalizePortfolioData();
    }

    const text = await new Response(blob.stream).text();
    return normalizePortfolioData(JSON.parse(text));
  } catch (error) {
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
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
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

  if (!ALLOWED_CONTENT_TYPES.includes(contentType) && !contentType.startsWith("image/")) {
    throw new Error("File dari URL harus berupa gambar atau PDF.");
  }

  const extension = guessExtension(sourceUrl, contentType);
  const safeFolder = folder === "certificates" ? "certificates" : "projects";
  const safeFilename = slugify(filenameHint, safeFolder === "projects" ? "project-image" : "certificate-file");
  const targetPath = `portfolio/${safeFolder}/${safeFilename}.${extension}`;

  const body = await response.arrayBuffer();

  return put(targetPath, body, {
    access: "public",
    addRandomSuffix: true,
    cacheControlMaxAge: 60 * 60 * 24 * 30,
    contentType,
  });
}