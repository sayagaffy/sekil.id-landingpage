# Sekil.id Landing Page — Content Production Pipeline v1.0

**Companion to:** `01_Landingpage_Spec_v1.md`, `02_SEO_AEO_GEO_Strategy.md`
**Status:** Ready for execution
**Constraint:** LLM generated + UNJANI sign-off per template; YMYL-aware

---

## 0. Core Principle — Template-First, Page-Second

Karena UNJANI sign-off bottleneck = real risk, design pipeline-nya begini:

```
┌────────────────────┐    ┌──────────────────┐    ┌──────────────┐
│ 1. UNJANI reviews  │ →  │ 2. LLM generates │ →  │ 3. Spot-check │
│    TEMPLATE        │    │    PAGES from    │    │    sample +   │
│    + 3 sample      │    │    template      │    │    publish    │
│    outputs         │    │    via data      │    │               │
└────────────────────┘    └──────────────────┘    └──────────────┘
   1× effort per          Scale: 50-100 page      Quality gate:
   template               with same template       10% manual review
```

**Why this works**: UNJANI review 1 template + 3 sample = 1-2 hari kerja. LLM generate 30 pages dari template tersebut = 1 hari. Vs paradigma "review every page" = 60 hari kerja.

**Trade-off**: kalau template flawed, all 30 pages flawed → discover late. Mitigated by spot-check sample 10% (3 page dari 30) sebelum publish all.

---

## 1. Pipeline Architecture

### 1.1 Stages

```
[Stage 0] Data Preparation
    └─ Source: career_paths table, products table, MBTI/Holland reference data
    └─ Output: JSON dataset per template

[Stage 1] Template Engineering
    └─ Define: prompt template, output schema, citation requirements, disclaimers
    └─ Output: prompt.md + schema.json per template

[Stage 2] Sample Generation
    └─ Generate 3 representative samples per template
    └─ Output: 3 MDX file per template

[Stage 3] UNJANI Review (HUMAN GATE)
    └─ UNJANI lecturer review template + 3 samples
    └─ Decision: approve / revise / reject
    └─ Output: sign-off doc + revision request kalau ada

[Stage 4] Batch Generation
    └─ Generate ALL pages dari template approved
    └─ Output: MDX file batch + audit log

[Stage 5] QA Pass
    └─ Automated: lint, schema validation, link check, length check
    └─ Manual: 10% spot-check (random sample)
    └─ Output: pass/fail report

[Stage 6] Publish
    └─ Merge to main → Vercel deploy → submit to GSC
    └─ Monitor: GSC indexing, first impressions

[Stage 7] Iterate
    └─ Quarterly: refresh data, regenerate, redeploy
```

### 1.2 Data Sources

**Existing data** (dari project knowledge — di portal backend):
- `career_paths` table — Holland code match, MBTI match, salary range, education, industry
- `products` table — 11 produk dengan code, name, required_assessments, price
- B One certification mapping (di-spec di PRD)

**To-be-curated data** (perlu di-build):
- `mbti_types.json` — 16 MBTI types dengan deskripsi natural untuk Indonesia
- `holland_codes.json` — 6 Holland dimensi + 3-letter combinations
- `jurusan_indonesia.json` — daftar jurusan kuliah Indonesia + deskripsi
- `karier_indonesia.json` — daftar karier prioritas + deskripsi (subset dari career_paths)

**Curation effort**: ~3-5 hari kerja founder + UNJANI assistant untuk seed data quality.

---

## 2. Template 1: /kepribadian/[type]

**Goal**: Capture top-of-funnel search "INTJ adalah", "ISFJ karier", "Holland investigative pekerjaan"

**Output**: 22 pages (16 MBTI + 6 Holland)

### 2.1 Data Schema per Page

```json
{
  "type_code": "INTJ",
  "type_system": "mbti",
  "type_name": "INTJ — The Architect",
  "type_name_id": "INTJ — Sang Arsitek",
  "dimensions": {
    "introversion_extraversion": "Introvert",
    "sensing_intuition": "Intuition",
    "thinking_feeling": "Thinking",
    "judging_perceiving": "Judging"
  },
  "core_traits": ["strategic", "independent", "analytical", "decisive"],
  "strengths": ["systems thinking", "long-term planning", "..."],
  "growth_areas": ["emotional sensitivity", "patience with details", "..."],
  "career_matches": ["data_scientist", "software_architect", "research_scientist", "..."],
  "major_matches": ["teknik_informatika", "matematika", "fisika", "..."],
  "famous_examples": null,  // SENGAJA null — hindari klaim kepribadian tokoh tanpa basis
  "estimated_population_percent": 2,  // dari literature
  "academic_citation": "Myers & Briggs, 1962; updated Myers Briggs Foundation"
}
```

### 2.2 Prompt Template

```markdown
# Role
Anda adalah penulis konten edukasi karier yang berbasis akademik. Anda menulis 
untuk audiens Indonesia, dengan bahasa profesional namun mudah dipahami siswa 
SMA hingga profesional dewasa.

# Constraints (NON-NEGOTIABLE)
- WAJIB sertakan disclaimer: "Tipe kepribadian adalah model deskriptif, bukan 
  diagnosis. Setiap individu memiliki nuansa yang unik."
- DILARANG memberi prediksi pasti tentang individu ("Anda PASTI sukses sebagai X")
- DILARANG memberi rekomendasi medis atau klinis
- DILARANG mengklaim akurasi 100% — gunakan "cenderung", "umumnya", "berkorelasi"
- Citation akademik untuk klaim metodologi
- Bahasa: Indonesia formal-natural, hindari English unnecessary

# Output Format
Render dalam MDX dengan struktur:

```mdx
---
title: "[type_name_id] — Karier, Jurusan, dan Pengembangan Diri | Sekil.id"
description: "Pelajari karakteristik tipe kepribadian [type_code]: kekuatan, area pengembangan, dan jalur karier yang umumnya cocok. Tes lengkap di Sekil.id."
publishedAt: "[ISO date]"
modifiedAt: "[ISO date]"
type_code: "[type_code]"
type_system: "[type_system]"
author: "Tim Akademik Sekil.id × UNJANI"
reviewedBy: "[UNJANI lecturer name & credential]"
---

# [type_name_id]: Karakteristik, Karier, dan Pengembangan Diri

[Paragraf pembuka 2-3 kalimat: definisi tipe + ringkasan trait. 
Mulai dengan "‹type_code› adalah..."]

## Karakteristik Utama

[Penjelasan core traits dalam 1 paragraf]

### Kekuatan
- [strength 1]: [1 kalimat explanation]
- [strength 2]: ...
- (4-6 items)

### Area Pengembangan
- [growth area 1]: [1 kalimat constructive framing]
- (3-5 items)

## Karier yang Umumnya Cocok untuk [type_code]

Berdasarkan literatur tipologi kepribadian, individu dengan profil [type_code] 
cenderung berkembang di karier yang [trait-fit description, 1 kalimat].

### Contoh Karier
- **[career 1]**: [1-2 kalimat why fit]
- **[career 2]**: ...
- (5-8 items, link ke /karier/[slug])

> **Penting**: Kecocokan karier bukan satu-satunya prediktor sukses. Minat, 
> nilai, kemampuan teknis, dan konteks pasar kerja juga berperan.

## Jurusan Kuliah yang Relevan

Untuk siswa SMA yang mempertimbangkan jurusan, profil [type_code] sering 
berhubungan dengan jurusan:

- **[major 1]**: [why match] — [link ke /jurusan/slug]
- (3-5 items)

## Tipe Ini di Konteks Indonesia

[Paragraf 100-150 kata: bagaimana tipe ini terwujud di budaya kerja Indonesia. 
Contoh: gotong royong, hierarki organisasi, work-life balance lokal. Pakai 
data UNJANI atau YouthLab kalau available.]

## Pengembangan Diri untuk [type_code]

3-5 saran konkret pengembangan diri untuk tipe ini. Framing: actionable, 
positive, no medical claim.

## Pertanyaan Umum

### Apakah hasil tes [type_code] tetap sama seumur hidup?
[Jawaban berbasis literatur: tipe relatif stabil tapi ada nuansa perkembangan]

### Apakah [type_code] lebih baik dari tipe lain?
Tidak. Setiap tipe punya kekuatan dan tantangan yang berbeda. Tidak ada 
hierarki tipe kepribadian.

### Apakah saya pasti cocok di karier yang disebut di atas?
[Jawaban: rekomendasi berbasis pola populasi, bukan prediksi individual]

### Bagaimana cara mengetahui tipe kepribadian saya secara akurat?
Sekil.id menyediakan tes [PsyAI / Self Discovery AI] yang menggunakan 
instrumen tervalidasi MBTI-style dengan dukungan akademik UNJANI Fakultas 
Psikologi. [Link CTA]

## Disclaimer

Konten ini bersifat edukatif dan deskriptif. Tipe kepribadian adalah model 
yang membantu memahami kecenderungan, bukan diagnosis psikologis atau 
prediksi pasti. Untuk evaluasi mendalam, konsultasikan dengan psikolog 
profesional.

## Referensi
- Myers, I. B., & Myers, P. B. (1995). *Gifts Differing: Understanding Personality Type*.
- [Citation 2 kalau ada]

---

[CTA component: link ke /produk/psyai untuk full test]
[Internal link block: 3 related types + 1 product + 1 blog]
```
```

### 2.3 Sample Generation (3 samples untuk UNJANI review)

Sample 1: **INTJ** (representative mainstream, well-documented)
Sample 2: **ISFP** (representative — kurang populer, ujicoba template generalize)
Sample 3: **Holland Investigative** (representative — sistem Holland berbeda dari MBTI)

UNJANI review checklist:
- [ ] Akurasi klaim tipologi (no overreach)
- [ ] Disclaimer jelas & cukup
- [ ] Citation appropriate
- [ ] Bahasa & tone fit audience Indonesia
- [ ] No medical/diagnostic framing
- [ ] Career/major mapping reasonable (not absolute)

### 2.4 Batch Generation Script

Pseudocode:
```typescript
// scripts/generate-personality-pages.ts
const types = [...mbtiTypes, ...hollandCodes]; // 22 entries

for (const type of types) {
  const prompt = buildPrompt(promptTemplate, type, dataLookup(type));
  const mdx = await llm.generate({
    model: 'claude-opus-4-7',  // best quality untuk YMYL
    system: SYSTEM_PROMPT_YMYL_AWARE,
    user: prompt,
    maxTokens: 4000,
    temperature: 0.3  // low untuk consistency
  });
  
  // Auto-validation
  validateSchema(mdx);
  validateLength(mdx, min: 800);
  validateDisclaimerPresent(mdx);
  validateNoMedicalClaim(mdx);  // regex blocklist
  
  // Save
  fs.writeFileSync(`content/kepribadian/${type.code}.mdx`, mdx);
  
  // Audit log
  log({ type: type.code, tokensUsed, validationsPass });
}
```

**Auto-validation blocklist** (kalau match → reject, regenerate):
- "diagnosis", "kelainan", "gangguan kepribadian"
- "100%", "pasti", "dijamin sukses"
- "PASTI cocok", "tidak akan pernah"
- Any claim mental health symptom

---

## 3. Template 2: /karier/[slug]

**Goal**: Capture career-research search "data scientist gaji indonesia", "karier marketing analyst"

**Output**: ~30 pages priority careers

### 3.1 Data Schema

Pakai existing `career_paths` table + augment:
```json
{
  "code": "data_scientist",
  "name": "Data Scientist",
  "name_id": "Data Scientist (Ilmuwan Data)",
  "description_short": "Profesional yang menganalisis data untuk insight bisnis",
  "holland_codes": ["IES", "IAR"],
  "mbti_types_common": ["INTJ", "INTP", "ISTJ"],
  "industry": "Teknologi",
  "sector": "Technology / Data",
  "typical_education": "S1 Statistika / Matematika / Ilmu Komputer / Fisika",
  "typical_employers": "Tech company, perbankan, e-commerce, konsultan",
  "salary_range_idr": { "entry": 8000000, "mid": 18000000, "senior": 35000000 },
  "skills_required": ["Python", "SQL", "Statistika", "Machine Learning", "Communication"],
  "growth_outlook_indonesia": "Tinggi — permintaan tumbuh 25% YoY (sumber: LinkedIn Workforce Report 2025)",
  "b_one_certifications": ["IT Specialist Data Analytics", "Microsoft Power BI"],
  "related_careers": ["data_analyst", "ml_engineer", "business_analyst"],
  "related_majors": ["statistika", "ilmu_komputer", "matematika"]
}
```

### 3.2 Prompt Template Highlights

Sama pattern dengan `/kepribadian` tapi structure:

```mdx
# [Karier Name]: Deskripsi, Skill, Gaji, dan Jalur Karier di Indonesia

[Lead paragraph]

## Apa yang Dikerjakan [Karier]?
## Skill yang Dibutuhkan
## Gaji [Karier] di Indonesia
## Tipe Kepribadian yang Umumnya Cocok
## Jurusan Kuliah untuk Menjadi [Karier]
## Sertifikasi yang Mendukung Karier Ini
## Jalur Pengembangan Karier
## Pertanyaan Umum
## Karier Terkait
[CTA: tes Path Finder AI / Career Interest]
```

### 3.3 Salary Disclaimer (PENTING)

Setiap salary range WAJIB di-frame:
> "Rentang gaji di atas merupakan estimasi berdasarkan survei pasar tahun 2025. 
> Angka aktual bervariasi berdasarkan lokasi, pengalaman, ukuran perusahaan, 
> dan industri spesifik."

Source kalau memungkinkan: LinkedIn Workforce Report Indonesia, Jobstreet salary report, Mercer.

### 3.4 Sample Generation

Sample 1: **Data Scientist** (technical, growth field)
Sample 2: **Marketing Analyst** (business, mid-tier)
Sample 3: **Guru SMA** (traditional, dari deck B One mapping)

UNJANI review focus untuk template ini: salary accuracy, certification mapping ke B One, jurusan recommendation reasonable.

---

## 4. Template 3: /jurusan/[slug]

**Goal**: Capture parent + siswa search "jurusan psikologi prospek kerja", "kuliah teknik informatika"

**Output**: ~25 pages

### 4.1 Data Schema

```json
{
  "code": "teknik_informatika",
  "name": "Teknik Informatika",
  "name_alt": ["Ilmu Komputer", "Computer Science"],
  "faculty": "Fakultas Teknik / Fakultas Ilmu Komputer",
  "description_short": "Studi tentang algoritma, sistem komputasi, dan pengembangan software",
  "ideal_profile_holland": ["I", "C"],
  "ideal_profile_mbti": ["INTJ", "INTP", "ISTJ", "ISTP"],
  "core_subjects": ["Algoritma", "Struktur Data", "Database", "Software Engineering"],
  "career_paths_post_graduation": ["software_engineer", "data_scientist", "system_analyst"],
  "top_universities_indonesia": ["ITB", "UI", "UGM", "ITS", "Telkom University"],
  "related_majors": ["sistem_informasi", "teknik_komputer"],
  "growth_outlook": "Permintaan lulusan tetap tinggi (BPS 2024)"
}
```

### 4.2 Structure

```mdx
# Jurusan [Name]: Mata Kuliah, Prospek, dan Kecocokan Profil

## Apa yang Dipelajari di Jurusan [Name]?
## Profil Siswa yang Umumnya Cocok
[Holland code & MBTI alignment dengan disclaimer]
## Mata Kuliah Utama
## Prospek Karier Setelah Lulus
[Link ke /karier/* relevant]
## Universitas Top untuk Jurusan Ini di Indonesia
## Tantangan Selama Studi
## Pertanyaan Umum
[CTA: tes Path Finder AI]
```

### 4.3 Sensitivity

Jurusan recommendation ada risiko parental influence ("orang tua menentang minat anak"). Framing harus:
- "Cocok untuk profil X" bukan "Hanya untuk profil X"
- Mention bahwa banyak professional sukses di jurusan tidak konvensional
- Tidak menjudge jurusan tertentu inferior

---

## 5. Template 4: /untuk/[vertical]

**Goal**: Capture B2B segment-specific search "asesmen siswa SMA swasta", "psikotes karyawan startup"

**Output**: ~10 pages

### 5.1 Less Sensitive (No UNJANI Bottleneck)

Karena ini marketing landing per vertical (bukan academic claim), reviewer cukup founder + sales lead B One. UNJANI sign-off NOT required.

### 5.2 Structure

```mdx
# Asesmen Sekil.id untuk [Vertical]

## Tantangan Spesifik [Vertical]
## Bagaimana Sekil.id Membantu
## Produk Recommended untuk [Vertical]
## Pricing & Implementation
## [Vertical] Lain yang Sudah Pakai Sekil.id
[Testimonial placeholder]
## FAQ Khusus [Vertical]
## CTA: Jadwalkan Demo untuk [Vertical] Anda
```

### 5.3 Vertical List

1. /untuk/sma-swasta
2. /untuk/sekolah-islam
3. /untuk/smk-kejuruan
4. /untuk/perguruan-tinggi-negeri
5. /untuk/perguruan-tinggi-swasta
6. /untuk/perusahaan-manufaktur
7. /untuk/startup-teknologi
8. /untuk/perbankan
9. /untuk/yayasan-pendidikan-multi-unit
10. /untuk/lembaga-konsultan-karier

---

## 6. QA Pass — Automated & Manual

### 6.1 Automated Validation (CI on PR)

```typescript
// scripts/validate-content.ts
const checks = [
  validateMdxFrontmatter,       // title, description, author, dates present
  validateMinLength(800),        // body min 800 words
  validateMaxLength(3500),       // hindari over-bloat
  validateNoBrokenLinks,         // internal link resolve
  validateNoMedicalClaim,        // regex blocklist
  validateNoOverreach,           // "PASTI", "dijamin", "100%"
  validateDisclaimerPresent,     // string match minimum 1 disclaimer
  validateSchemaJsonLd,          // JSON-LD parse valid
  validateAuthorByline,          // byline pattern present
  validateNoAcademicMisattribution // citation pattern check
];

content.forEach(file => {
  checks.forEach(check => check(file));
});
```

Fail = PR blocked.

### 6.2 Manual Spot-Check (10% Sample)

Random select 10% page per template (3 dari 30) untuk manual review oleh:
- Template 1, 2, 3 (akademik): UNJANI lecturer
- Template 4 (B2B marketing): Founder + B One sales lead

Checklist:
- [ ] Akurasi faktual
- [ ] Tone & voice consistent dengan brand
- [ ] Disclaimer cukup & visible
- [ ] CTA appropriate
- [ ] No embarrassing wording
- [ ] Reads natural (not robotic)

### 6.3 Quarterly Re-Review

Setiap quarter:
- Review 10% random sample untuk content drift / outdated info
- Update data sources (salary, growth outlook, B One cert mapping)
- Refresh `dateModified` jika ada update

---

## 7. UNJANI Engagement Protocol

### 7.1 Time Commitment Negotiation

**Initial setup (one-time)**:
- 4 hari kerja untuk review 4 template + 12 sample
- 1 hari workshop untuk align voice & methodology

**Ongoing**:
- 1 hari/quarter untuk spot-check + content drift review
- Ad-hoc untuk template baru atau methodology change

**Compensation**: pre-negotiate clear (founder responsibility — flat fee per template review atau retainer monthly).

### 7.2 Review Workflow

1. Founder push branch dengan template + 3 samples
2. Founder share preview URL (Vercel preview)
3. UNJANI review via PR comment atau separate doc
4. Founder iterate based on feedback
5. UNJANI approve via "sign-off" message di PR
6. Merge → batch generate → publish

### 7.3 Attribution di Production

Setiap content yang reviewed UNJANI:
- Byline: `Reviewed by [UNJANI Lecturer Name], M.Psi., Psikolog (UNJANI Fakultas Psikologi)`
- Date reviewed in frontmatter
- Schema.org `reviewedBy` populated

Ini critical untuk E-E-A-T signal.

---

## 8. Cost & Time Budget

### 8.1 LLM Cost Estimate

Per page ~3,500 input tokens + ~3,000 output tokens via Claude Opus 4.7:
- Input: 3,500 × $15/1M = $0.05
- Output: 3,000 × $75/1M = $0.23
- **Per page: ~$0.28 USD** (~Rp 4,500)

Untuk 100 pages: ~Rp 450,000 (one-time)

Quarterly refresh (regenerate 10%): ~Rp 45,000/quarter

Negligible cost compared to time saved.

### 8.2 Time Budget

| Phase | Duration | Owner |
|---|---|---|
| Data curation (mbti, holland, jurusan, karier seed) | 5 hari | Founder + intern |
| Template engineering (4 template + prompts) | 3 hari | Founder + content lead |
| Sample generation (12 samples) | 1 hari | LLM (Claude Opus 4.7) |
| UNJANI review batch 1 (4 templates + 12 samples) | 4 hari | UNJANI lecturer |
| Revision cycles | 2 hari | Founder + LLM |
| Batch generation (87 pages) | 1 hari | LLM |
| QA pass (automated + spot-check) | 2 hari | Founder + UNJANI |
| Publish & GSC submit | 0.5 hari | Founder |
| **Total** | **~18.5 hari kerja** | |

Realistic: spread atas 4 minggu untuk avoid UNJANI burnout.

---

## 9. Monitoring & Iteration

### 9.1 Post-Publish Metrics (per page)

Track via GSC + GA4:
- Impressions (week 4 → cumulative)
- Avg position (target <30 dalam 8 minggu)
- CTR
- Bounce rate
- Time on page
- Conversion (CTA click rate)

### 9.2 Iteration Triggers

**Refresh page kalau**:
- Impressions tinggi (>500/bulan) tapi CTR <2% → revise title/meta
- Position 11-20 (just outside top 10) → add content depth, internal link boost
- Bounce >80% → revise intro section
- 6 bulan tidak rank → audit deeper, potentially deprecate

**Deprecate page kalau**:
- 12 bulan tidak rank top 30
- Topic obsolete (e.g., karier yang sudah tidak relevan)
- Better consolidate ke page lain (301 redirect)

### 9.3 Cluster Performance

Group page by template. Track:
- Template 1 (/kepribadian) average position
- Template 2 (/karier) average position
- dst.

Identify template yang underperform → diagnose template-level issue (prompt structure, data quality, search intent mismatch).

---

## 10. Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| UNJANI review bottleneck → publish delay | High | High | Template-level review (1× effort), schedule advance, backup reviewer |
| LLM hallucinate fact (mis. salary, jurusan) | Medium | High | Strict data-lookup (no free-form facts), validation regex, spot-check |
| Google flag thin/duplicate content | Medium | High | Min 800 word unique per page, slow rollout 10/week, monitor GSC |
| YMYL penalty karena weak E-E-A-T | Medium | High | UNJANI byline + credential, citation, disclaimer, author photo |
| Programmatic page kanibal organic dari foundation page | Low | Medium | Clear keyword mapping, no overlap, canonical correct |
| Outdated content (salary, certification) | High | Medium | Quarterly refresh process, dateModified visible |
| LLM tone drift across batches | Medium | Low | Lock model + temperature, snapshot prompt, A/B sanity check |
| Negative LLM output (offensive, biased) | Low | High | Multi-layer validation, system prompt safety instructions, manual sample |

---

## 11. Open Items

1. **UNJANI agreement & compensation** — finalize contract dengan UNJANI untuk content review SLA
2. **Author photo & bio** — dapatkan foto + bio UNJANI lecturer untuk byline
3. **Data sources licensing** — kalau pakai LinkedIn Workforce Report, Jobstreet — clear attribution
4. **Translation strategy** — V2 English content akan re-trigger pipeline atau separate?
5. **Update cadence policy** — quarterly atau biennial untuk salary data?
6. **Deprecation policy** — formal protocol untuk delete/redirect underperforming page

---

**End of Content Production Pipeline v1.0.**