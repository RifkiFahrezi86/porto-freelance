import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Award, ExternalLink } from 'lucide-react'
import { certificates } from '../data/portfolio'

function CertCard({ cert, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-surface/60 backdrop-blur border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-all"
    >
      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
        <Award size={48} className="text-primary/40" />
        <div className="absolute bottom-3 left-3 right-3">
          <span className="text-xs bg-primary/20 text-primary-light px-2 py-1 rounded-full backdrop-blur">
            {cert.issuer}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-white mb-2 group-hover:text-primary transition-colors">
          {cert.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">{cert.date}</span>
          <button className="text-xs text-primary hover:text-primary-light flex items-center gap-1 bg-transparent border-none cursor-pointer">
            View Certificate <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Certificates() {
  return (
    <section id="certificates" className="py-24 px-6 bg-dark-2/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Awards & Certificates
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Professional certifications that validate my expertise and knowledge in various technologies.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {certificates.map((cert, i) => (
            <CertCard key={i} cert={cert} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
