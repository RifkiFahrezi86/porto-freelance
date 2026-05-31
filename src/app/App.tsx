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

  return (
    <div className="min-h-screen bg-[#fbf8f3] text-stone-900">
      <Navbar />
      <Hero />
      <Journey items={data.journey} />
      <Experience />
      <Projects items={data.projects} />
      <Certificates items={data.certificates} />
      <Contact />
    </div>
  );
}
