const stack = [
  { name: "React", group: "Frontend" },
  { name: "TypeScript", group: "Frontend" },
  { name: "Next.js", group: "Frontend" },
  { name: "Tailwind CSS", group: "Frontend" },
  { name: "Node.js", group: "Backend" },
  { name: "PostgreSQL", group: "Backend" },
  { name: "Prisma", group: "Backend" },
  { name: "Figma", group: "Design" },
  { name: "Motion", group: "Design" },
];

export function Experience() {
  return (
    <section id="experience" className="bg-[#fbf8f3] py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <div className="text-sm text-amber-700 uppercase tracking-widest mb-3">— Keahlian</div>
          <h2 className="text-stone-900 tracking-tight text-4xl md:text-5xl max-w-2xl">
            Alat yang saya andalkan sehari-hari.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {["Frontend", "Backend", "Design"].map((group) => (
            <div key={group} className="bg-white border border-stone-200 rounded-2xl p-6">
              <div className="text-amber-700 text-sm mb-4">{group}</div>
              <ul className="space-y-3">
                {stack
                  .filter((s) => s.group === group)
                  .map((s) => (
                    <li key={s.name} className="flex items-center justify-between">
                      <span className="text-stone-900">{s.name}</span>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i < 4 ? "bg-amber-600" : "bg-stone-200"
                            }`}
                          />
                        ))}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
