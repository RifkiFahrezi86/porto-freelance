import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Briefcase, Zap } from 'lucide-react'
import { experiences, techStack } from '../data/portfolio'
import { techIconMap } from './TechIcons'

function SectionHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
        {title}
      </h2>
      <p className="text-slate-400 max-w-2xl mx-auto">{subtitle}</p>
    </div>
  )
}

function TimelineItem({ exp, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex gap-6 mb-8 last:mb-0"
    >
      {/* Timeline dot */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shrink-0">
          <Briefcase size={20} className="text-primary" />
        </div>
        {index < experiences.length - 1 && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/40 to-transparent mt-2" />
        )}
      </div>

      {/* Content */}
      <div className="bg-surface/60 backdrop-blur border border-white/5 rounded-xl p-5 flex-1 hover:border-primary/30 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-white">{exp.role}</h3>
          <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full">
            {exp.period}
          </span>
        </div>
        <p className="text-sm text-primary-light font-medium mb-2">{exp.company}</p>
        <p className="text-sm text-slate-400 leading-relaxed">{exp.description}</p>
      </div>
    </motion.div>
  )
}

function TechCard({ tech, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group bg-surface/60 backdrop-blur border border-white/5 rounded-xl p-5 text-center hover:border-primary/40 hover:bg-surface-2/60 transition-all cursor-default"
    >
      <div className="text-3xl mb-3 flex justify-center">
        {(() => {
          const IconComponent = techIconMap[tech.name]
          return IconComponent ? <IconComponent size={28} className="text-primary-light" /> : null
        })()}
      </div>
      <h4 className="text-sm font-bold text-white mb-1">{tech.name}</h4>
      <span className="text-xs text-primary-light">{tech.level}</span>
    </motion.div>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Experience & Tech Stack"
          subtitle="A timeline of my career and the technologies I have grown to love and master."
        />

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Timeline */}
          <div>
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Briefcase size={16} className="text-primary" />
              </span>
              Work Experience
            </h3>
            <div>
              {experiences.map((exp, i) => (
                <TimelineItem key={i} exp={exp} index={i} />
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Zap size={16} className="text-primary" />
              </span>
              Tech Stack
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {techStack.map((tech, i) => (
                <TechCard key={i} tech={tech} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
