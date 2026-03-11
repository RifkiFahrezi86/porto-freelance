import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Globe, LayoutDashboard, Smartphone, Server, Bug, GraduationCap } from 'lucide-react'
import { services } from '../data/portfolio'

const iconMap = {
  Globe,
  LayoutDashboard,
  Smartphone,
  Server,
  Bug,
  GraduationCap,
}

function ServiceCard({ service, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })
  const IconComponent = iconMap[service.iconName]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group bg-surface/60 backdrop-blur border border-white/5 rounded-xl p-6 hover:border-primary/30 hover:bg-surface-2/40 transition-all text-center"
    >
      <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
        {IconComponent && <IconComponent size={26} className="text-primary" />}
      </div>
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
        {service.title}
      </h3>
      <p className="text-sm text-slate-400">{service.description}</p>
    </motion.div>
  )
}

export default function Services() {
  return (
    <section className="py-24 px-6 bg-dark-2/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Services
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Layanan yang saya tawarkan untuk membantu mewujudkan solusi digital Anda.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
