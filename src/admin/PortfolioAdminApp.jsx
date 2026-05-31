import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  FolderKanban,
  LoaderCircle,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
} from 'lucide-react'
import { portfolioSeed } from '../app/data/portfolio-content.js'

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
    sourceAssetUrl: '',
    filenameHint: '',
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
  }
}

function emptyProject() {
  return hydrateProject({ date: 'Portfolio Project' })
}

function emptyCertificate() {
  return hydrateCertificate({})
}

function Field({ label, children, hint }) {
  return (
    <label className="block space-y-2">
      <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-stone-400">{hint}</span> : null}
    </label>
  )
}

function textInputClass() {
  return 'w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
}

export default function PortfolioAdminApp() {
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem('portfolio_admin_token') || '')
  const [projects, setProjects] = useState(() => portfolioSeed.projects.map(hydrateProject))
  const [certificates, setCertificates] = useState(() => portfolioSeed.certificates.map(hydrateCertificate))
  const [updatedAt, setUpdatedAt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [importingKey, setImportingKey] = useState('')
  const [notice, setNotice] = useState(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (adminToken) {
      sessionStorage.setItem('portfolio_admin_token', adminToken)
      return
    }

    sessionStorage.removeItem('portfolio_admin_token')
  }, [adminToken])

  useEffect(() => {
    let cancelled = false

    async function loadPortfolio() {
      try {
        const response = await fetch('/api/portfolio')
        if (!response.ok) {
          throw new Error('Gagal memuat portfolio.')
        }

        const payload = await response.json()
        if (cancelled) {
          return
        }

        setProjects((payload.projects || portfolioSeed.projects).map(hydrateProject))
        setCertificates((payload.certificates || portfolioSeed.certificates).map(hydrateCertificate))
        setUpdatedAt(payload.updatedAt || null)
        setDirty(false)
      } catch (error) {
        console.error(error)
        if (!cancelled) {
          setNotice({ tone: 'error', text: 'API portfolio belum aktif. Editor memakai data fallback dari project.' })
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadPortfolio()

    return () => {
      cancelled = true
    }
  }, [])

  const projectCountLabel = useMemo(() => `${projects.length} project`, [projects.length])
  const certificateCountLabel = useMemo(() => `${certificates.length} certificate`, [certificates.length])

  function touch() {
    setDirty(true)
    if (notice?.tone === 'success') {
      setNotice(null)
    }
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

  async function importAsset(kind, index) {
    if (!adminToken.trim()) {
      setNotice({ tone: 'error', text: 'Masukkan admin token sebelum mengimpor file ke Vercel Blob.' })
      return
    }

    const item = kind === 'project' ? projects[index] : certificates[index]
    const sourceUrl = item?.sourceAssetUrl?.trim()

    if (!sourceUrl) {
      setNotice({ tone: 'error', text: 'Isi URL sumber file yang ingin Anda simpan ke Blob.' })
      return
    }

    const requestKey = `${kind}-${index}`
    setImportingKey(requestKey)
    setNotice(null)

    try {
      const response = await fetch('/api/portfolio/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken.trim(),
        },
        body: JSON.stringify({
          sourceUrl,
          folder: kind === 'project' ? 'projects' : 'certificates',
          filenameHint: item.filenameHint || item.title || kind,
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || 'Gagal memindahkan file ke Blob.')
      }

      if (kind === 'project') {
        updateProject(index, { image: payload.url, sourceAssetUrl: '', filenameHint: '' })
      } else {
        updateCertificate(index, { image: payload.url, sourceAssetUrl: '', filenameHint: '' })
      }

      setNotice({ tone: 'success', text: 'File berhasil disalin dari URL eksternal ke Vercel Blob.' })
    } catch (error) {
      console.error(error)
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Gagal memindahkan file ke Blob.' })
    } finally {
      setImportingKey('')
    }
  }

  async function savePortfolio() {
    if (!adminToken.trim()) {
      setNotice({ tone: 'error', text: 'Masukkan admin token untuk menyimpan perubahan.' })
      return
    }

    setSaving(true)
    setNotice(null)

    try {
      const response = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken.trim(),
        },
        body: JSON.stringify({
          projects: projects.map(serializeProject),
          certificates: certificates.map(serializeCertificate),
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.error || 'Gagal menyimpan portfolio.')
      }

      setProjects((payload.projects || []).map(hydrateProject))
      setCertificates((payload.certificates || []).map(hydrateCertificate))
      setUpdatedAt(payload.updatedAt || new Date().toISOString())
      setDirty(false)
      setNotice({ tone: 'success', text: 'Portfolio publik berhasil diperbarui dan metadata tersimpan di Vercel Blob.' })
    } catch (error) {
      console.error(error)
      setNotice({ tone: 'error', text: error instanceof Error ? error.message : 'Gagal menyimpan portfolio.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fbf8f3] text-stone-900">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_24px_80px_rgba(120,113,108,0.08)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                <Sparkles size={14} />
                Portfolio Control Room
              </div>
              <h1 className="text-4xl font-black tracking-tight text-stone-900 md:text-6xl">
                Simpan project dan certificate dengan desain yang sama seperti website publik
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">
                Panel ini dipakai untuk mengelola kartu project dan certificate, lalu menyimpan gambar atau PDF dari URL ke Vercel Blob sebelum tampil di website Anda.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end lg:min-w-[420px]">
              <Field label="Admin token" hint="Harus sama dengan environment PORTFOLIO_ADMIN_TOKEN di Vercel.">
                <input
                  type="password"
                  value={adminToken}
                  onChange={(event) => setAdminToken(event.target.value)}
                  className={textInputClass()}
                  placeholder="Masukkan admin token"
                />
              </Field>

              <button
                type="button"
                onClick={savePortfolio}
                disabled={saving || loading}
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-stone-900 px-6 text-sm font-semibold text-stone-50 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? <LoaderCircle size={18} className="animate-spin" /> : <Save size={18} />}
                Simpan perubahan
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-stone-600">
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
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-amber-700">— Projects</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">Kelola karya yang tampil di landing page</h2>
                </div>
                <button
                  type="button"
                  onClick={addProject}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:bg-white"
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
                      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-stone-500">{project.id}</p>
                          <h3 className="mt-2 text-xl font-semibold text-stone-900">Project #{index + 1}</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                        >
                          <Trash2 size={14} />
                          Hapus
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <Field label="Judul project">
                          <input value={project.title} onChange={(event) => updateProject(index, { title: event.target.value })} className={textInputClass()} />
                        </Field>
                        <Field label="Label kecil" hint="Akan tampil di bagian atas kartu, misalnya Client Project atau 7 hari.">
                          <input value={project.date} onChange={(event) => updateProject(index, { date: event.target.value })} className={textInputClass()} />
                        </Field>
                        <Field label="Link tujuan" hint="Demo live, GitHub, atau URL portfolio terkait.">
                          <input value={project.link} onChange={(event) => updateProject(index, { link: event.target.value })} className={textInputClass()} placeholder="https://..." />
                        </Field>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <Field label="URL gambar / preview">
                          <input value={project.image} onChange={(event) => updateProject(index, { image: event.target.value })} className={textInputClass()} placeholder="https://... atau URL Blob" />
                        </Field>
                        <Field label="URL sumber file" hint="Tempel URL gambar dari website lain, lalu klik Simpan ke Blob.">
                          <input value={project.sourceAssetUrl} onChange={(event) => updateProject(index, { sourceAssetUrl: event.target.value })} className={textInputClass()} placeholder="https://example.com/image.png" />
                        </Field>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                        <Field label="Nama file Blob" hint="Opsional, dipakai sebagai nama dasar file di Blob.">
                          <input value={project.filenameHint} onChange={(event) => updateProject(index, { filenameHint: event.target.value })} className={textInputClass()} placeholder="misal: eoffice-cover" />
                        </Field>
                        <button
                          type="button"
                          onClick={() => importAsset('project', index)}
                          disabled={isImporting}
                          className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-stone-900 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isImporting ? <LoaderCircle size={17} className="animate-spin" /> : <UploadCloud size={17} />}
                          Simpan ke Blob
                        </button>
                      </div>

                      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                        <Field label="Deskripsi">
                          <textarea value={project.description} onChange={(event) => updateProject(index, { description: event.target.value })} rows={5} className={textInputClass()} />
                        </Field>
                        <Field label="Tag project" hint="Satu item per baris atau pisahkan dengan koma.">
                          <textarea value={project.tags.join('\n')} onChange={(event) => updateProject(index, { tags: parseLines(event.target.value) })} rows={5} className={textInputClass()} />
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
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-amber-700">— Certificates</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">Tambahkan file sertifikat ke portfolio</h2>
                </div>
                <button
                  type="button"
                  onClick={addCertificate}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:bg-white"
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
                      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-stone-500">{certificate.id}</p>
                          <h3 className="mt-2 text-xl font-semibold text-stone-900">Certificate #{index + 1}</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCertificate(index)}
                          className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                        >
                          <Trash2 size={14} />
                          Hapus
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <Field label="Judul certificate">
                          <input value={certificate.title} onChange={(event) => updateCertificate(index, { title: event.target.value })} className={textInputClass()} />
                        </Field>
                        <Field label="Issuer">
                          <input value={certificate.issuer} onChange={(event) => updateCertificate(index, { issuer: event.target.value })} className={textInputClass()} />
                        </Field>
                        <Field label="Tanggal / tahun">
                          <input value={certificate.date} onChange={(event) => updateCertificate(index, { date: event.target.value })} className={textInputClass()} placeholder="2026" />
                        </Field>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <Field label="URL file certificate" hint="Bisa PDF atau gambar. Link ini dipakai di website publik.">
                          <input value={certificate.image} onChange={(event) => updateCertificate(index, { image: event.target.value })} className={textInputClass()} placeholder="https://... atau URL Blob" />
                        </Field>
                        <Field label="URL sumber file" hint="Tempel URL PDF atau gambar lalu klik Simpan ke Blob.">
                          <input value={certificate.sourceAssetUrl} onChange={(event) => updateCertificate(index, { sourceAssetUrl: event.target.value })} className={textInputClass()} placeholder="https://example.com/certificate.pdf" />
                        </Field>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                        <Field label="Nama file Blob" hint="Opsional, dipakai sebagai nama dasar file di Blob.">
                          <input value={certificate.filenameHint} onChange={(event) => updateCertificate(index, { filenameHint: event.target.value })} className={textInputClass()} placeholder="misal: nextjs-dashboard-certificate" />
                        </Field>
                        <button
                          type="button"
                          onClick={() => importAsset('certificate', index)}
                          disabled={isImporting}
                          className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-stone-900 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isImporting ? <LoaderCircle size={17} className="animate-spin" /> : <UploadCloud size={17} />}
                          Simpan ke Blob
                        </button>
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
              <p className="mt-2">Set salah satu kredensial Blob yang didukung Vercel, yaitu `BLOB_READ_WRITE_TOKEN` atau koneksi store via OIDC, lalu tambahkan `PORTFOLIO_ADMIN_TOKEN` untuk mengamankan write API.</p>
              <p className="mt-2">Website publik tetap memakai fallback data lokal, jadi halaman tidak langsung kosong walau Blob belum terhubung.</p>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}