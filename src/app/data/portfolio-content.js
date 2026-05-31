import {
  certificates as legacyCertificates,
  experiences as legacyExperiences,
  projects as legacyProjects,
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

function toCertificate(certificate, index) {
  return {
    id: slugify(certificate.title, `certificate-${index + 1}`),
    title: certificate.title,
    issuer: certificate.issuer,
    date: certificate.date,
    image: certificate.image || "",
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

export const portfolioSeed = {
  projects: legacyProjects.map(toProject),
  certificates: legacyCertificates.map(toCertificate),
  journey: legacyExperiences.map(toJourney),
};