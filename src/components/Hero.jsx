import { motion } from 'framer-motion'
import { Github, Linkedin, Instagram, ChevronDown, ExternalLink } from 'lucide-react'
import { profile } from '../data/portfolio'

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary via-accent to-primary-light rounded-full blur-md opacity-40" />
              <img
                src="/profile.jpeg"
                alt={profile.name}
                className="relative w-40 h-40 md:w-52 md:h-52 rounded-full object-cover border-4 border-dark-2 shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Text content */}
          <div className="text-center md:text-left flex-1">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-primary-light">Available for freelance work</span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-extrabold mb-4"
            >
              <span className="text-white">{profile.name}</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent">
                {profile.title}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-slate-400 max-w-xl mb-8 leading-relaxed"
            >
              {profile.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8"
            >
              <a
                href="#portfolio"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-7 py-3 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-primary/25 no-underline"
              >
                <ExternalLink size={18} />
                View My Work
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-slate-600 hover:border-primary text-slate-300 hover:text-primary px-7 py-3 rounded-full font-semibold transition-all no-underline"
              >
                Contact Me
              </a>
            </motion.div>

            {/* Social */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center md:justify-start gap-4"
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
                  className="w-11 h-11 rounded-full border border-slate-700 hover:border-primary flex items-center justify-center text-slate-400 hover:text-primary transition-all hover:bg-primary/10"
                  aria-label={label}
                >
                  <Icon size={20} />
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
      >
        <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
        <ChevronDown size={20} />
      </motion.div>
    </section>
  )
}
