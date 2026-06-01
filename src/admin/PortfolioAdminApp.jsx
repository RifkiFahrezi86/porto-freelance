import { useEffect, useState } from 'react'
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Code2,
  ExternalLink,
  FileText,
  FolderKanban,
  LoaderCircle,
  LogIn,
  LogOut,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  UserRound,
} from 'lucide-react'
import { portfolioSeed } from '../app/data/portfolio-content.js'
import { isTechLogoAsset } from '../components/TechIcons.jsx'

function getStoredAdminSession() {
  if (typeof window === 'undefined') {
    return ''
  }

  return sessionStorage.getItem('portfolio_admin_session') || sessionStorage.getItem('portfolio_admin_token') || ''
}

function getStoredAdminUsername() {
  if (typeof window === 'undefined') {
    return 'admin'
  }

  return sessionStorage.getItem('portfolio_admin_username') || 'admin'
}

function buildId(prefix) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
  }

  return `${prefix}-${Date.now().toString(36)}`
}

function toArray(value) {
  return Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : []
}

function parseLines(value) {
  return String(value || '')
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function isDocumentUrl(value) {
  return /\.pdf($|[?#])/i.test(String(value || ''))
}

function inferContentTypeFromFilename(filename) {
  const lower = String(filename || '').trim().toLowerCase()

  if (lower.endsWith('.pdf')) {
    return 'application/pdf'
  }

  if (lower.endsWith('.png')) {
    return 'image/png'
  }

  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
    return 'image/jpeg'
  }

  if (lower.endsWith('.gif')) {
    return 'image/gif'
  }

  if (lower.endsWith('.svg')) {
    return 'image/svg+xml'
  }

  if (lower.endsWith('.webp')) {
    return 'image/webp'
  }

  return ''
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = String(reader.result || '')
      const separatorIndex = result.indexOf(',')
      resolve(separatorIndex >= 0 ? result.slice(separatorIndex + 1) : result)
    }

    reader.onerror = () => {
      reject(new Error('Gagal membaca file upload.'))
    }

    reader.readAsDataURL(file)
  })
}

function isManagedPortfolioAsset(value) {
  const text = String(value || '').trim()

  if (!text) {
    return false
  }

  if (text.startsWith('portfolio/')) {
    return true
  }

  try {
    const url = new URL(text)
    return url.hostname.endsWith('.blob.vercel-storage.com') && url.pathname.startsWith('/portfolio/')
  } catch {
    return false
  }
}

function portfolioPayloadReferencesAsset(payload, assetUrl) {
  const target = String(assetUrl || '').trim()

  if (!target) {
    return false
  }

  const assetCandidates = [
    payload?.profile?.image,
    ...(Array.isArray(payload?.projects) ? payload.projects.map((project) => project?.image) : []),
    ...(Array.isArray(payload?.certificates) ? payload.certificates.map((certificate) => certificate?.image) : []),
    ...(Array.isArray(payload?.techStack) ? payload.techStack.map((tech) => tech?.icon) : []),
  ]

  return assetCandidates.some((value) => String(value || '').trim() === target)
}

function hydrateProfile(profile = {}) {
  const social = profile.social && typeof profile.social === 'object' ? profile.social : {}
  const seed = portfolioSeed.profile || {}

  return {
    name: profile.name || seed.name || '',
    title: profile.title || seed.title || '',
    subtitle: profile.subtitle || seed.subtitle || '',
    description: profile.description || seed.description || '',
    status: profile.status || seed.status || '',
    location: profile.location || seed.location || '',
    email: profile.email || seed.email || '',
    phone: profile.phone || seed.phone || '',
    image: profile.image || seed.image || '/profile.jpeg',
    social: {
      github: social.github || seed.social?.github || '',
      instagram: social.instagram || seed.social?.instagram || '',
    },
  }
}

function hydrateSiteContent(content = {}) {
  const seed = portfolioSeed.siteContent || {}

  return {
    brandName: content.brandName || seed.brandName || 'Rifki Nur Fahrezi Ahmad',
    brandBadge: content.brandBadge || seed.brandBadge || 'Open for AI engineering, websites, and automation',
    navigation: {
      journey: content.navigation?.journey || seed.navigation?.journey || 'Perjalanan',
      experience: content.navigation?.experience || seed.navigation?.experience || 'Pengalaman',
      projects: content.navigation?.projects || seed.navigation?.projects || 'Karya',
      certificates: content.navigation?.certificates || seed.navigation?.certificates || 'Sertifikat',
      contact: content.navigation?.contact || seed.navigation?.contact || 'Kontak',
      cta: content.navigation?.cta || seed.navigation?.cta || 'Sapa Saya',
    },
    hero: {
      greeting: content.hero?.greeting || seed.hero?.greeting || 'Halo, saya',
      primaryCtaLabel: content.hero?.primaryCtaLabel || seed.hero?.primaryCtaLabel || 'Lihat Karya',
      secondaryCtaLabel: content.hero?.secondaryCtaLabel || seed.hero?.secondaryCtaLabel || 'Hubungi Saya',
      availabilityLabel: content.hero?.availabilityLabel || seed.hero?.availabilityLabel || 'Tersedia untuk proyek baru',
      cardLabel: content.hero?.cardLabel || seed.hero?.cardLabel || 'AI Engineer | Web & Automation',
    },
    journey: {
      eyebrow: content.journey?.eyebrow || seed.journey?.eyebrow || '— Perjalanan',
      title: content.journey?.title || seed.journey?.title || 'Rangkaian pengalaman yang membentuk cara saya membangun solusi digital.',
    },
    experience: {
      eyebrow: content.experience?.eyebrow || seed.experience?.eyebrow || '— Pengalaman',
      title: content.experience?.title || seed.experience?.title || 'Saya membangun website, AI workflow, automation, dan internal tools yang benar-benar dipakai.',
    },
    tech: {
      eyebrow: content.tech?.eyebrow || seed.tech?.eyebrow || '— Tech Stack',
      title: content.tech?.title || seed.tech?.title || 'Stack untuk website modern, AI integration, backend systems, dan automation workflows.',
    },
    highlights: {
      focusLabel: content.highlights?.focusLabel || seed.highlights?.focusLabel || 'Fokus',
      focusText: content.highlights?.focusText || seed.highlights?.focusText || 'AI engineering, website development, automation, dan AI integration',
      workStyleLabel: content.highlights?.workStyleLabel || seed.highlights?.workStyleLabel || 'Cara kerja',
      workStyleText: content.highlights?.workStyleText || seed.highlights?.workStyleText || 'Cepat, rapi, strategis, dan tetap mudah dirawat setelah rilis',
    },
    projects: {
      eyebrow: content.projects?.eyebrow || seed.projects?.eyebrow || '— Karya',
      title: content.projects?.title || seed.projects?.title || 'Pilihan proyek dari arsip kerja dan eksperimen yang saya bangun.',
    },
    certificates: {
      eyebrow: content.certificates?.eyebrow || seed.certificates?.eyebrow || '— Sertifikat',
      title: content.certificates?.title || seed.certificates?.title || 'Bukti belajar, eksplorasi, dan peningkatan skill yang terus berjalan.',
      previewLabel: content.certificates?.previewLabel || seed.certificates?.previewLabel || 'Lihat credential',
      openLabel: content.certificates?.openLabel || seed.certificates?.openLabel || 'Buka sertifikat',
    },
    contact: {
      eyebrow: content.contact?.eyebrow || seed.contact?.eyebrow || '— Kontak',
      title: content.contact?.title || seed.contact?.title || 'Punya ide, revisi, atau proyek baru?',
      accent: content.contact?.accent || seed.contact?.accent || 'Mari kita bahas langsung.',
      footerNote: content.contact?.footerNote || seed.contact?.footerNote || 'Dibuat dengan detail dan standar kerja profesional.',
    },
    seo: {
      title: content.seo?.title || seed.seo?.title || 'Rifki Nur Fahrezi Ahmad | AI Engineer, Website & Automation',
      description: content.seo?.description || seed.seo?.description || 'Portfolio Rifki Nur Fahrezi Ahmad untuk AI engineering, website development, automation workflow, dan integrasi AI yang siap dipakai.',
    },
  }
}

function hydrateHeroStat(item = {}) {
  return {
    id: item.id || buildId('hero-stat'),
    value: item.value || '',
    label: item.label || '',
    visible: item.visible !== false,
  }
}

function hydrateJourneyItem(item = {}) {
  return {
    id: item.id || buildId('journey'),
    year: item.year || '',
    title: item.title || '',
    place: item.place || '',
    description: item.description || '',
  }
}

function hydrateTechItem(item = {}) {
  return {
    id: item.id || buildId('tech'),
    name: item.name || '',
    level: item.level || 'Mahir',
    icon: item.icon || item.name || 'Code',
    filenameHint: item.filenameHint || '',
  }
}

function hydrateProject(project = {}) {
  return {
    id: project.id || buildId('project'),
    title: project.title || '',
    description: project.description || '',
    tags: toArray(project.tags),
    image: project.image || '',
    link: project.link || '',
    date: project.date || '',
    sourceAssetUrl: '',
    filenameHint: '',
  }
}

function hydrateCertificate(certificate = {}) {
  return {
    id: certificate.id || buildId('certificate'),
    title: certificate.title || '',
    issuer: certificate.issuer || '',
    date: certificate.date || '',
    image: certificate.image || '',
    credential: certificate.credential || '',
    sourceAssetUrl: '',
    filenameHint: '',
  }
}

function serializeProfile(profile) {
  return {
    name: profile.name.trim(),
    title: profile.title.trim(),
    subtitle: profile.subtitle.trim(),
    description: profile.description.trim(),
    status: profile.status.trim(),
    location: profile.location.trim(),
    email: profile.email.trim(),
    phone: profile.phone.trim(),
    image: profile.image.trim() || '/profile.jpeg',
    social: {
      github: profile.social.github.trim(),
      instagram: profile.social.instagram.trim(),
    },
  }
}

function serializeSiteContent(content) {
  return {
    brandName: content.brandName.trim(),
    brandBadge: content.brandBadge.trim(),
    navigation: {
      journey: content.navigation.journey.trim(),
      experience: content.navigation.experience.trim(),
      projects: content.navigation.projects.trim(),
      certificates: content.navigation.certificates.trim(),
      contact: content.navigation.contact.trim(),
      cta: content.navigation.cta.trim(),
    },
    hero: {
      greeting: content.hero.greeting.trim(),
      primaryCtaLabel: content.hero.primaryCtaLabel.trim(),
      secondaryCtaLabel: content.hero.secondaryCtaLabel.trim(),
      availabilityLabel: content.hero.availabilityLabel.trim(),
      cardLabel: content.hero.cardLabel.trim(),
    },
    journey: {
      eyebrow: content.journey.eyebrow.trim(),
      title: content.journey.title.trim(),
    },
    experience: {
      eyebrow: content.experience.eyebrow.trim(),
      title: content.experience.title.trim(),
    },
    tech: {
      eyebrow: content.tech.eyebrow.trim(),
      title: content.tech.title.trim(),
    },
    highlights: {
      focusLabel: content.highlights.focusLabel.trim(),
      focusText: content.highlights.focusText.trim(),
      workStyleLabel: content.highlights.workStyleLabel.trim(),
      workStyleText: content.highlights.workStyleText.trim(),
    },
    projects: {
      eyebrow: content.projects.eyebrow.trim(),
      title: content.projects.title.trim(),
    },
    certificates: {
      eyebrow: content.certificates.eyebrow.trim(),
      title: content.certificates.title.trim(),
      previewLabel: content.certificates.previewLabel.trim(),
      openLabel: content.certificates.openLabel.trim(),
    },
    contact: {
      eyebrow: content.contact.eyebrow.trim(),
      title: content.contact.title.trim(),
      accent: content.contact.accent.trim(),
      footerNote: content.contact.footerNote.trim(),
    },
    seo: {
      title: content.seo.title.trim(),
      description: content.seo.description.trim(),
    },
  }
}

function serializeHeroStat(item) {
  return {
    id: item.id,
    value: item.value.trim(),
    label: item.label.trim(),
    visible: item.visible !== false,
  }
}

function serializeJourneyItem(item) {
  return {
    id: item.id,
    year: item.year.trim(),
    title: item.title.trim(),
    place: item.place.trim(),
    description: item.description.trim(),
  }
}

function serializeTechItem(item) {
  return {
    id: item.id,
    name: item.name.trim(),
    level: item.level.trim() || 'Mahir',
    icon: item.icon.trim() || item.name.trim() || 'Code',
  }
}

function serializeProject(project) {
  return {
    id: project.id,
    title: project.title.trim(),
    description: project.description.trim(),
    tags: toArray(project.tags),
    image: project.image.trim() || null,
    link: project.link.trim() || null,
    date: project.date.trim() || 'Portfolio Project',
  }
}

function serializeCertificate(certificate) {
  return {
    id: certificate.id,
    title: certificate.title.trim(),
    issuer: certificate.issuer.trim(),
    date: certificate.date.trim(),
    image: certificate.image.trim() || null,
    credential: certificate.credential.trim() || null,
  }
}

function emptyJourneyItem() {
  return hydrateJourneyItem({})
}

function emptyHeroStat() {
  return hydrateHeroStat({ visible: true })
}

function emptyTechItem() {
  return hydrateTechItem({})
}

function emptyProject() {
  return hydrateProject({ date: 'Portfolio Project' })
}

function emptyCertificate() {
  return hydrateCertificate({})
}

function Field({ label, children, hint }) {
  return (
    <div className="block space-y-2">
      <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-stone-400">{hint}</span> : null}
    </div>
  )
}

function AssetDropzone({ label, hint, accept, loading = false, currentUrl = '', onFileSelected }) {
  const [isDragging, setIsDragging] = useState(false)
  const supportsPdf = String(accept || '').toLowerCase().includes('pdf')

  async function handleFileList(fileList) {
    const [file] = Array.from(fileList || [])

    if (!file || loading) {
      return
    }

    await onFileSelected?.(file)
  }

  return (
    <Field label={label} hint={hint}>
      <label
        className={`flex min-h-[196px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.5rem] border border-dashed px-5 py-6 text-center transition ${isDragging ? 'border-amber-400 bg-amber-50' : 'border-stone-300 bg-white hover:border-amber-300 hover:bg-amber-50/40'} ${loading ? 'cursor-wait opacity-70' : ''}`}
        onDragOver={(event) => {
          event.preventDefault()
          if (!loading) {
            setIsDragging(true)
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault()
          if (!loading) {
            setIsDragging(true)
          }
        }}
        onDragLeave={(event) => {
          if (event.currentTarget.contains(event.relatedTarget)) {
            return
          }

          setIsDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          void handleFileList(event.dataTransfer.files)
        }}
      >
        <input
          type="file"
          accept={accept}
          className="hidden"
          disabled={loading}
          onChange={(event) => {
            void handleFileList(event.target.files)
            event.target.value = ''
          }}
        />

        {loading ? <LoaderCircle size={24} className="animate-spin text-amber-700" /> : <UploadCloud size={24} className="text-amber-700" />}

        <div>
          <p className="text-sm font-semibold text-stone-900">{loading ? 'Mengupload file ke Blob...' : 'Tarik file ke sini atau klik untuk memilih'}</p>
          <p className="mt-1 text-xs text-stone-500">{supportsPdf ? 'Mendukung gambar dan PDF.' : 'Mendukung file gambar.'}</p>
        </div>

        <div className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-left text-xs text-stone-500 break-all">
          {currentUrl || 'Belum ada file tersimpan.'}
        </div>
      </label>
    </Field>
  )
}

const textInputClass = 'w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 sm:text-sm'
const primaryButtonClass = 'inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-6 text-sm font-semibold text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto'
const secondaryButtonClass = 'inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-5 text-sm font-semibold text-stone-800 transition hover:bg-white sm:w-auto'
const outlineButtonClass = 'inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 sm:w-auto'
const dangerButtonClass = 'inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 sm:w-auto'
const compactDangerButtonClass = 'inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-50 sm:w-auto'
const sectionHeaderClass = 'mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between'
const cardHeaderClass = 'mb-5 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between'
const sectionTitleClass = 'mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl'

export default function PortfolioAdminApp() {
  const [authToken, setAuthToken] = useState(() => getStoredAdminSession())
  const [loginUsername, setLoginUsername] = useState(() => getStoredAdminUsername())
  const [loginPassword, setLoginPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [booting, setBooting] = useState(true)
  const [authSubmitting, setAuthSubmitting] = useState(false)

  const [profile, setProfile] = useState(() => hydrateProfile(portfolioSeed.profile))
  const [siteContent, setSiteContent] = useState(() => hydrateSiteContent(portfolioSeed.siteContent))
  const [heroStats, setHeroStats] = useState(() => (portfolioSeed.heroStats || []).map(hydrateHeroStat))
  const [journey, setJourney] = useState(() => portfolioSeed.journey.map(hydrateJourneyItem))
  const [techStack, setTechStack] = useState(() => portfolioSeed.techStack.map(hydrateTechItem))
  const [projects, setProjects] = useState(() => portfolioSeed.projects.map(hydrateProject))
  const [certificates, setCertificates] = useState(() => portfolioSeed.certificates.map(hydrateCertificate))
  const [updatedAt, setUpdatedAt] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [importingKey, setImportingKey] = useState('')
  const [notice, setNotice] = useState(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    const storedSession = getStoredAdminSession()

    if (!storedSession) {
      setBooting(false)
      return
    }

    void authenticate({ sessionToken: storedSession }, { silent: true })
  }, [])

  function touch() {
    setDirty(true)
    if (notice?.tone === 'success') {
      setNotice(null)
    }
  }

  function buildPortfolioPayload(overrides = {}) {
    const nextProfile = overrides.profile || profile
    const nextSiteContent = overrides.siteContent || siteContent
    const nextHeroStats = overrides.heroStats || heroStats
    const nextJourney = overrides.journey || journey
    const nextTechStack = overrides.techStack || techStack
    const nextProjects = overrides.projects || projects
    const nextCertificates = overrides.certificates || certificates

    return {
      profile: serializeProfile(nextProfile),
      siteContent: serializeSiteContent(nextSiteContent),
      heroStats: nextHeroStats.map(serializeHeroStat),
      journey: nextJourney.map(serializeJourneyItem),
      techStack: nextTechStack.map(serializeTechItem),
      projects: nextProjects.map(serializeProject),
      certificates: nextCertificates.map(serializeCertificate),
    }
  }

  function applySavedPortfolio(payload) {
    setProfile(hydrateProfile(payload.profile || portfolioSeed.profile))
    setSiteContent(hydrateSiteContent(payload.siteContent || portfolioSeed.siteContent))
    setHeroStats((payload.heroStats || portfolioSeed.heroStats || []).map(hydrateHeroStat))
    setJourney((payload.journey || []).map(hydrateJourneyItem))
    setTechStack((payload.techStack || []).map(hydrateTechItem))
    setProjects((payload.projects || []).map(hydrateProject))
    setCertificates((payload.certificates || []).map(hydrateCertificate))
    setUpdatedAt(payload.updatedAt || new Date().toISOString())
    setDirty(false)
  }

  async function persistPortfolio(overrides = {}, options = {}) {
    const {
      successText = 'Semua section portfolio berhasil diperbarui dan tersimpan di Vercel Blob.',
      errorText,
      clearNotice = true,
    } = options

    if (!authToken.trim()) {
      setNotice({ tone: 'error', text: 'Login admin diperlukan untuk menyimpan perubahan.' })
      return false
    }

    setSaving(true)
    if (clearNotice) {
      setNotice(null)
    }

    try {
      const response = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': authToken.trim(),
        },
        body: JSON.stringify(buildPortfolioPayload(overrides)),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || 'Gagal menyimpan portfolio.')
      }

      applySavedPortfolio(payload)
      setNotice({ tone: 'success', text: successText })
      return true
    } catch (error) {
      console.error(error)
      setNotice({
        tone: 'error',
        text: errorText || (error instanceof Error ? error.message : 'Gagal menyimpan portfolio.'),
      })
      return false
    } finally {
      setSaving(false)
    }
  }

  async function loadPortfolio() {
    setLoading(true)

    try {
      const response = await fetch('/api/portfolio')
      if (!response.ok) {
        throw new Error('Gagal memuat portfolio.')
      }

      const payload = await response.json()
      setProfile(hydrateProfile(payload.profile || portfolioSeed.profile))
      setSiteContent(hydrateSiteContent(payload.siteContent || portfolioSeed.siteContent))
      setHeroStats((payload.heroStats || portfolioSeed.heroStats || []).map(hydrateHeroStat))
      setJourney((payload.journey || portfolioSeed.journey).map(hydrateJourneyItem))
      setTechStack((payload.techStack || portfolioSeed.techStack).map(hydrateTechItem))
      setProjects((payload.projects || portfolioSeed.projects).map(hydrateProject))
      setCertificates((payload.certificates || portfolioSeed.certificates).map(hydrateCertificate))
      setUpdatedAt(payload.updatedAt || null)
      setDirty(false)
    } catch (error) {
      console.error(error)
      setNotice({ tone: 'error', text: 'API portfolio belum aktif. Editor memakai data fallback dari project.' })
    } finally {
      setLoading(false)
    }
  }

  async function authenticate(credentials, options = {}) {
    const { silent = false } = options
    const sessionToken = String(credentials?.sessionToken || '').trim()
    const username = String(credentials?.username ?? loginUsername ?? '').trim()
    const password = String(credentials?.password ?? loginPassword ?? '')

    if (!sessionToken && (!username || !password)) {
      setBooting(false)
      if (!silent) {
        setNotice({ tone: 'error', text: 'Masukkan username dan password admin untuk login.' })
      }
      return false
    }

    setAuthSubmitting(true)
    if (!silent) {
      setNotice(null)
    }

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionToken ? { sessionToken } : { username, password }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload.error || 'Gagal login sebagai admin.')
      }

      const nextUsername = String(payload.username || username || getStoredAdminUsername()).trim() || 'admin'
      const nextToken = String(payload.token || sessionToken).trim()

      sessionStorage.setItem('portfolio_admin_session', nextToken)
      sessionStorage.setItem('portfolio_admin_username', nextUsername)
      sessionStorage.removeItem('portfolio_admin_token')
      setAuthToken(nextToken)
      setLoginUsername(nextUsername)
      setLoginPassword('')
      setAuthenticated(true)
      await loadPortfolio()

      if (!silent) {
        setNotice({ tone: 'success', text: 'Login admin berhasil. Control room siap dipakai.' })
      }

      return true
    } catch (error) {
      console.error(error)
      sessionStorage.removeItem('portfolio_admin_session')
      sessionStorage.removeItem('portfolio_admin_token')
      setAuthToken('')
      setAuthenticated(false)
      setLoginPassword('')
      setProfile(hydrateProfile(portfolioSeed.profile))
      setSiteContent(hydrateSiteContent(portfolioSeed.siteContent))
      setHeroStats((portfolioSeed.heroStats || []).map(hydrateHeroStat))
      setJourney(portfolioSeed.journey.map(hydrateJourneyItem))
      setTechStack(portfolioSeed.techStack.map(hydrateTechItem))
      setProjects(portfolioSeed.projects.map(hydrateProject))
      setCertificates(portfolioSeed.certificates.map(hydrateCertificate))

      setNotice({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Gagal login sebagai admin.',
      })

      return false
    } finally {
      setAuthSubmitting(false)
      setBooting(false)
    }
  }

  function logout() {
    sessionStorage.removeItem('portfolio_admin_session')
    sessionStorage.removeItem('portfolio_admin_token')
    setAuthToken('')
    setLoginUsername(getStoredAdminUsername())
    setLoginPassword('')
    setAuthenticated(false)
    setSaving(false)
    setImportingKey('')
    setDirty(false)
    setUpdatedAt(null)
    setNotice(null)
    setProfile(hydrateProfile(portfolioSeed.profile))
    setSiteContent(hydrateSiteContent(portfolioSeed.siteContent))
    setHeroStats((portfolioSeed.heroStats || []).map(hydrateHeroStat))
    setJourney(portfolioSeed.journey.map(hydrateJourneyItem))
    setTechStack(portfolioSeed.techStack.map(hydrateTechItem))
    setProjects(portfolioSeed.projects.map(hydrateProject))
    setCertificates(portfolioSeed.certificates.map(hydrateCertificate))
  }

  function updateProfile(patch) {
    setProfile((current) => ({ ...current, ...patch }))
    touch()
  }

  function updateProfileSocial(key, value) {
    setProfile((current) => ({
      ...current,
      social: {
        ...current.social,
        [key]: value,
      },
    }))
    touch()
  }

  function updateSiteContent(patch) {
    setSiteContent((current) => ({ ...current, ...patch }))
    touch()
  }

  function updateSiteContentSection(section, patch) {
    setSiteContent((current) => ({
      ...current,
      [section]: {
        ...current[section],
        ...patch,
      },
    }))
    touch()
  }

  function updateHeroStat(index, patch) {
    setHeroStats((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, ...patch } : item))
    touch()
  }

  function addHeroStat() {
    setHeroStats((current) => [...current, emptyHeroStat()])
    touch()
  }

  function removeHeroStat(index) {
    setHeroStats((current) => current.filter((_, currentIndex) => currentIndex !== index))
    touch()
  }

  function updateJourneyItem(index, patch) {
    setJourney((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, ...patch } : item))
    touch()
  }

  function addJourneyItem() {
    setJourney((current) => [emptyJourneyItem(), ...current])
    touch()
  }

  function removeJourneyItem(index) {
    setJourney((current) => current.filter((_, currentIndex) => currentIndex !== index))
    touch()
  }

  function updateTechItem(index, patch) {
    setTechStack((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, ...patch } : item))
    touch()
  }

  function addTechItem() {
    setTechStack((current) => [...current, emptyTechItem()])
    touch()
  }

  function removeTechItem(index) {
    setTechStack((current) => current.filter((_, currentIndex) => currentIndex !== index))
    touch()
  }

  function updateProject(index, patch) {
    setProjects((current) => current.map((project, currentIndex) => currentIndex === index ? { ...project, ...patch } : project))
    touch()
  }

  function updateCertificate(index, patch) {
    setCertificates((current) => current.map((certificate, currentIndex) => currentIndex === index ? { ...certificate, ...patch } : certificate))
    touch()
  }

  function addProject() {
    setProjects((current) => [emptyProject(), ...current])
    touch()
  }

  function addCertificate() {
    setCertificates((current) => [emptyCertificate(), ...current])
    touch()
  }

  function removeProject(index) {
    setProjects((current) => current.filter((_, currentIndex) => currentIndex !== index))
    touch()
  }

  function removeCertificate(index) {
    setCertificates((current) => current.filter((_, currentIndex) => currentIndex !== index))
    touch()
  }

  async function deleteMediaAsset(assetValue) {
    const target = String(assetValue || '').trim()

    if (!authToken.trim() || !isManagedPortfolioAsset(target)) {
      return false
    }

    const response = await fetch('/api/portfolio/media', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': authToken.trim(),
      },
      body: JSON.stringify(target.startsWith('portfolio/') ? { pathname: target } : { url: target }),
    })

    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(payload.error || 'Gagal menghapus file lama dari Vercel Blob.')
    }

    return true
  }

  async function uploadAssetFile({ file, folder, filenameHint, currentAssetUrl = '', requestKey, onSuccess, successText }) {
    if (!authToken.trim()) {
      setNotice({ tone: 'error', text: 'Login admin diperlukan sebelum mengupload file ke Vercel Blob.' })
      return
    }

    if (!file) {
      setNotice({ tone: 'error', text: 'Pilih file yang ingin diupload.' })
      return
    }

    setImportingKey(requestKey)
    setNotice(null)

    try {
      const fileBase64 = await readFileAsBase64(file)
      const response = await fetch('/api/portfolio/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': authToken.trim(),
        },
        body: JSON.stringify({
          fileBase64,
          originalFilename: file.name,
          contentType: file.type || inferContentTypeFromFilename(file.name),
          folder,
          filenameHint: String(filenameHint || file.name.replace(/\.[^/.]+$/, '') || folder).trim(),
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || 'Gagal mengupload file ke Blob.')
      }

      const nextState = onSuccess?.(payload.url) || {}
      const nextPayload = buildPortfolioPayload(nextState)
      const saved = await persistPortfolio(nextState, {
        successText: `${successText} File langsung tersimpan dan portfolio ikut diperbarui.`,
        errorText: 'File berhasil diupload ke Vercel Blob, tetapi data portfolio belum tersimpan. Anda masih bisa klik Simpan semua untuk mencoba lagi.',
        clearNotice: false,
      })

      const previousAssetUrl = String(currentAssetUrl || '').trim()
      const shouldDeletePreviousAsset =
        saved &&
        isManagedPortfolioAsset(previousAssetUrl) &&
        previousAssetUrl !== payload.url &&
        !portfolioPayloadReferencesAsset(nextPayload, previousAssetUrl)

      if (shouldDeletePreviousAsset) {
        try {
          await deleteMediaAsset(previousAssetUrl)
        } catch (cleanupError) {
          console.error(cleanupError)
          setNotice({
            tone: 'error',
            text: 'File baru sudah tersimpan, tetapi file lama belum berhasil dihapus otomatis dari Vercel Blob.',
          })
        }
      }
    } catch (error) {
      console.error(error)
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Gagal mengupload file ke Blob.' })
    } finally {
      setImportingKey('')
    }
  }

  async function uploadProfileImage(file) {
    await uploadAssetFile({
      file,
      folder: 'profile',
      filenameHint: profile.name || 'profile-image',
      currentAssetUrl: profile.image,
      requestKey: 'profile-image',
      onSuccess: (url) => {
        const nextProfile = { ...profile, image: url }
        setProfile(nextProfile)
        setDirty(true)
        return { profile: nextProfile }
      },
      successText: 'Foto profil berhasil diupload.',
    })
  }

  async function uploadProjectImage(index, file) {
    const project = projects[index]

    await uploadAssetFile({
      file,
      folder: 'projects',
      filenameHint: project?.filenameHint || project?.title || 'project-image',
      currentAssetUrl: project?.image,
      requestKey: `project-${index}`,
      onSuccess: (url) => {
        const nextProjects = projects.map((item, currentIndex) => currentIndex === index ? { ...item, image: url, sourceAssetUrl: '' } : item)
        setProjects(nextProjects)
        setDirty(true)
        return { projects: nextProjects }
      },
      successText: 'Gambar project berhasil diupload.',
    })
  }

  async function uploadCertificateAsset(index, file) {
    const certificate = certificates[index]

    await uploadAssetFile({
      file,
      folder: 'certificates',
      filenameHint: certificate?.filenameHint || certificate?.title || 'certificate-file',
      currentAssetUrl: certificate?.image,
      requestKey: `certificate-${index}`,
      onSuccess: (url) => {
        const nextCertificates = certificates.map((item, currentIndex) => currentIndex === index ? { ...item, image: url, sourceAssetUrl: '' } : item)
        setCertificates(nextCertificates)
        setDirty(true)
        return { certificates: nextCertificates }
      },
      successText: 'File sertifikat berhasil diupload.',
    })
  }

  async function uploadTechLogo(index, file) {
    const tech = techStack[index]

    await uploadAssetFile({
      file,
      folder: 'tech-stack',
      filenameHint: tech?.filenameHint || tech?.name || 'tech-logo',
      currentAssetUrl: tech?.icon,
      requestKey: `tech-${index}`,
      onSuccess: (url) => {
        const nextTechStack = techStack.map((item, currentIndex) => currentIndex === index ? { ...item, icon: url } : item)
        setTechStack(nextTechStack)
        setDirty(true)
        return { techStack: nextTechStack }
      },
      successText: 'Logo tech stack berhasil diupload.',
    })
  }

  async function savePortfolio() {
    await persistPortfolio()
  }

  const projectCountLabel = `${projects.length} project`
  const certificateCountLabel = `${certificates.length} certificate`
  const journeyCountLabel = `${journey.length} catatan pengalaman`
  const heroStatCountLabel = `${heroStats.length} hero stat`
  const techCountLabel = `${techStack.length} tech stack`

  if (booting) {
    return (
      <div className="min-h-screen bg-[#fbf8f3] text-stone-900">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-10">
          <div className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-6 py-4 text-stone-700 shadow-[0_18px_60px_rgba(120,113,108,0.07)]">
            <LoaderCircle size={18} className="animate-spin text-amber-700" />
            <span>Memeriksa sesi admin...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#fbf8f3] text-stone-900">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
            <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_24px_80px_rgba(120,113,108,0.08)] sm:p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                <Sparkles size={14} />
                Portfolio Control Room
              </div>
              <h1 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl md:text-6xl">
                Login admin untuk mengelola semua isi portfolio.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">
                Setelah login, Anda bisa mengedit branding, hero, SEO, profil, hero stats, catatan pengalaman, tech stack, project, dan certificate dari satu panel yang sama.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  'Edit brand name, judul tab, copy hero, dan metadata SEO',
                  'Atur nama, foto, subtitle, kontak, dan semua teks utama website',
                  'Kelola hero stats agar klien, rating, atau label lain bisa dihapus atau diganti',
                  'Kelola seluruh pengalaman kerja dan catatan perjalanan',
                  'Kembalikan, beri logo, dan ubah tech stack kapan saja',
                  'Tambah, hapus, dan impor media project serta certificate',
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm leading-6 text-stone-700">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_24px_80px_rgba(120,113,108,0.08)] sm:p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-600">
                <ShieldCheck size={14} />
                Admin Login
              </div>

              <h2 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
                Masuk ke panel editor
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-600">
                Gunakan username dan password admin dari environment Vercel. Jika username khusus belum diatur, default username adalah admin.
              </p>

              <div className="mt-8 space-y-4">
                <Field label="Username admin">
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(event) => setLoginUsername(event.target.value)}
                    className={textInputClass}
                    placeholder="admin"
                    autoComplete="username"
                  />
                </Field>

                <Field label="Password admin">
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    className={textInputClass}
                    placeholder="Masukkan password admin"
                    autoComplete="current-password"
                  />
                </Field>

                <button
                  type="button"
                  onClick={() => authenticate({ username: loginUsername, password: loginPassword })}
                  disabled={authSubmitting}
                  className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-6 text-sm font-semibold text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {authSubmitting ? <LoaderCircle size={18} className="animate-spin" /> : <LogIn size={18} />}
                  Login sebagai admin
                </button>
              </div>

              {notice ? (
                <div className={`mt-6 flex items-start gap-3 rounded-2xl border px-4 py-4 text-sm ${notice.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
                  {notice.tone === 'success' ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <AlertCircle size={18} className="mt-0.5 shrink-0" />}
                  <span>{notice.text}</span>
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fbf8f3] text-stone-900">
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 sm:py-10 lg:px-8 lg:pb-10">
        <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_24px_80px_rgba(120,113,108,0.08)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                <Sparkles size={14} />
                Portfolio Control Room
              </div>
              <h1 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl md:text-6xl">
                Editor lengkap untuk mengelola portfolio Anda seperti website profesional.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">
                Semua section utama sekarang tersambung ke data yang sama: branding, SEO, hero, profil, hero stats, pengalaman, tech stack, project, dan certificate.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:justify-end">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <ShieldCheck size={16} />
                Login admin aktif
              </span>
              <button
                type="button"
                onClick={logout}
                className={outlineButtonClass}
              >
                <LogOut size={16} />
                Logout
              </button>
              <button
                type="button"
                onClick={savePortfolio}
                disabled={saving || loading}
                className={primaryButtonClass}
              >
                {saving ? <LoaderCircle size={18} className="animate-spin" /> : <Save size={18} />}
                Simpan semua perubahan
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-stone-600">
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2">
              <UserRound size={16} className="text-amber-700" />
              Branding + profil
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2">
              <Sparkles size={16} className="text-amber-700" />
              {heroStatCountLabel}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2">
              <Briefcase size={16} className="text-amber-700" />
              {journeyCountLabel}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2">
              <Code2 size={16} className="text-amber-700" />
              {techCountLabel}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2">
              <FolderKanban size={16} className="text-amber-700" />
              {projectCountLabel}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2">
              <ShieldCheck size={16} className="text-amber-700" />
              {certificateCountLabel}
            </span>
            <span className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2">
              {updatedAt ? `Terakhir disimpan ${new Date(updatedAt).toLocaleString('id-ID')}` : 'Belum ada timestamp simpan dari API'}
            </span>
            <span className={`rounded-full px-4 py-2 ${dirty ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'}`}>
              {dirty ? 'Ada perubahan belum disimpan' : 'Semua perubahan tersimpan'}
            </span>
            <a href="/" className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-stone-800 no-underline transition hover:bg-white">
              Buka website publik
            </a>
          </div>

          {notice ? (
            <div className={`mt-6 flex items-start gap-3 rounded-2xl border px-4 py-4 text-sm ${notice.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
              {notice.tone === 'success' ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <AlertCircle size={18} className="mt-0.5 shrink-0" />}
              <span>{notice.text}</span>
            </div>
          ) : null}
        </section>

        {loading ? (
          <div className="mt-8 flex min-h-56 items-center justify-center rounded-[2rem] border border-stone-200 bg-white p-10 text-stone-600 shadow-[0_18px_60px_rgba(120,113,108,0.07)]">
            <LoaderCircle size={22} className="animate-spin text-amber-700" />
            <span className="ml-3">Memuat data portfolio...</span>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(120,113,108,0.07)] md:p-8">
              <div className={sectionHeaderClass}>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-amber-700">— Branding, Copy & SEO</p>
                  <h2 className={sectionTitleClass}>Atur nama brand, judul tab, label menu, copy section, dan teks penting lainnya</h2>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Brand name">
                  <input value={siteContent.brandName} onChange={(event) => updateSiteContent({ brandName: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Brand badge kecil">
                  <input value={siteContent.brandBadge} onChange={(event) => updateSiteContent({ brandBadge: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="CTA navbar">
                  <input value={siteContent.navigation.cta} onChange={(event) => updateSiteContentSection('navigation', { cta: event.target.value })} className={textInputClass} />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
                <Field label="Menu perjalanan">
                  <input value={siteContent.navigation.journey} onChange={(event) => updateSiteContentSection('navigation', { journey: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Menu pengalaman">
                  <input value={siteContent.navigation.experience} onChange={(event) => updateSiteContentSection('navigation', { experience: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Menu karya">
                  <input value={siteContent.navigation.projects} onChange={(event) => updateSiteContentSection('navigation', { projects: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Menu sertifikat">
                  <input value={siteContent.navigation.certificates} onChange={(event) => updateSiteContentSection('navigation', { certificates: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Menu kontak">
                  <input value={siteContent.navigation.contact} onChange={(event) => updateSiteContentSection('navigation', { contact: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Label hero card">
                  <input value={siteContent.hero.cardLabel} onChange={(event) => updateSiteContentSection('hero', { cardLabel: event.target.value })} className={textInputClass} />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <Field label="Sapaan hero">
                  <input value={siteContent.hero.greeting} onChange={(event) => updateSiteContentSection('hero', { greeting: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="CTA hero utama">
                  <input value={siteContent.hero.primaryCtaLabel} onChange={(event) => updateSiteContentSection('hero', { primaryCtaLabel: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="CTA hero kedua">
                  <input value={siteContent.hero.secondaryCtaLabel} onChange={(event) => updateSiteContentSection('hero', { secondaryCtaLabel: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Badge availability">
                  <input value={siteContent.hero.availabilityLabel} onChange={(event) => updateSiteContentSection('hero', { availabilityLabel: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Label preview sertifikat">
                  <input value={siteContent.certificates.previewLabel} onChange={(event) => updateSiteContentSection('certificates', { previewLabel: event.target.value })} className={textInputClass} />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Eyebrow perjalanan">
                  <input value={siteContent.journey.eyebrow} onChange={(event) => updateSiteContentSection('journey', { eyebrow: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Eyebrow pengalaman">
                  <input value={siteContent.experience.eyebrow} onChange={(event) => updateSiteContentSection('experience', { eyebrow: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Eyebrow tech stack">
                  <input value={siteContent.tech.eyebrow} onChange={(event) => updateSiteContentSection('tech', { eyebrow: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Eyebrow karya">
                  <input value={siteContent.projects.eyebrow} onChange={(event) => updateSiteContentSection('projects', { eyebrow: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Eyebrow sertifikat">
                  <input value={siteContent.certificates.eyebrow} onChange={(event) => updateSiteContentSection('certificates', { eyebrow: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Eyebrow kontak">
                  <input value={siteContent.contact.eyebrow} onChange={(event) => updateSiteContentSection('contact', { eyebrow: event.target.value })} className={textInputClass} />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                <Field label="Judul perjalanan">
                  <textarea value={siteContent.journey.title} onChange={(event) => updateSiteContentSection('journey', { title: event.target.value })} rows={3} className={textInputClass} />
                </Field>
                <Field label="Judul pengalaman">
                  <textarea value={siteContent.experience.title} onChange={(event) => updateSiteContentSection('experience', { title: event.target.value })} rows={3} className={textInputClass} />
                </Field>
                <Field label="Judul tech stack">
                  <textarea value={siteContent.tech.title} onChange={(event) => updateSiteContentSection('tech', { title: event.target.value })} rows={3} className={textInputClass} />
                </Field>
                <Field label="Judul karya">
                  <textarea value={siteContent.projects.title} onChange={(event) => updateSiteContentSection('projects', { title: event.target.value })} rows={3} className={textInputClass} />
                </Field>
                <Field label="Judul sertifikat">
                  <textarea value={siteContent.certificates.title} onChange={(event) => updateSiteContentSection('certificates', { title: event.target.value })} rows={3} className={textInputClass} />
                </Field>
                <Field label="Judul kontak">
                  <textarea value={siteContent.contact.title} onChange={(event) => updateSiteContentSection('contact', { title: event.target.value })} rows={3} className={textInputClass} />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Label fokus">
                  <input value={siteContent.highlights.focusLabel} onChange={(event) => updateSiteContentSection('highlights', { focusLabel: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Isi fokus">
                  <input value={siteContent.highlights.focusText} onChange={(event) => updateSiteContentSection('highlights', { focusText: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Label cara kerja">
                  <input value={siteContent.highlights.workStyleLabel} onChange={(event) => updateSiteContentSection('highlights', { workStyleLabel: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Isi cara kerja">
                  <input value={siteContent.highlights.workStyleText} onChange={(event) => updateSiteContentSection('highlights', { workStyleText: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Aksen kontak">
                  <input value={siteContent.contact.accent} onChange={(event) => updateSiteContentSection('contact', { accent: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Catatan footer">
                  <input value={siteContent.contact.footerNote} onChange={(event) => updateSiteContentSection('contact', { footerNote: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Tombol buka sertifikat">
                  <input value={siteContent.certificates.openLabel} onChange={(event) => updateSiteContentSection('certificates', { openLabel: event.target.value })} className={textInputClass} />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <Field label="SEO title" hint="Akan menjadi judul tab/browser dan title utama halaman publik.">
                  <input value={siteContent.seo.title} onChange={(event) => updateSiteContentSection('seo', { title: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="SEO description" hint="Dipakai untuk meta description halaman publik.">
                  <textarea value={siteContent.seo.description} onChange={(event) => updateSiteContentSection('seo', { description: event.target.value })} rows={4} className={textInputClass} />
                </Field>
              </div>
            </section>

            <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(120,113,108,0.07)] md:p-8">
              <div className={sectionHeaderClass}>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-amber-700">— Profil & Hero</p>
                  <h2 className={sectionTitleClass}>Atur nama, foto, kontak, dan copy utama website</h2>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Nama">
                  <input value={profile.name} onChange={(event) => updateProfile({ name: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Title utama">
                  <input value={profile.title} onChange={(event) => updateProfile({ title: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Subtitle">
                  <input value={profile.subtitle} onChange={(event) => updateProfile({ subtitle: event.target.value })} className={textInputClass} />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-4">
                <Field label="Status">
                  <input value={profile.status} onChange={(event) => updateProfile({ status: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Lokasi">
                  <input value={profile.location} onChange={(event) => updateProfile({ location: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="Email">
                  <input value={profile.email} onChange={(event) => updateProfile({ email: event.target.value })} className={textInputClass} />
                </Field>
                <Field label="WhatsApp / Telepon">
                  <input value={profile.phone} onChange={(event) => updateProfile({ phone: event.target.value })} className={textInputClass} />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)]">
                <AssetDropzone
                  label="Upload foto profil"
                  hint="Tarik gambar langsung ke sini. File akan diupload ke Blob dan URL-nya diisi otomatis."
                  accept="image/*"
                  loading={importingKey === 'profile-image'}
                  currentUrl={profile.image}
                  onFileSelected={uploadProfileImage}
                />
                <Field label="GitHub URL">
                  <input value={profile.social.github} onChange={(event) => updateProfileSocial('github', event.target.value)} className={textInputClass} placeholder="https://github.com/..." />
                </Field>
                <Field label="Instagram URL">
                  <input value={profile.social.instagram} onChange={(event) => updateProfileSocial('instagram', event.target.value)} className={textInputClass} placeholder="https://instagram.com/..." />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
                <Field label="Deskripsi utama" hint="Dipakai di hero section dan memberi konteks profesional tentang Anda.">
                  <textarea value={profile.description} onChange={(event) => updateProfile({ description: event.target.value })} rows={7} className={textInputClass} />
                </Field>

                <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Preview foto</p>
                  <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white">
                    <img src={profile.image || '/profile.jpeg'} alt={profile.name || 'Profile'} className="h-64 w-full object-cover" />
                  </div>
                  <div className="mt-4 text-sm text-stone-600">
                    Foto ini akan dipakai di hero dengan ukuran yang lebih proporsional daripada sebelumnya.
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(120,113,108,0.07)] md:p-8">
              <div className={sectionHeaderClass}>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-amber-700">— Hero Stats</p>
                  <h2 className={sectionTitleClass}>Atur angka dan label hero, termasuk menghapus klien atau label lain yang tidak Anda mau</h2>
                </div>
                <button
                  type="button"
                  onClick={addHeroStat}
                  className={secondaryButtonClass}
                >
                  <Plus size={16} />
                  Tambah hero stat
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {heroStats.map((item, index) => (
                  <article key={item.id} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-stone-500">{item.id}</p>
                        <h3 className="mt-2 text-lg font-semibold text-stone-900">Stat #{index + 1}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeHeroStat(index)}
                        className={compactDangerButtonClass}
                      >
                        <Trash2 size={12} />
                        Hapus
                      </button>
                    </div>

                    <div className="grid gap-4">
                      <Field label="Nilai angka / teks">
                        <input value={item.value} onChange={(event) => updateHeroStat(index, { value: event.target.value })} className={textInputClass} placeholder="50+" />
                      </Field>
                      <Field label="Label">
                        <input value={item.label} onChange={(event) => updateHeroStat(index, { label: event.target.value })} className={textInputClass} placeholder="Proyek selesai" />
                      </Field>
                      <label className="inline-flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700">
                        <input type="checkbox" checked={item.visible !== false} onChange={(event) => updateHeroStat(index, { visible: event.target.checked })} />
                        Tampilkan di hero
                      </label>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(120,113,108,0.07)] md:p-8">
              <div className={sectionHeaderClass}>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-amber-700">— Pengalaman & Catatan</p>
                  <h2 className={sectionTitleClass}>Kelola semua pengalaman yang tampil di journey dan section pengalaman</h2>
                </div>
                <button
                  type="button"
                  onClick={addJourneyItem}
                  className={secondaryButtonClass}
                >
                  <Plus size={16} />
                  Tambah pengalaman
                </button>
              </div>

              <div className="space-y-5">
                {journey.map((item, index) => (
                  <article key={item.id} className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5 md:p-6">
                    <div className={cardHeaderClass}>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-stone-500">{item.id}</p>
                        <h3 className="mt-2 text-xl font-semibold text-stone-900">Catatan pengalaman #{index + 1}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeJourneyItem(index)}
                        className={dangerButtonClass}
                      >
                        <Trash2 size={14} />
                        Hapus
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <Field label="Periode / tahun">
                        <input value={item.year} onChange={(event) => updateJourneyItem(index, { year: event.target.value })} className={textInputClass} />
                      </Field>
                      <Field label="Peran / jabatan">
                        <input value={item.title} onChange={(event) => updateJourneyItem(index, { title: event.target.value })} className={textInputClass} />
                      </Field>
                      <Field label="Tempat / perusahaan">
                        <input value={item.place} onChange={(event) => updateJourneyItem(index, { place: event.target.value })} className={textInputClass} />
                      </Field>
                    </div>

                    <div className="mt-4">
                      <Field label="Catatan pengalaman">
                        <textarea value={item.description} onChange={(event) => updateJourneyItem(index, { description: event.target.value })} rows={5} className={textInputClass} />
                      </Field>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(120,113,108,0.07)] md:p-8">
              <div className={sectionHeaderClass}>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-amber-700">— Tech Stack</p>
                  <h2 className={sectionTitleClass}>Kembalikan, beri logo, dan ubah tech stack lama Anda kapan saja</h2>
                </div>
                <button
                  type="button"
                  onClick={addTechItem}
                  className={secondaryButtonClass}
                >
                  <Plus size={16} />
                  Tambah tech stack
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {techStack.map((item, index) => {
                  const requestKey = `tech-${index}`
                  const isImporting = importingKey === requestKey
                  const currentLogoUrl = isTechLogoAsset(item.icon) ? item.icon : ''

                  return (
                  <article key={item.id} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-stone-500">{item.id}</p>
                        <h3 className="mt-2 text-lg font-semibold text-stone-900">Tech #{index + 1}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTechItem(index)}
                        className={compactDangerButtonClass}
                      >
                        <Trash2 size={12} />
                        Hapus
                      </button>
                    </div>

                    <div className="grid gap-4">
                      <Field label="Nama teknologi">
                        <input value={item.name} onChange={(event) => updateTechItem(index, { name: event.target.value })} className={textInputClass} />
                      </Field>
                      <Field label="Level / label">
                        <input value={item.level} onChange={(event) => updateTechItem(index, { level: event.target.value })} className={textInputClass} placeholder="Mahir" />
                      </Field>
                      <Field label="Icon key / URL logo" hint="Bisa isi key seperti React.js, SQL, Python, OpenAI API, atau tempel URL gambar/logo Blob langsung.">
                        <input value={item.icon} onChange={(event) => updateTechItem(index, { icon: event.target.value })} className={textInputClass} placeholder="React.js atau https://..." />
                      </Field>
                    </div>

                    <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                      <AssetDropzone
                        label="Upload logo tech"
                        hint="Tarik logo PNG, SVG, JPG, atau WEBP ke sini. URL logo akan terisi otomatis setelah upload."
                        accept="image/*,.svg"
                        loading={isImporting}
                        currentUrl={currentLogoUrl}
                        onFileSelected={(file) => uploadTechLogo(index, file)}
                      />
                      <Field label="Nama file Blob" hint="Opsional, dipakai sebagai nama dasar file logo di Blob.">
                        <input value={item.filenameHint} onChange={(event) => updateTechItem(index, { filenameHint: event.target.value })} className={textInputClass} placeholder="misal: openai-logo" />
                      </Field>
                    </div>

                    {currentLogoUrl ? (
                      <div className="mt-4 rounded-[1.5rem] border border-stone-200 bg-white p-4 text-sm text-stone-600">
                        <p className="font-semibold text-stone-900">Preview logo</p>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <img src={currentLogoUrl} alt={`${item.name || `Tech ${index + 1}`} logo`} className="h-11 w-11 rounded-2xl border border-stone-200 bg-stone-50 object-contain p-1.5" />
                          <a href={currentLogoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-stone-700 no-underline hover:text-stone-900">
                            <ExternalLink size={14} />
                            Buka logo
                          </a>
                        </div>
                      </div>
                    ) : null}
                  </article>
                  )
                })}
              </div>
            </section>

            <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(120,113,108,0.07)] md:p-8">
              <div className={sectionHeaderClass}>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-amber-700">— Projects</p>
                  <h2 className={sectionTitleClass}>Kelola karya yang tampil di landing page</h2>
                </div>
                <button
                  type="button"
                  onClick={addProject}
                  className={secondaryButtonClass}
                >
                  <Plus size={16} />
                  Tambah project
                </button>
              </div>

              <div className="space-y-5">
                {projects.map((project, index) => {
                  const requestKey = `project-${index}`
                  const isImporting = importingKey === requestKey

                  return (
                    <article key={project.id} className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5 md:p-6">
                      <div className={cardHeaderClass}>
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-stone-500">{project.id}</p>
                          <h3 className="mt-2 text-xl font-semibold text-stone-900">Project #{index + 1}</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className={dangerButtonClass}
                        >
                          <Trash2 size={14} />
                          Hapus
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <Field label="Judul project">
                          <input value={project.title} onChange={(event) => updateProject(index, { title: event.target.value })} className={textInputClass} />
                        </Field>
                        <Field label="Label kecil" hint="Akan tampil di bagian atas kartu, misalnya Client Project atau 7 hari.">
                          <input value={project.date} onChange={(event) => updateProject(index, { date: event.target.value })} className={textInputClass} />
                        </Field>
                        <Field label="Link tujuan" hint="Demo live, GitHub, atau URL portfolio terkait.">
                          <input value={project.link} onChange={(event) => updateProject(index, { link: event.target.value })} className={textInputClass} placeholder="https://..." />
                        </Field>
                      </div>

                      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                        <AssetDropzone
                          label="Upload gambar project"
                          hint="Tarik gambar project atau klik area ini. Setelah upload, URL akan terisi otomatis."
                          accept="image/*"
                          loading={isImporting}
                          currentUrl={project.image}
                          onFileSelected={(file) => uploadProjectImage(index, file)}
                        />
                        <Field label="Nama file Blob" hint="Opsional, dipakai sebagai nama dasar file di Blob.">
                          <input value={project.filenameHint} onChange={(event) => updateProject(index, { filenameHint: event.target.value })} className={textInputClass} placeholder="misal: eoffice-cover" />
                        </Field>
                      </div>

                      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                        <Field label="Deskripsi">
                          <textarea value={project.description} onChange={(event) => updateProject(index, { description: event.target.value })} rows={5} className={textInputClass} />
                        </Field>
                        <Field label="Tag project" hint="Satu item per baris atau pisahkan dengan koma.">
                          <textarea value={project.tags.join('\n')} onChange={(event) => updateProject(index, { tags: parseLines(event.target.value) })} rows={5} className={textInputClass} />
                        </Field>
                      </div>

                      {(project.image || project.link) ? (
                        <div className="mt-4 rounded-[1.5rem] border border-stone-200 bg-white p-4 text-sm text-stone-600">
                          <p className="font-semibold text-stone-900">Preview</p>
                          <div className="mt-3 flex flex-wrap gap-3">
                            {project.image ? <a href={project.image} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-stone-700 no-underline hover:text-stone-900"><ExternalLink size={14} /> Buka gambar</a> : null}
                            {project.link ? <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-stone-700 no-underline hover:text-stone-900"><ExternalLink size={14} /> Buka link</a> : null}
                          </div>
                        </div>
                      ) : null}
                    </article>
                  )
                })}
              </div>
            </section>

            <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(120,113,108,0.07)] md:p-8">
              <div className={sectionHeaderClass}>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-amber-700">— Certificates</p>
                  <h2 className={sectionTitleClass}>Tambahkan file sertifikat ke portfolio</h2>
                </div>
                <button
                  type="button"
                  onClick={addCertificate}
                  className={secondaryButtonClass}
                >
                  <Plus size={16} />
                  Tambah certificate
                </button>
              </div>

              <div className="space-y-5">
                {certificates.map((certificate, index) => {
                  const requestKey = `certificate-${index}`
                  const isImporting = importingKey === requestKey

                  return (
                    <article key={certificate.id} className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5 md:p-6">
                      <div className={cardHeaderClass}>
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-stone-500">{certificate.id}</p>
                          <h3 className="mt-2 text-xl font-semibold text-stone-900">Certificate #{index + 1}</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCertificate(index)}
                          className={dangerButtonClass}
                        >
                          <Trash2 size={14} />
                          Hapus
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-4">
                        <Field label="Judul certificate">
                          <input value={certificate.title} onChange={(event) => updateCertificate(index, { title: event.target.value })} className={textInputClass} />
                        </Field>
                        <Field label="Issuer">
                          <input value={certificate.issuer} onChange={(event) => updateCertificate(index, { issuer: event.target.value })} className={textInputClass} />
                        </Field>
                        <Field label="Tanggal / tahun">
                          <input value={certificate.date} onChange={(event) => updateCertificate(index, { date: event.target.value })} className={textInputClass} placeholder="2026" />
                        </Field>
                        <Field label="Credential / label">
                          <input value={certificate.credential} onChange={(event) => updateCertificate(index, { credential: event.target.value })} className={textInputClass} placeholder="Verified" />
                        </Field>
                      </div>

                      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                        <AssetDropzone
                          label="Upload file sertifikat"
                          hint="Tarik PDF atau gambar sertifikat ke sini. File akan diupload ke Blob dan dipakai di website publik."
                          accept="image/*,application/pdf,.pdf"
                          loading={isImporting}
                          currentUrl={certificate.image}
                          onFileSelected={(file) => uploadCertificateAsset(index, file)}
                        />
                        <Field label="Nama file Blob" hint="Opsional, dipakai sebagai nama dasar file di Blob.">
                          <input value={certificate.filenameHint} onChange={(event) => updateCertificate(index, { filenameHint: event.target.value })} className={textInputClass} placeholder="misal: nextjs-dashboard-certificate" />
                        </Field>
                      </div>

                      {certificate.image ? (
                        <div className="mt-4 rounded-[1.5rem] border border-stone-200 bg-white p-4 text-sm text-stone-600">
                          <p className="font-semibold text-stone-900">Preview</p>
                          <div className="mt-3 flex flex-wrap gap-3">
                            <a href={certificate.image} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-stone-700 no-underline hover:text-stone-900">
                              {isDocumentUrl(certificate.image) ? <FileText size={14} /> : <ExternalLink size={14} />}
                              Buka file sertifikat
                            </a>
                          </div>
                        </div>
                      ) : null}
                    </article>
                  )
                })}
              </div>
            </section>

            <section className="rounded-[2rem] border border-dashed border-stone-300 bg-white/70 p-6 text-sm leading-7 text-stone-600">
              <p className="font-semibold text-stone-900">Environment yang perlu disiapkan di Vercel</p>
              <p className="mt-2">Set salah satu kredensial Blob yang didukung Vercel, yaitu BLOB_READ_WRITE_TOKEN atau koneksi store via OIDC. Untuk login admin, siapkan PORTFOLIO_ADMIN_USERNAME dan PORTFOLIO_ADMIN_PASSWORD. PORTFOLIO_ADMIN_TOKEN masih bisa dipakai sebagai fallback password atau session secret lama.</p>
              <p className="mt-2">Data publik sekarang mencakup profile, siteContent, heroStats, journey, tech stack, projects, dan certificates dari storage yang sama.</p>
            </section>
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-[#fbf8f3]/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto max-w-7xl rounded-[1.5rem] border border-stone-200 bg-white px-4 py-4 shadow-[0_-12px_30px_rgba(120,113,108,0.12)]">
          <div className="flex flex-col gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">Editor mobile</p>
              <p className={`truncate text-sm font-medium ${dirty ? 'text-amber-800' : 'text-emerald-700'}`}>
                {dirty ? 'Ada perubahan belum disimpan' : 'Semua perubahan tersimpan'}
              </p>
            </div>
            <button
              type="button"
              onClick={savePortfolio}
              disabled={saving || loading}
              className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-5 text-sm font-semibold text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? <LoaderCircle size={18} className="animate-spin" /> : <Save size={18} />}
              Simpan perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}