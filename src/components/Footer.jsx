import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Mail, MapPin, Phone, Github, Linkedin, Instagram, Send, ArrowUp } from 'lucide-react'
import { profile } from '../data/portfolio'

export default function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <>
      {/* Contact Section */}
      <section id="contact" className="py-24 px-6" ref={ref}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Get In Touch
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Punya project atau ide yang ingin diwujudkan? Hubungi saya untuk diskusi lebih lanjut.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            {/* Contact cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-12">
              <div className="bg-surface/60 backdrop-blur border border-white/5 rounded-xl p-6 text-center hover:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Mail size={20} className="text-primary" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">Email</h4>
                <p className="text-xs text-slate-400">{profile.email}</p>
              </div>

              <div className="bg-surface/60 backdrop-blur border border-white/5 rounded-xl p-6 text-center hover:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Phone size={20} className="text-primary" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">WhatsApp</h4>
                <p className="text-xs text-slate-400">{profile.phone}</p>
              </div>

              <div className="bg-surface/60 backdrop-blur border border-white/5 rounded-xl p-6 text-center hover:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <MapPin size={20} className="text-primary" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">Location</h4>
                <p className="text-xs text-slate-400">{profile.location}</p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-2">
                Ready to start a project?
              </h3>
              <p className="text-slate-400 mb-6 text-sm">
                Konsultasi gratis untuk estimasi harga dan timeline project Anda.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-semibold text-sm transition-all hover:shadow-lg hover:shadow-primary/25 no-underline"
                >
                  <Send size={16} />
                  Send Email
                </a>
                <a
                  href={profile.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-slate-600 hover:border-primary text-slate-300 hover:text-primary px-6 py-3 rounded-full font-semibold text-sm transition-all no-underline"
                >
                  <Github size={16} />
                  GitHub
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-dark-2/50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <a href="#home" className="text-xl font-bold text-white no-underline">
                Rifki<span className="text-primary">.</span>
              </a>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Fullstack Developer specializing in creating modern, responsive websites and
                applications with a focus on user experience and performance.
              </p>
              <div className="flex gap-3 mt-4">
                {[
                  { icon: Github, href: profile.social.github },
                  { icon: Linkedin, href: profile.social.linkedin },
                  { icon: Instagram, href: profile.social.instagram },
                ].map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-slate-700 hover:border-primary flex items-center justify-center text-slate-400 hover:text-primary transition-all"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <div className="flex flex-col gap-2">
                {['Home', 'Experience', 'Certificates', 'Portfolio', 'Contact'].map(
                  (link) => (
                    <a
                      key={link}
                      href={`#${link.toLowerCase()}`}
                      className="text-sm text-slate-400 hover:text-primary transition-colors no-underline"
                    >
                      {link}
                    </a>
                  )
                )}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <MapPin size={14} className="text-primary shrink-0" />
                  {profile.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Phone size={14} className="text-primary shrink-0" />
                  {profile.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Mail size={14} className="text-primary shrink-0" />
                  {profile.email}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-10 pt-8 border-t border-white/5">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Rifki. All rights reserved.
            </p>
            <p className="text-sm text-slate-500">
              Designed and built with <span className="text-red-400">♥</span> by Rifki
            </p>
          </div>
        </div>

        {/* Back to top */}
        <a
          href="#home"
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-primary hover:bg-primary-dark flex items-center justify-center text-white shadow-lg shadow-primary/25 transition-all z-50 no-underline"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </a>
      </footer>
    </>
  )
}
