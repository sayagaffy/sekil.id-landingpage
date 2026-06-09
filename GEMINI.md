# Sekil.id Landing Page — Panduan Spesifik Agen Gemini

Dokumen ini berisi pedoman kualitas kode, arsitektur frontend, dan standar interaksi AI agen untuk repositori **Sekil.id Landing Page**.

---

## 🤖 Bahasa & Komunikasi Agen
- **Komunikasi Pengguna:** Anda **WAJIB menggunakan Bahasa Indonesia** secara santun, terstruktur, dan ringkas dalam menjawab setiap pertanyaan atau laporan tugas.
- **Komentar & Kode Program:** Penamaan variabel, fungsi, component props, log, komentar inline, serta tipe data wajib ditulis dalam **Bahasa Inggris** sesuai standar industri.
- **Konfirmasi Penyelesaian:** Dilarang keras menyatakan tugas atau `/goal` selesai secara sepihak (atau menyematkan penanda `<!-- GOAL_COMPLETE -->`) sebelum mendapatkan perintah atau konfirmasi eksplisit dari pengguna.

---

## 📂 Gambaran Teknis Proyek
- **Framework:** Next.js 14 App Router + React 18+
- **Styling:** Tailwind CSS & CSS Variables (untuk tenant theming dinamis)
- **Content:** MDX (Markdown dengan JSX) untuk blog/guide.
- **Hosting:** Vercel

---

## ⚖️ Pola Arsitektur & Konvensi Mutlak (Non-Negotiable)

### 1. Server Components by Default
- **Aturan:** Gunakan Server Components secara default untuk semua halaman dan layout.
- **Client Components:** Deklarasikan direktif `'use client'` hanya pada komponen yang membutuhkan interactivity (seperti form, button dengan state).

### 2. Disiplin TypeScript & Zero 'any'
- **Zero any:** Penggunaan keyword `any` dilarang total di seluruh codebase. Gunakan `unknown` dan penyempitan tipe data (*type narrowing*), atau tulis definisi *union type* yang spesifik.
- **Strict Mode:** Kode harus lulus pemeriksaan type-checking bawaan TypeScript tanpa bypass.

### 3. Styling dengan Design Tokens
- Gunakan utilitas Tailwind CSS.
- Nilai kustom diambil dari CSS variables di `src/styles/globals.css` yang berbasis pada design tokens di `design/design-tokens.json` (single source of truth).
- **Larangan Keras:** Dilarang keras menulis warna hex atau pixel secara hardcode pada komponen.

### 4. SEO & Aksesibilitas (a11y)
- Setiap halaman wajib memuat: title, description, canonical, dan JSON-LD schema (generator skema ada di `src/lib/seo/`).
- Gunakan Next.js Metadata API (`export const metadata`).
- Kepatuhan WCAG AA: HTML semantik, label pada kontrol form, keyboard navigable, dan alt text deskriptif untuk gambar.
- **Skor Lighthouse:** Seluruh halaman wajib dioptimalkan untuk memegang skor minimal **90** pada performa, aksesibilitas, best practices, dan SEO Google Lighthouse.

### 5. Optimasi Media & Layout Shift
- **Aturan:** Dilarang keras menggunakan tag `<img>` standar. Gunakan Next.js `<Image>` dengan props `width`, `height`, dan `placeholder="blur"` (atau `priority` jika berada di above-the-fold) untuk mencegah Cumulative Layout Shift (CLS).

### 6. Dokumentasi ADR (Architecture Decision Record)
- **Aturan:** Setiap modifikasi arsitektur utama atau penambahan package baru wajib didokumentasikan dalam file ADR baru di bawah folder `docs/adr/` sebelum implementasi kode dimulai.

---

## 🚫 Larangan Keras (Forbidden)
1. Menulis warna hex / ukuran px secara hardcoded (gunakan design tokens).
2. Tipe data `any`.
3. Menulis inline event handler tanpa deklarasi client component.
4. Menggunakan berkas CSS eksternal selain `globals.css` dan `themes.css`.
5. Tag `<img>` standar (wajib menggunakan `Image` dari `next/image`).
6. Tag `<a>` standar untuk internal link (wajib menggunakan `Link` dari `next/link`).
7. Menulis teks UI statis secara hardcoded tanpa sistem lokalisasi i18n (jika i18n diaktifkan).

---

## 🛠️ Langkah Pengoperasian & Verifikasi Lokal
Sebelum menyelesaikan tugas pemrograman di repositori ini, pastikan Anda telah menjalankan perintah-perintah berikut dan hasilnya bebas dari kesalahan:

```bash
# 1. Jalankan server dev lokal
npm run dev

# 2. Jalankan pemeriksaan tipe TypeScript
npm run type-check

# 3. Jalankan linter dan format kode
npm run lint

# 4. Jalankan build produksi lokal
npm run build
```

*Seluruh penulisan kasus uji otomatis wajib merujuk pada standar dan metodologi yang ditetapkan di [Automated Tester Playbook](file:///home/pahlawanto/Project/PT. Dart Prihaditama Studio/sekil.id-docs/22_Tester_Playbook_v1.0.md).*
*Pastikan build berhasil lulus 100% sebelum mengajukan Pull Request.*

---

## 🔄 Protokol Git & Siklus Kerja Pengembangan

Untuk menjaga stabilitas repositori tingkat enterprise dan mendukung kolaborasi yang terorganisir, agen Gemini **WAJIB** mengikuti alur kerja Git berikut untuk setiap tugas pemrograman sesuai standar [GitOps & Release Management Playbook](file:///home/pahlawanto/Project/PT. Dart Prihaditama Studio/sekil.id-docs/27_GitOps_Release_Playbook_v1.0.md):

### 1. Persiapan Pekerjaan (Pemeriksaan Uncommitted Changes)
Sebelum melakukan pekerjaan baru, jalankan `git status`. Jika terdapat perubahan yang belum di-commit dari pekerjaan sebelumnya:
* Agen **TIDAK BOLEH** langsung menimpa atau membuang perubahan tersebut secara diam-diam.
* Agen **WAJIB** memberikan analisis singkat mengenai file apa saja yang berubah dan memberikan opsi rekomendasi tindakan berikut kepada pengguna:
  1. Melakukan penyimpanan sementara menggunakan `git stash` (`git stash -u`).
  2. Melakukan commit perubahan tersebut ke branch cadangan sementara.
  3. Membuang (*discard*) perubahan jika dikonfirmasi oleh pengguna bahwa perubahan tersebut adalah noise/sampah (`git restore .` atau `git clean -fd`).

### 2. Pembuatan Branch Baru
* Setiap tugas atau fitur baru **wajib** dikerjakan di branch baru yang dicabangkan dari branch `main` terbaru.
* Pastikan Anda memperbarui branch `main` lokal Anda terlebih dahulu sebelum mencabangkan:
  ```bash
  git checkout main
  git pull origin main
  ```
* Buat branch baru dari `main` dengan format penamaan standar:
  * Fitur baru: `feat/<nama-fitur>` (contoh: `feat/login-magic-link`)
  * Perbaikan bug: `fix/<nama-fitur>` (contoh: `fix/refresh-token-leak`)
  * Jalankan perintah pembuatan branch:
    ```bash
    git checkout -b <nama-branch>
    ```

### 3. Pengerjaan & Pengujian Ketat (Zero-Regression)
* Kerjakan tugas Anda sepenuhnya di dalam branch baru tersebut.
* Pastikan aplikasi berjalan normal dan perubahan yang dilakukan tidak merusak fitur yang sudah ada (*zero-regression*).
* Sebelum melakukan push ke GitHub, membuat Issue, atau membuat Pull Request (PR), kode dan seluruh perubahan **WAJIB lolos verifikasi kepatuhan terhadap 10 pilar playbook** yang dideklarasikan di dalam [GEMINI.md (Root)](file:///home/pahlawanto/Project/PT. Dart Prihaditama Studio/GEMINI.md) serta verifikasi lokal 100%:
  * Menjalankan pemeriksaan tipe TypeScript (`npm run type-check`).
  * Menjalankan static code analysis (linter) dan pemformat kode (`npm run lint`).
  * Menjalankan kompilasi build lokal (`npm run build`) untuk memastikan tidak ada kesalahan kompilasi.

### 4. Otomatisasi Publikasi (Issue & Pull Request via GitHub CLI)
Setelah pengujian lokal berhasil dengan sukses:
1. Dorong branch baru Anda ke remote repository:
   ```bash
   git push origin <nama-branch>
   ```
2. Buat Issue baru di GitHub secara otomatis menggunakan GitHub CLI (`gh`):
   ```bash
   gh issue create --title "feat/fix: <judul-tugas>" --body "Deskripsi tugas dan apa yang dicapai."
   ```
3. Buat Pull Request (PR) otomatis ke branch `main` agar pengguna dapat melakukan tinjauan manual melalui GitHub:
   ```bash
   gh pr create --title "feat/fix: <judul-tugas>" --body "Mengatasi Issue #<nomor-issue>. Detail perubahan dan hasil pengujian."
   ```

### 5. Penjelasan & Rekomendasi Serah Terima
Setelah Pull Request berhasil dibuat, berikan penjelasan terperinci kepada pengguna mengenai:
* **Masalah/Fitur:** Detail apa yang dikerjakan.
* **Solusi:** Pendekatan teknis dan arsitektur yang Anda terapkan.
* **Rekomendasi Tambahan:** Saran tindak lanjut atau saran peningkatan kualitas kode untuk masa mendatang.

