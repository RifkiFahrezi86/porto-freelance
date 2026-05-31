import { Button } from "./ui/button";

const links = [
  { href: "#journey", label: "Perjalanan" },
  { href: "#experience", label: "Pengalaman" },
  { href: "#projects", label: "Karya" },
  { href: "#certificates", label: "Sertifikat" },
  { href: "#contact", label: "Kontak" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#fbf8f3]/80 border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="tracking-tight">
          <span className="text-stone-900">studio</span>
          <span className="text-amber-700">.</span>
          <span className="text-stone-500">portfolio</span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-stone-600">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-stone-900 transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <Button asChild className="rounded-full bg-stone-900 hover:bg-stone-800 text-stone-50">
          <a href="#contact">Sapa Saya</a>
        </Button>
      </div>
    </header>
  );
}
