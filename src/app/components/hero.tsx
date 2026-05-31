import { ArrowDownRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute top-40 -right-32 w-[420px] h-[420px] rounded-full bg-rose-200/40 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-20 pb-28">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-300 bg-white/60 text-sm text-stone-600">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Tersedia untuk proyek baru — Q3 2026
        </div>

        <h1 className="mt-8 max-w-4xl text-stone-900 tracking-tight leading-[1.05] text-5xl md:text-7xl">
          Saya merancang & membangun{" "}
          <span className="italic font-serif text-amber-700">pengalaman digital</span>{" "}
          yang terasa manusiawi.
        </h1>

        <p className="mt-8 max-w-2xl text-stone-600 text-lg leading-relaxed">
          Portofolio ini adalah arsip dari perjalanan saya — kumpulan karya, sertifikasi, dan pelajaran
          yang membentuk cara saya bekerja. Setiap proyek punya cerita. Setiap sertifikat punya konteks.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors"
          >
            Lihat Karya
            <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
          </a>
          <a
            href="#journey"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-300 text-stone-700 hover:bg-white/60 transition-colors"
          >
            Perjalanan saya
          </a>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl">
          {[
            { k: "5+", v: "Tahun pengalaman" },
            { k: "40+", v: "Proyek selesai" },
            { k: "12", v: "Sertifikasi" },
            { k: "98%", v: "Klien puas" },
          ].map((s) => (
            <div key={s.v}>
              <div className="text-stone-900 text-3xl tracking-tight">{s.k}</div>
              <div className="text-sm text-stone-500 mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
