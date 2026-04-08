import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Mail, MapPin, Phone, Github, Linkedin, Instagram, Send, ArrowUp, MessageCircle } from 'lucide-react'
import { profile } from '../data/portfolio'

export default function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const whatsappUrl = `https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}`

  return (
    <>
      {/* Contact Section */}
      <section id="contact" className="py-28 px-6 relative" ref={ref}>
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-2/50 to-dark" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm text-primary font-semibold tracking-widest uppercase mb-3 block"
            >
              Get Started
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black text-white mb-4"
            >
              Let's <span className="gradient-text">Work Together</span>
            </motion.h2>
            <div className="section-line mt-6" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            {/* Contact cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-12">
              {[
                { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
                { icon: Phone, label: 'WhatsApp', value: profile.phone, href: whatsappUrl },
                { icon: MapPin, label: 'Location', value: profile.location, href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="glass-card rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center mx-auto mb-3 group-hover:from-primary/25 group-hover:to-accent/25 transition-all">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">{label}</h4>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-primary transition-colors no-underline">{value}</a>
                  ) : (
                    <p className="text-xs text-slate-400">{value}</p>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center glass-card rounded-2xl p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Ready to start a project?
              </h3>
              <p className="text-slate-400 mb-8 text-sm">
                Konsultasi gratis untuk estimasi harga dan timeline project Anda.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 no-underline"
                >
                  <MessageCircle size={16} />
                  Chat WhatsApp
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 glass-card text-slate-300 hover:text-primary px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 no-underline"
                >
                  <Send size={16} />
                  Send Email
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-dark-2/30">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <a href="#home" className="text-2xl font-black text-white no-underline tracking-tight">
                R<span className="gradient-text">.</span>
              </a>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Fullstack Developer — building modern, responsive websites and web applications with focus on performance and great UX.
              </p>
              <div className="flex gap-2.5 mt-5">
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
                    className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-slate-400 hover:text-primary transition-all hover:-translate-y-0.5"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
              <div className="flex flex-col gap-2.5">
                {['Home', 'Experience', 'Services', 'Certificates', 'Portfolio', 'Contact'].map(
                  (link) => (
                    <a
                      key={link}
                      href={`#${link.toLowerCase()}`}
                      className="text-sm text-slate-400 hover:text-primary hover:translate-x-1 transition-all no-underline inline-block"
                    >
                      {link}
                    </a>
                  )
                )}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Contact</h4>
              <div className="flex flex-col gap-3">
                {[
                  { icon: MapPin, text: profile.location },
                  { icon: Phone, text: profile.phone },
                  { icon: Mail, text: profile.email },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-slate-400">
                    <Icon size={14} className="text-primary shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-12 pt-8 border-t border-white/5">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Rifki. All rights reserved.
            </p>
            <p className="text-xs text-slate-500">
              Built with <span className="text-primary">React</span> & <span className="text-primary">Tailwind CSS</span>
            </p>
          </div>
        </div>

        {/* Back to top */}
        <a
          href="#home"
          className="fixed bottom-6 right-6 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/25 transition-all z-50 no-underline hover:-translate-y-1 hover:shadow-xl"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </a>
      </footer>
    </>
  )
}
