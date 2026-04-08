# E-Office — Sistem Arsip Surat Digital

> Aplikasi manajemen surat dan arsip digital untuk Dinas Pendidikan Kabupaten Bandung Barat. Dibangun menggunakan **Laravel 12**, mendukung pengelolaan surat masuk, surat keluar, disposisi, agenda kegiatan, pemberkasan, dan download arsip secara digital.

---

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| **Backend** | Laravel 12 (PHP 8.2+) |
| **Database** | MySQL (via XAMPP) |
| **Frontend** | Blade Template + Bootstrap + Chart.js |
| **PDF** | FPDF + FPDI |
| **Auth** | Laravel Auth + Role-based Middleware |

---

## Fitur Utama

### Autentikasi & Otorisasi
- Login dengan username/password
- 5 level role: **Super Admin**, **Kepala Dinas**, **Sekretaris**, **Kabag**, **Operator**
- Middleware role-based access control
- Pelacakan last login

### Manajemen Surat Masuk
- CRUD surat masuk dengan nomor surat, pengirim, perihal, tanggal
- 4 tingkat sifat: Biasa, Penting, Segera, Rahasia
- Status tracking: Baru → Disposisi → Selesai
- Upload scan surat (PDF/JPG/PNG)
- Multi lampiran per surat
- Export data ke PDF/Excel/CSV

### Manajemen Surat Keluar
- CRUD surat keluar dengan tujuan, perihal, isi surat
- Status: Draft → Terkirim → Final
- Upload file surat
- Multi lampiran
- Export data

### Disposisi Surat
- Routing surat masuk ke pejabat terkait
- Tracking dari/kepada/catatan
- Status: Diteruskan → Dilaksanakan → Selesai

### Agenda Kegiatan
- Penjadwalan kegiatan dengan tanggal, waktu, tempat
- Status: Terjadwal, Akan Datang, Selesai
- Penanggung jawab kegiatan

### Pemberkasan (Document Filing)
- Pengelompokan surat ke dalam berkas dengan kode unik
- Klasifikasi berdasarkan tahun
- Relasi many-to-many antara surat masuk/keluar dengan berkas

### Dashboard Analytics
- Statistik total surat masuk, keluar, draft, disposisi, sampah
- Grafik tren surat 6 bulan terakhir (Chart.js)
- Diagram pie kategori surat
- Feed surat terbaru
- Quick action buttons

### Download Arsip
- Export surat ke format PDF, Excel, CSV
- Filter berdasarkan rentang tanggal
- Filter jenis: Masuk / Keluar / Semua
- Audit log setiap download

### Sampah (Trash)
- Soft delete dengan fitur restore
- Hapus permanen
- Kosongkan semua sampah

### Template Surat
- Template siap pakai: Surat Dinas, Keputusan, Perintah, Edaran, Undangan
- Upload/download template
- CRUD template

### Profil Dinas & Cetak
- Pengaturan nama dinas, alamat, telepon, email, website
- Upload logo
- Profil cetak (print-ready)
- Kode instansi

### Manajemen User (Admin)
- CRUD user
- Reset password
- Aktivasi/Nonaktifkan akun
- Ubah profil & password sendiri

### Manual Book
- Panduan penggunaan aplikasi built-in

---

## Database Schema

```
13 Tabel:
├── users              → Pengguna sistem (soft delete)
├── surat_masuk        → Surat masuk (soft delete)
├── surat_keluar       → Surat keluar (soft delete)
├── disposisi          → Routing/disposisi surat
├── agenda_kegiatan    → Jadwal kegiatan
├── pemberkasan        → Berkas/filing
├── pemberkasan_surat  → Pivot surat ↔ berkas (many-to-many)
├── template_surat     → Template surat
├── profil_dinas       → Profil instansi
├── download_logs      → Log download arsip
├── lampiran_surat     → Lampiran file (polymorphic)
├── cache              → Laravel cache
└── jobs               → Laravel queue
```

---

## Model & Relasi

```
User
├── hasMany → SuratMasuk, SuratKeluar, Disposisi

SuratMasuk (SoftDeletes)
├── belongsTo → User (creator)
├── hasMany   → Disposisi, LampiranSurat

SuratKeluar (SoftDeletes)
├── belongsTo → User (creator)
├── hasMany   → LampiranSurat

Disposisi
├── belongsTo → SuratMasuk, User

Pemberkasan
├── belongsTo     → User (creator)
├── belongsToMany → SuratMasuk, SuratKeluar (via pemberkasan_surat)

AgendaKegiatan, TemplateSurat
├── belongsTo → User (creator)
```

---

## Struktur File

```
e-office-laravel/
├── 13 migration files
├── 1 database seeder
├── 10 Eloquent models
├── 14 controllers
├── 1 middleware (CheckRole)
├── 1 helper (PdfSplitter)
├── 18+ Blade views
├── 31 routes
└── Custom CSS styling
```

---

## Halaman Aplikasi

| No | Halaman | Deskripsi |
|----|---------|-----------|
| 1 | Login | Halaman autentikasi |
| 2 | Dashboard | Overview statistik & chart |
| 3 | Surat Masuk | CRUD surat masuk + export |
| 4 | Surat Keluar | CRUD surat keluar + export |
| 5 | Detail Surat | Detail lengkap surat + lampiran |
| 6 | Disposisi | Form & tracking disposisi |
| 7 | Draft Final | Gabungan surat selesai & final |
| 8 | Agenda Kegiatan | CRUD jadwal kegiatan |
| 9 | Pemberkasan | Pengelompokan surat ke berkas |
| 10 | Sampah | Trash + restore/hapus permanen |
| 11 | Download Arsip | Export PDF/Excel/CSV |
| 12 | Template Surat | Kelola template surat |
| 13 | Profil Dinas | Setting profil instansi |
| 14 | Profil Cetak | Profil untuk pencetakan |
| 15 | Set User | Manajemen user (admin) |
| 16 | Profil Akun | Edit profil pribadi |
| 17 | Manual Book | Panduan penggunaan |

---

## Akun Default

| Role | Username | Password |
|------|----------|----------|
| Super Admin | admin | admin123 |
| Kepala Dinas | kadis | kadis123 |
| Sekretaris | sekretaris | sekretaris123 |
| Operator | operator1 | operator123 |

---

## Screenshot

![Dashboard E-Office](screenshot-dashboard.png)

---

## Cara Menjalankan

```bash
# 1. Clone/extract project
# 2. Pastikan XAMPP (Apache + MySQL) sudah jalan

# 3. Setup (1x pertama)
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link

# 4. Jalankan
php artisan serve --port=8000

# 5. Buka http://127.0.0.1:8000
```
