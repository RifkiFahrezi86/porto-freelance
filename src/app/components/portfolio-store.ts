import { useEffect, useState } from "react";
import { portfolioSeed } from "../data/portfolio-content.js";

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
};

export type JourneyItem = {
  id: string;
  year: string;
  title: string;
  place: string;
  description: string;
};

type Data = {
  projects: Project[];
  certificates: Certificate[];
  journey: JourneyItem[];
};

const seed: Data = {
  projects: portfolioSeed.projects,
  certificates: portfolioSeed.certificates,
  journey: portfolioSeed.journey,
};

type ApiData = {
  projects?: Project[];
  certificates?: Certificate[];
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
          projects: (payload.projects || seed.projects).map(normalizeProject),
          certificates: (payload.certificates || seed.certificates).map(normalizeCertificate),
          journey: seed.journey,
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
