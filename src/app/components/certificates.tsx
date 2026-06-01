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

function buildPdfPreviewUrl(value: string) {
  const text = normalizeCertificateUrl(value);

  if (!text) {
    return "";
  }

  const previewParams = "page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0";
  return `${text}${text.includes("#") ? "&" : "#"}${previewParams}`;
}

function PdfPreviewFallback({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-100 via-white to-stone-50 text-stone-700">
      <div className="px-6 text-center">
        <FileText className="mx-auto h-10 w-10 text-amber-700" />
        <div className="mt-3 text-sm font-medium">{label}</div>
      </div>
    </div>
  );
}

function CertificateMedia({
  certificateUrl,
  title,
  previewLabel,
  onOpen,
}: {
  certificateUrl: string;
  title: string;
  previewLabel: string;
  onOpen: () => void;
}) {
  if (isDocumentUrl(certificateUrl)) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-white text-left"
      >
        <object
          data={buildPdfPreviewUrl(certificateUrl)}
          type="application/pdf"
          aria-label={`Preview ${title}`}
          className="pointer-events-none h-full w-full bg-white"
        >
          <PdfPreviewFallback label={previewLabel} />
        </object>
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex">
          <span className="rounded-full border border-stone-200/80 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 shadow-sm backdrop-blur">
            PDF Preview
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className="block w-full aspect-[4/3] overflow-hidden bg-stone-100"
    >
      <ImageWithFallback
        src={certificateUrl}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </button>
  );
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
    <section id="certificates" className="bg-[#fbf8f3] py-16 sm:py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-10 sm:mb-14">
          <div>
            <div className="mb-2 text-xs uppercase tracking-widest text-amber-700 sm:mb-3 sm:text-sm">{siteContent.certificates.eyebrow}</div>
            <h2 className="max-w-2xl text-3xl tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
              {siteContent.certificates.title}
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {items.map((c) => {
            const certificateUrl = normalizeCertificateUrl(c.image);

            return (
            <div
              key={c.id}
              className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:shadow-lg"
            >
              {certificateUrl ? (
                <CertificateMedia
                  certificateUrl={certificateUrl}
                  title={c.title}
                  previewLabel={siteContent.certificates.previewLabel}
                  onOpen={() => setPreview(c)}
                />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-stone-100 via-white to-stone-50 px-6 text-center text-stone-500">
                  <div>
                    <FileText className="mx-auto h-10 w-10 text-stone-400" />
                    <div className="mt-3 text-sm font-medium text-stone-700">File sertifikat belum diupload</div>
                    <div className="mt-1 text-xs">Tambahkan file dari panel admin agar link publik aktif.</div>
                  </div>
                </div>
              )}
              <div className="p-4 sm:p-5">
                <div className="mb-2 flex items-center gap-2 text-[11px] text-amber-700 sm:text-xs">
                  <Award className="w-3.5 h-3.5" /> {c.issuer} · {c.date}
                </div>
                <div className="text-sm text-stone-900 sm:text-base">{c.title}</div>
                {c.credential ? <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-stone-500 sm:text-xs">{c.credential}</div> : null}
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
                {isDocumentUrl(normalizeCertificateUrl(preview.image)) ? (
                  <object
                    data={buildPdfPreviewUrl(normalizeCertificateUrl(preview.image))}
                    type="application/pdf"
                    aria-label={`Preview ${preview.title}`}
                    className="h-[75vh] w-full bg-white"
                  >
                    <PdfPreviewFallback label={siteContent.certificates.previewLabel} />
                  </object>
                ) : (
                  <ImageWithFallback src={normalizeCertificateUrl(preview.image)} alt={preview.title} className="w-full h-auto" />
                )}
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
