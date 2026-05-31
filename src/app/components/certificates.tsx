import { useState } from "react";
import { Award, ExternalLink, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Certificate, SiteContent } from "./portfolio-store";

function isDocumentUrl(value: string) {
  return /\.pdf($|[?#])/i.test(value);
}

function normalizeCertificateUrl(value?: string | null) {
  const text = String(value || "").trim();
  return text && text !== "#" ? text : "";
}

export function Certificates({
  items,
  siteContent,
}: {
  items: Certificate[];
  siteContent: SiteContent;
}) {
  const [preview, setPreview] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="bg-[#fbf8f3] py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <div>
            <div className="text-sm text-amber-700 uppercase tracking-widest mb-3">{siteContent.certificates.eyebrow}</div>
            <h2 className="text-stone-900 tracking-tight text-4xl md:text-5xl max-w-2xl">
              {siteContent.certificates.title}
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((c) => {
            const certificateUrl = normalizeCertificateUrl(c.image);

            return (
            <div
              key={c.id}
              className="group relative bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg transition"
            >
              {certificateUrl && !isDocumentUrl(certificateUrl) ? (
                <button
                  onClick={() => setPreview(c)}
                  className="block w-full aspect-[4/3] overflow-hidden bg-stone-100"
                >
                  <ImageWithFallback
                    src={certificateUrl}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </button>
              ) : certificateUrl ? (
                <a
                  href={certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-stone-100 via-white to-stone-50 text-stone-700 no-underline"
                >
                  <div className="text-center">
                    <FileText className="mx-auto h-10 w-10 text-amber-700" />
                    <div className="mt-3 text-sm font-medium">{siteContent.certificates.previewLabel}</div>
                  </div>
                </a>
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-stone-100 via-white to-stone-50 px-6 text-center text-stone-500">
                  <div>
                    <FileText className="mx-auto h-10 w-10 text-stone-400" />
                    <div className="mt-3 text-sm font-medium text-stone-700">File sertifikat belum diupload</div>
                    <div className="mt-1 text-xs">Tambahkan file dari panel admin agar link publik aktif.</div>
                  </div>
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 text-amber-700 text-xs mb-2">
                  <Award className="w-3.5 h-3.5" /> {c.issuer} · {c.date}
                </div>
                <div className="text-stone-900">{c.title}</div>
                {c.credential ? <div className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-500">{c.credential}</div> : null}
                {certificateUrl ? (
                  <a href={certificateUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-stone-600 no-underline hover:text-stone-900">
                    <ExternalLink className="h-4 w-4" />
                    {siteContent.certificates.openLabel}
                  </a>
                ) : null}
              </div>
            </div>
          )})}
        </div>

        <Dialog open={!!preview} onOpenChange={(v) => !v && setPreview(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{preview?.title}</DialogTitle>
            </DialogHeader>
            {preview && (
              <div className="rounded-xl overflow-hidden bg-stone-100">
                <ImageWithFallback src={normalizeCertificateUrl(preview.image)} alt={preview.title} className="w-full h-auto" />
              </div>
            )}
            {preview && (
              <div className="text-sm text-stone-600">
                {preview.issuer} · {preview.date}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
