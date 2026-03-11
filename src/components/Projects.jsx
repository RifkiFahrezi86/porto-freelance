import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ExternalLink, Github, BarChart3, ShoppingCart, Database } from 'lucide-react'
import { projects } from '../data/portfolio'

const projectIcons = [BarChart3, ShoppingCart, Database]

function ProjectCard({ project, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="group bg-surface/60 backdrop-blur border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all"
    >
      {/* Project Image */}
      <div className="relative h-56 bg-gradient-to-br from-primary/10 via-accent/10 to-primary-dark/10 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />

        {/* Decorative elements */}
        <div className="relative flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            {(() => {
              const IconComp = projectIcons[index] || Database
              return <IconComp size={28} className="text-primary-light" />
            })()}
          </div>
          <span className="text-xs text-slate-500 font-medium">Preview</span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-primary transition-colors no-underline"
            aria-label="Live demo"
          >
            <ExternalLink size={18} />
          </a>
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-primary transition-colors no-underline"
            aria-label="Source code"
          >
            <Github size={18} />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.features.map((feature) => (
            <span
              key={feature}
              className="text-xs text-slate-300 bg-white/5 px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section id="portfolio" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            My Projects
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A selection of projects that showcase my experience in web development, UI design, and backend engineering.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
