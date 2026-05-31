
# Rifki Portfolio

Portfolio publik ini memakai desain baru sebagai acuan visual, tetapi kontennya mengambil data portfolio Rifki dan dapat disimpan ke Vercel Blob.

## Fitur utama

- Landing page publik dibangun dari `src/main.tsx` dan membaca project/certificate dari `/api/portfolio`.
- Halaman admin tersedia di `/admin/` untuk menambah project, menambah certificate, dan menyalin gambar/PDF dari URL eksternal ke Vercel Blob.
- Website publik tetap punya fallback data lokal bila Blob atau API belum aktif.

## Menjalankan lokal

1. Jalankan `npm install`
2. Jalankan `npm run dev`

## Environment Vercel

Set salah satu kredensial Blob yang didukung Vercel:

- `BLOB_READ_WRITE_TOKEN`
- atau pasangan `BLOB_STORE_ID` + `VERCEL_OIDC_TOKEN`

Lalu tambahkan:

- `PORTFOLIO_ADMIN_TOKEN`

`PORTFOLIO_ADMIN_TOKEN` dipakai oleh `/admin/` untuk mengizinkan write ke `/api/portfolio` dan `/api/portfolio/media`.
  