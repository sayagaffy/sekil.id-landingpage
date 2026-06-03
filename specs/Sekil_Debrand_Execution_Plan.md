# Sekil.id — Rencana Eksekusi De-brand Metode & Anti-Gaming

Tujuan: menghilangkan eksposur nama instrumen (MBTI / Holland Code / Papi Kostick) di
permukaan yang memungkinkan kecurangan, **tanpa** merobohkan kredibilitas E-E-A-T dan
**tanpa** menabrak strategi SEO secara serampangan.

Prinsip yang dipegang sepanjang rencana:
- Publik jual **produk + outcome**; nama **instrumen** = engine internal.
- Anti-faking sebenarnya diselesaikan di **engine** (de-brand hasil + retake lock), bukan di copy.
- Jangan hapus halaman terindeks tanpa strategi redirect/noindex — itu membuang authority.
- Jangan klaim yang belum bisa dipertahankan (akurasi %, validasi yang belum formal).

Catatan repo:
- **REPO-LANDING** = `sekil.id-landingpage` (Next.js marketing site)
- **REPO-APP** = `app.sekil.id` (portal asesmen: tes, scoring, report, retake)

Cara pakai: buka Claude Code di repo yang sesuai, tempel prompt fase tersebut. Prompt ditulis
agar Claude Code **mencari sendiri** file yang relevan (struktur live berbeda dari dokumen spec,
jadi jangan hardcode path).

---

## FASE 0 — Risk Patch (REPO-LANDING) — prioritas: SEKARANG

Tiga perubahan string kecil yang menutup kebocoran terburuk + dua liabilitas kredibilitas.
Independen dan reversible. Kerjakan ini dulu apa pun yang terjadi dengan fase lain.

### Prompt 0A — Hapus kode tipe MBTI dari hero widget

```
Di homepage ada komponen "demo card" / hero widget yang menampilkan contoh hasil asesmen,
saat ini berbunyi kira-kira: "Andika · INTJ-A" dan "STRATEGIST · 87 / 100".

Tugas:
1. Temukan komponen yang merender kartu sampel hasil di hero homepage.
2. Hapus kode tipe MBTI ("INTJ-A" dan format 4-huruf serupa). Ganti dengan label arketipe
   milik Sekil yang TIDAK memetakan 1:1 ke MBTI. Untuk sekarang gunакан: "Sang Strategis".
   Jadi: "Andika · Sang Strategis" dan "87 / 100".
3. Pastikan tidak ada string tipe MBTI 4-huruf lain (INTJ, ISTJ, ENFP, dst.) yang tersisa
   di komponen hero atau data dummy-nya.
4. Jangan ubah angka skor atau layout lain.

Acceptance: grep repo untuk pola /[EI][NS][TF][JP](-[AT])?/ di komponen marketing →
tidak ada match di halaman publik.
```

### Prompt 0B — Hapus klaim "Akurasi 94%"

```
Di homepage ada blok statistik "DALAM ANGKA" yang memuat "Akurasi PsyAI · 94%".

Konteks: "akurasi %" bukan metrik psikometri yang sah untuk asesmen kepribadian dan
bertentangan dengan halaman metodologi kita sendiri yang jujur soal keterbatasan reliabilitas.

Tugas:
1. Temukan blok statistik tersebut.
2. Hapus item "Akurasi 94%". Ganti dengan metrik yang netral dan bisa dipertahankan, mis.
   "Dimensi diukur · 18" ATAU hapus slotnya. JANGAN ganti dengan klaim akurasi/validitas
   numerik lain.
3. Sisakan stat lain (jumlah siswa, sekolah, durasi) apa adanya.

Acceptance: tidak ada string "akura" atau "%" yang mengklaim ketepatan hasil di halaman publik.
```

### Prompt 0C — Selaraskan klaim UNJANI dengan status sebenarnya

> [BUTUH INPUT] — beri tahu saya status MoU UNJANI sebenarnya sebelum menjalankan ini.
> Halaman metodologi sendiri menyebut nama dosen masih placeholder & "akan diperbarui setelah
> penandatanganan MoU formal". Sampai status itu jelas, JANGAN tayangkan "divalidasi UNJANI"
> sebagai klaim selesai. Pilih salah satu framing yang BENAR:
> - (a) MoU sudah diteken → boleh "divalidasi oleh Fakultas Psikologi UNJANI" + nama asli.
> - (b) MoU dalam proses → "dikembangkan bersama tim akademik dalam proses kolaborasi dengan
>   Fakultas Psikologi UNJANI" (hindari kata "tervalidasi/divalidasi" sampai final).
> - (c) Belum ada kesepakatan formal → hapus klaim UNJANI dari halaman publik sampai ada.

```
[Setelah status dikonfirmasi] Audit seluruh repo untuk klaim "UNJANI", "divalidasi akademik",
"2.000+ responden", dan klaim validasi sejenis di halaman publik (homepage, metodologi, produk,
footer, meta description, JSON-LD). Selaraskan semua ke framing: [(a)/(b)/(c) sesuai konfirmasi].
Pastikan konsisten di teks visible DAN di structured data (schema.org).
```

### Prompt 0D — Bersihkan meta-keyword (minor)

```
Di metadata global, hapus "MBTI Indonesia" dari meta-keywords (dan token nama-instrumen lain
di meta-keywords). Ini selaras dengan keputusan tidak menjual lewat nama instrumen.
Catatan: meta-keywords diabaikan Google; ini sekadar konsistensi, prioritas rendah.
```

---

## FASE 1 — De-brand Layer Hasil (REPO-APP) — prioritas: TINGGI (inti anti-gaming)

Ini menutup pipeline kecurangan yang sebenarnya: user lihat tipe MBTI di report →
Google → retake dengan target.

### Keputusan desain dulu: sistem arketipe pengganti

> [BUTUH SIGN-OFF, default disediakan] Pengganti kode tipe di report. Default 16-arketipe
> (pemetaan internal MBTI→arketipe, TIDAK diekspos ke user):

| MBTI | Arketipe Sekil (default — boleh diganti) |
|---|---|
| INTJ | Sang Strategis |
| INTP | Sang Penganalisis |
| ENTJ | Sang Komandan |
| ENTP | Sang Penjelajah Ide |
| INFJ | Sang Penasihat |
| INFP | Sang Idealis |
| ENFJ | Sang Mentor |
| ENFP | Sang Penggerak |
| ISTJ | Sang Pengelola |
| ISFJ | Sang Penjaga |
| ESTJ | Sang Pengatur |
| ESFJ | Sang Penghubung |
| ISTP | Sang Pemecah Masalah |
| ISFP | Sang Pengkarya |
| ESTP | Sang Pelaku |
| ESFP | Sang Penyemangat |

Holland code → JANGAN tampilkan 3-huruf (CSI/RIA). Tampilkan narasi dominasi minat
("Anda paling condong ke minat investigatif dan sosial...").

### Prompt 1A — De-brand template report

```
Sistem ini menghasilkan laporan hasil asesmen (PDF dan/atau web) yang saat ini mencetak nama
instrumen dan kode tipe secara eksplisit, contoh: "Hasil Tes Kepribadian MBTI", "Tipe
Kepribadian: ISTJ", "Holland Code: CSI", "PAPI Kostick", dan persentase per dimensi
(mis. "Introvert (I): 73%").

Tujuan: laporan tetap kaya insight TAPI tidak mengekspos nama instrumen atau kode tipe yang
bisa di-google untuk mengakali tes.

Tugas:
1. Temukan semua template/generator report dan prompt narrative generation.
2. Ganti penyebutan instrumen dan kode:
   - Hapus heading/label "MBTI", "Holland Code", "PAPI Kostick" dari OUTPUT user-facing.
     (Boleh tetap ada di field internal/DB & dokumen B2B, tapi tidak di report yang dilihat peserta.)
   - Ganti kode tipe 4-huruf dengan arketipe (lihat tabel pemetaan yang akan saya sediakan
     sebagai data internal — minta saya kalau belum ada).
   - Ganti kode Holland 3-huruf dengan narasi dominasi minat.
   - Ganti tabel persentase dimensi mentah dengan deskripsi naratif kecenderungan.
     (Jika tetap mau bar/grafik, beri label fungsi-natural, bukan "E/I, S/N", mis.
      "Sumber energi", "Cara mengambil keputusan".)
3. Pertahankan disclaimer non-diagnostik yang sudah ada.
4. Jangan ubah logika scoring di belakang — hanya layer presentasi.

Acceptance: render satu report sampel untuk tiap arketipe → tidak ada string "MBTI",
"Holland", "PAPI", tidak ada kode 4-huruf/3-huruf, di output user-facing.
```

---

## FASE 2 — Retake Lock (REPO-APP) — prioritas: TINGGI (inti anti-gaming)

Lever anti-gaming terkuat. Referensi: dokumen `System_Access_Lock_Architecture` di project.

### Prompt 2A — Audit & perketat kebijakan retake

```
Cek mekanisme retake/akses ulang asesmen saat ini.

Tujuan: mencegah peserta mengulang asesmen setelah melihat hasil (yang memungkinkan
re-game). Acuan arsitektur: dokumen System_Access_Lock_Architecture.

Tugas:
1. Petakan alur saat ini: setelah sesi selesai & report dibuka, apakah peserta bisa retake?
   Dengan kredit yang sama atau harus beli lagi? Apakah ada lock di level sesi/entitlement?
2. Tegakkan aturan: satu entitlement/pembayaran = satu sesi terkunci. Setelah submit final,
   sesi tidak bisa diulang dengan kredit yang sama.
3. Kalau institusi (B2B) perlu izin retake terbatas, buat itu sebagai aksi eksplisit admin
   tenant (bukan default peserta).
4. Tambahkan/aktifkan flag integritas yang sudah ada di schema (response_time_ms,
   consistency_pairs, validity_threshold) ke ringkasan internal — bukan ke report peserta.

Acceptance: peserta yang sudah submit & lihat report tidak bisa memulai sesi baru tanpa
entitlement baru / izin admin. Tertest dengan integration test.
```

---

## FASE 3 — Restruktur Metodologi + Pivot SEO (REPO-LANDING) — prioritas: SEDANG

Sensitif SEO. Halaman `/metodologi` sekarang ranking-friendly untuk "MBTI"/"Holland Code"
DAN jadi anchor E-E-A-T. Jangan dibuang — pisahkan publik vs buyer.

### Prompt 3A — Versi publik /metodologi: de-brand ke deskripsi-by-fungsi

```
Halaman /metodologi saat ini menamai instrumen secara eksplisit (Holland Code, MBTI-style,
Papi Kostick) di title, heading, dimensi, dan sitasi.

Tujuan: versi publik tetap membangun kepercayaan (E-E-A-T, YMYL) TAPI berhenti memakai nama
instrumen sebagai sinyal yang mengundang reverse-search.

Tugas:
1. De-brand di halaman publik:
   - Holland Code → "kerangka minat vokasional enam-dimensi"
   - MBTI-style → "kerangka preferensi kepribadian berbasis teori tipe psikologis Jung"
   - Papi Kostick → "inventori kebutuhan & peran kerja"
   - Title/meta: ganti "Metodologi Asesmen: Holland Code, MBTI, Papi Kostick" → tanpa nama
     instrumen (mis. "Metodologi Asesmen: Instrumen Psikologi Tervalidasi | Sekil.id").
2. PERTAHANKAN: bagian keterbatasan jujur, peran AI-vs-manusia, disclaimer, dan struktur
   kredibilitas. Itu aset E-E-A-T.
3. JANGAN hapus URL /metodologi (sudah terindeks). De-brand in-place. Update dateModified.
4. Update JSON-LD agar konsisten (hapus nama instrumen dari schema bila ada).
5. Sitasi akademik penuh (Holland 1997, Myers 1995, dst.) DIPINDAH ke halaman buyer (lihat 3B),
   bukan dihapus.

Acceptance: /metodologi publik tidak memuat string "MBTI", "Holland Code", "Papi Kostick",
tapi tetap punya narasi kredibilitas + keterbatasan + disclaimer.
```

### Prompt 3B — Halaman buyer ter-gate untuk detail instrumen lengkap

```
Buat halaman detail metodologi lengkap untuk audiens B2B (sekolah/kampus/HR) yang JUSTRU
ingin bukti instrumen tervalidasi.

Tugas:
1. Buat route mis. /institusi/metodologi atau whitepaper request, berisi nama instrumen
   lengkap + dimensi + sitasi APA + [klaim UNJANI sesuai status terkonfirmasi Fase 0C].
2. Set `noindex` (robots meta) agar tidak masuk mesin pencari & tidak mudah ditemukan peserta
   kasual lewat Google.
3. Akses via CTA "Pelajari instrumen lengkap (untuk institusi)" atau gated form/demo.
4. Tetap akademik, konservatif, jujur soal keterbatasan.

Acceptance: detail instrumen bernama hanya ada di route noindex/buyer; tidak di-crawl;
tidak tertaut dari halaman peserta.
```

### Prompt 3C — Pivot keyword konten (outcome, bukan instrumen)

```
Audit konten/metadata yang menarget keyword nama instrumen ("tes MBTI", "Holland Code")
dan geser ke keyword berbasis outcome/job-to-be-done:
- "cara tahu jurusan kuliah yang cocok" / "tes minat bakat pilih jurusan"
- "tes kepribadian untuk karier" / "cara tahu karier yang cocok"
- "asesmen potensi siswa SMA/SMK"
- "tes gaya kepemimpinan untuk karyawan"

Tugas: identifikasi halaman/meta yang target keyword instrumen, usulkan peta keyword baru
(JANGAN langsung hapus halaman terindeks — buat daftar dulu untuk direview manusia + rencana
301 bila perlu).
```

---

## FASE 4 — Audit Programmatic Content (REPO-LANDING) — prioritas: KEPUTUSAN

Pipeline konten meng-generate halaman tipe MBTI (INTJ.mdx dst.) & Holland untuk SEO.
Ini murni main nama-instrumen → bertentangan dengan keputusan de-brand.

> [BUTUH KEPUTUSAN] Pilih:
> - (a) Matikan + 301 ke halaman produk/arketipe (kehilangan trafik keyword instrumen, sesuai keputusan).
> - (b) Pertahankan sebagai top-of-funnel tapi de-brand & redirect CTA ke produk.
> - (c) Biarkan (terima inkonsistensi dengan keputusan de-brand).
>
> Trade-off: ini sumber trafik yang sudah ada; mematikan tanpa 301 = buang SEO equity.
> Rekomendasi saya: (a) dengan 301 ke arketipe/produk, dijalankan SETELAH Fase 1–3 stabil,
> bukan sekarang.

---

## Ringkasan urutan eksekusi

1. **Fase 0** (landing) — sekarang; butuh konfirmasi status UNJANI (0C).
2. **Fase 1 + 2** (app) — inti anti-gaming; butuh sign-off arketipe (Fase 1).
3. **Fase 3** (landing) — setelah app stabil; sensitif SEO, jangan terburu.
4. **Fase 4** (landing) — keputusan terpisah, terakhir.

Fase 0 & 3 (landing) dan Fase 1 & 2 (app) bisa diparalelkan lintas repo bila ada dua orang.
