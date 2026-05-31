import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/hero";
import { Journey } from "./components/journey";
import { Experience } from "./components/experience";
import { Projects } from "./components/projects";
import { Certificates } from "./components/certificates";
import { Contact } from "./components/contact";
import { usePortfolio } from "./components/portfolio-store";

export default function App() {
  const { data } = usePortfolio();

  useEffect(() => {
    document.title = data.siteContent.seo.title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", data.siteContent.seo.description);
    }
  }, [data.siteContent.seo.description, data.siteContent.seo.title]);

  return (
    <div className="min-h-screen bg-[#fbf8f3] text-stone-900">
      <Navbar siteContent={data.siteContent} />
      <Hero profile={data.profile} heroStats={data.heroStats} siteContent={data.siteContent} />
      <Journey items={data.journey} siteContent={data.siteContent} />
      <Experience items={data.journey} techStack={data.techStack} siteContent={data.siteContent} />
      <Projects items={data.projects} siteContent={data.siteContent} />
      <Certificates items={data.certificates} siteContent={data.siteContent} />
      <Contact profile={data.profile} siteContent={data.siteContent} />
    </div>
  );
}
