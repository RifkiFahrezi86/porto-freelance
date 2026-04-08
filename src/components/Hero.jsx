import { motion } from 'framer-motion'
import { Github, Linkedin, Instagram, ChevronDown, ExternalLink, Download, MapPin } from 'lucide-react'
import { profile } from '../data/portfolio'

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay"
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/8 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-accent/8 rounded-full blur-[120px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[150px]" />
      </div>

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Photo with animated ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
            className="flex-shrink-0"
          >
            <div className="relative group">
              {/* Outer glow ring */}
              <div className="absolute -inset-3 bg-gradient-to-br from-primary via-accent to-primary-light rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
              {/* Spinning border */}
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-primary via-transparent to-accent animate-[spin_8s_linear_infinite] opacity-60" />
              <div className="absolute -inset-1 rounded-full bg-dark" />
              <img
                src="/profile.jpeg"
                alt={profile.name}
                className="relative w-44 h-44 md:w-56 md:h-56 rounded-full object-cover shadow-2xl"
              />
              {/* Status dot */}
              <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4">
                <div className="relative">
                  <div className="absolute inset-0 w-5 h-5 bg-green-400 rounded-full animate-ping opacity-40" />
                  <div className="w-5 h-5 bg-green-400 rounded-full border-3 border-dark" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text content */}
          <div className="text-center md:text-left flex-1">
            {/* Location badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-primary/5 border border-primary/15 rounded-full px-4 py-1.5 mb-5"
            >
              <MapPin size={14} className="text-primary" />
              <span className="text-sm text-slate-400">{profile.location}</span>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              <span className="text-sm text-green-400">Available</span>
            </motion.div>

            {/* Name & Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <p className="text-lg text-slate-400 mb-2 font-medium">Hi there, I'm</p>
              <h1 className="text-5xl md:text-7xl font-black mb-3 tracking-tight">
                <span className="text-white">{profile.name}</span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-6">
                {profile.title}
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-base text-slate-400 max-w-lg mb-8 leading-relaxed"
            >
              {profile.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-10"
            >
              <a
                href="#portfolio"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-7 py-3.5 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 no-underline"
              >
                <ExternalLink size={18} />
                View My Work
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 glass-card text-slate-300 hover:text-primary px-7 py-3.5 rounded-xl font-semibold transition-all hover:-translate-y-0.5 no-underline"
              >
                Let's Talk
              </a>
            </motion.div>

            {/* Socials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="flex items-center justify-center md:justify-start gap-3"
            >
              {[
                { icon: Github, href: profile.social.github, label: 'GitHub' },
                { icon: Linkedin, href: profile.social.linkedin, label: 'LinkedIn' },
                { icon: Instagram, href: profile.social.instagram, label: 'Instagram' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all hover:-translate-y-1"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="w-1.5 h-1.5 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}
