export type CareerCategory =
  | 'teknologi'
  | 'bisnis'
  | 'kesehatan'
  | 'pendidikan'
  | 'kreatif'
  | 'sosial'
  | 'hukum'
  | 'teknik'
  | 'keuangan';

export type GrowthOutlook = 'Sangat Tinggi' | 'Tinggi' | 'Sedang' | 'Rendah';

export interface SalaryRange {
  min: number;
  max: number;
  currency: 'IDR';
  period: 'per bulan';
}

export interface Career {
  slug: string;
  name: string;
  category: CareerCategory;
  description: string;
  salaryRange: SalaryRange;
  educationLevel: 'D3' | 'S1' | 'S1/S2' | 'S2' | 'S3' | 'Profesi';
  hollandCodes: string[];
  commonPersonalities: string[];
  requiredSkills: string[];
  relatedMajors: string[];
  growthOutlook: GrowthOutlook;
  seoTitle: string;
  seoDescription: string;
  primaryKeyword: string;
}

export const CAREERS: Career[] = [
  // ────────────────────────────────────────
  // Teknologi (6)
  // ────────────────────────────────────────
  {
    slug: 'data-scientist',
    name: 'Data Scientist',
    category: 'teknologi',
    description:
      'Data Scientist menganalisis dataset besar untuk menemukan pola tersembunyi, membangun model prediktif, dan menghasilkan insight yang mendorong keputusan bisnis. Di Indonesia, peran ini semakin kritis seiring adopsi AI dan big data di industri keuangan, e-commerce, dan kesehatan. Prospek gaji sangat kompetitif — median Data Scientist di Jakarta mencapai Rp 15–25 juta per bulan, jauh di atas rata-rata nasional.',
    salaryRange: { min: 12000000, max: 35000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['I', 'C', 'R'],
    commonPersonalities: ['intj', 'intp', 'istj', 'holland-i', 'holland-c'],
    requiredSkills: [
      'Python / R untuk analisis data',
      'SQL dan database management',
      'Machine learning (scikit-learn, TensorFlow)',
      'Statistik dan probabilitas',
      'Data visualization (Tableau, Power BI)',
      'Komunikasi insight ke non-teknis',
    ],
    relatedMajors: ['statistika', 'teknik-informatika', 'matematika', 'ilmu-ekonomi'],
    growthOutlook: 'Sangat Tinggi',
    seoTitle: 'Karier Data Scientist di Indonesia — Gaji, Skill, dan Jalur Karier | Sekil.id',
    seoDescription:
      'Panduan lengkap karier Data Scientist di Indonesia: rata-rata gaji Rp 12–35 juta/bulan, skill yang dibutuhkan, jurusan kuliah yang relevan, dan prospek pertumbuhan.',
    primaryKeyword: 'karier data scientist',
  },
  {
    slug: 'software-engineer',
    name: 'Software Engineer',
    category: 'teknologi',
    description:
      'Software Engineer merancang, mengembangkan, dan memelihara perangkat lunak — dari aplikasi mobile hingga sistem backend skala besar. Indonesia adalah salah satu pasar teknologi dengan pertumbuhan tercepat di Asia Tenggara, dengan demand untuk Software Engineer yang terus meningkat. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 8000000, max: 40000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['I', 'R', 'C'],
    commonPersonalities: ['intj', 'intp', 'istp', 'holland-i', 'holland-r'],
    requiredSkills: [
      'Pemrograman (JavaScript, Python, Java, Go)',
      'Struktur data dan algoritma',
      'Version control (Git)',
      'System design dan arsitektur',
      'Pengujian dan debugging',
    ],
    relatedMajors: ['teknik-informatika', 'sistem-informasi', 'teknik-elektro'],
    growthOutlook: 'Sangat Tinggi',
    seoTitle: 'Karier Software Engineer di Indonesia — Gaji dan Prospek | Sekil.id',
    seoDescription:
      'Panduan karier Software Engineer di Indonesia: gaji, skill yang dibutuhkan, jurusan kuliah relevan, dan prospek pertumbuhan industri teknologi.',
    primaryKeyword: 'karier software engineer',
  },
  {
    slug: 'product-manager',
    name: 'Product Manager',
    category: 'teknologi',
    description:
      'Product Manager mengelola siklus hidup produk digital — dari ideasi hingga peluncuran — dengan menyeimbangkan kebutuhan pengguna, tujuan bisnis, dan kemampuan teknis. Peran ini membutuhkan kemampuan lintas disiplin yang kuat. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 15000000, max: 45000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['E', 'I', 'S'],
    commonPersonalities: ['entj', 'entp', 'intj', 'holland-e', 'holland-i'],
    requiredSkills: [
      'Product roadmapping dan prioritization',
      'User research dan analisis data',
      'Komunikasi lintas tim (engineering, design, business)',
      'Pemahaman teknis dasar',
      'Agile/Scrum methodology',
    ],
    relatedMajors: ['teknik-informatika', 'manajemen', 'sistem-informasi'],
    growthOutlook: 'Sangat Tinggi',
    seoTitle: 'Karier Product Manager di Indonesia — Gaji dan Skill | Sekil.id',
    seoDescription:
      'Panduan karier Product Manager di Indonesia: rata-rata gaji, skill yang dibutuhkan, jurusan kuliah relevan, dan jalur karier dari junior hingga senior PM.',
    primaryKeyword: 'karier product manager',
  },
  {
    slug: 'ui-ux-designer',
    name: 'UI/UX Designer',
    category: 'teknologi',
    description:
      'UI/UX Designer menciptakan pengalaman digital yang intuitif dan menarik — menggabungkan estetika visual dengan pemahaman mendalam tentang perilaku pengguna. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 7000000, max: 28000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['A', 'I', 'S'],
    commonPersonalities: ['isfp', 'infp', 'enfp', 'holland-a', 'holland-i'],
    requiredSkills: [
      'Figma / Sketch untuk prototyping',
      'User research dan usability testing',
      'Prinsip desain visual dan tipografi',
      'Information architecture',
      'Pemahaman dasar HTML/CSS',
    ],
    relatedMajors: ['desain-komunikasi-visual', 'teknik-informatika', 'arsitektur'],
    growthOutlook: 'Tinggi',
    seoTitle: 'Karier UI/UX Designer di Indonesia — Gaji dan Prospek | Sekil.id',
    seoDescription:
      'Panduan karier UI/UX Designer di Indonesia: rata-rata gaji, skill yang dibutuhkan, jurusan kuliah relevan, dan jalur karier di industri teknologi.',
    primaryKeyword: 'karier ui ux designer',
  },
  {
    slug: 'data-analyst',
    name: 'Data Analyst',
    category: 'teknologi',
    description:
      'Data Analyst menginterpretasikan data untuk membantu organisasi membuat keputusan yang lebih baik. Berbeda dengan Data Scientist, fokus utama Data Analyst adalah pada deskripsi dan visualisasi data yang sudah ada, bukan membangun model prediktif. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 6000000, max: 20000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['I', 'C'],
    commonPersonalities: ['intj', 'istj', 'intp', 'holland-i', 'holland-c'],
    requiredSkills: [
      'SQL untuk query dan manipulasi data',
      'Excel / Google Sheets tingkat lanjut',
      'Python atau R untuk analisis',
      'Tableau / Power BI untuk visualisasi',
      'Statistik deskriptif dan inferensial',
    ],
    relatedMajors: ['statistika', 'teknik-informatika', 'manajemen', 'akuntansi'],
    growthOutlook: 'Tinggi',
    seoTitle: 'Karier Data Analyst di Indonesia — Gaji dan Jalur Karier | Sekil.id',
    seoDescription:
      'Panduan karier Data Analyst di Indonesia: rata-rata gaji, skill yang dibutuhkan, jurusan kuliah relevan, dan perbedaan dengan Data Scientist.',
    primaryKeyword: 'karier data analyst',
  },
  {
    slug: 'cybersecurity-analyst',
    name: 'Cybersecurity Analyst',
    category: 'teknologi',
    description:
      'Cybersecurity Analyst melindungi sistem informasi organisasi dari ancaman siber — mulai dari penetration testing hingga incident response. Demand untuk profesional keamanan siber di Indonesia terus meningkat seiring regulasi BSSN dan PDPA. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 10000000, max: 35000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['I', 'R', 'C'],
    commonPersonalities: ['intj', 'istp', 'intp', 'holland-i', 'holland-r'],
    requiredSkills: [
      'Jaringan komputer dan protokol keamanan',
      'Ethical hacking dan penetration testing',
      'SIEM tools (Splunk, IBM QRadar)',
      'Incident response dan forensik digital',
      'Sertifikasi: CEH, CISSP, CompTIA Security+',
    ],
    relatedMajors: ['teknik-informatika', 'sistem-informasi', 'teknik-elektro'],
    growthOutlook: 'Sangat Tinggi',
    seoTitle: 'Karier Cybersecurity Analyst di Indonesia — Gaji dan Prospek | Sekil.id',
    seoDescription:
      'Panduan karier Cybersecurity Analyst di Indonesia: rata-rata gaji, skill yang dibutuhkan, sertifikasi relevan, dan prospek pertumbuhan.',
    primaryKeyword: 'karier cybersecurity analyst',
  },

  // ────────────────────────────────────────
  // Bisnis (6)
  // ────────────────────────────────────────
  {
    slug: 'marketing-analyst',
    name: 'Marketing Analyst',
    category: 'bisnis',
    description:
      'Marketing Analyst menganalisis data pasar, perilaku konsumen, dan efektivitas kampanye untuk mendorong keputusan marketing yang lebih cerdas. Di era digital, peran ini semakin data-driven — menggabungkan kemampuan analitik dengan pemahaman mendalam tentang psikologi konsumen dan tren pasar Indonesia. Median gaji Marketing Analyst di Jakarta berkisar Rp 8–20 juta per bulan, dengan pertumbuhan signifikan di sektor e-commerce dan fintech.',
    salaryRange: { min: 6000000, max: 22000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['E', 'I', 'C'],
    commonPersonalities: ['entj', 'entp', 'estp', 'enfp', 'holland-e', 'holland-i'],
    requiredSkills: [
      'Analisis data dengan Excel, SQL, atau Python',
      'Google Analytics dan platform analytics digital',
      'Riset pasar kualitatif dan kuantitatif',
      'Pemahaman statistik dasar',
      'Presentasi dan visualisasi data',
      'Pemahaman perilaku konsumen dan segmentasi',
    ],
    relatedMajors: ['manajemen', 'komunikasi', 'ilmu-ekonomi', 'statistika'],
    growthOutlook: 'Tinggi',
    seoTitle: 'Karier Marketing Analyst di Indonesia — Gaji, Skill, dan Prospek | Sekil.id',
    seoDescription:
      'Panduan lengkap karier Marketing Analyst di Indonesia: rata-rata gaji Rp 6–22 juta/bulan, skill yang dibutuhkan, jurusan kuliah relevan, dan prospek di era digital.',
    primaryKeyword: 'karier marketing analyst',
  },
  {
    slug: 'business-analyst',
    name: 'Business Analyst',
    category: 'bisnis',
    description:
      'Business Analyst menjembatani kebutuhan bisnis dengan solusi teknologi — menganalisis proses, mengidentifikasi peluang perbaikan, dan menerjemahkan kebutuhan bisnis menjadi spesifikasi yang dapat diimplementasikan tim teknis. BA adalah peran yang sangat dicari di industri perbankan, konsultan, dan startup teknologi Indonesia. Gaji kompetitif dengan median Rp 8–25 juta per bulan di Jakarta.',
    salaryRange: { min: 8000000, max: 28000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['I', 'E', 'C'],
    commonPersonalities: ['intj', 'entj', 'istj', 'intp', 'holland-i', 'holland-e'],
    requiredSkills: [
      'Analisis kebutuhan bisnis dan penulisan spesifikasi',
      'Pemodelan proses bisnis (BPMN, flowchart)',
      'SQL untuk analisis data',
      'Kemampuan presentasi dan fasilitasi workshop',
      'Pemahaman SDLC dan metodologi Agile',
      'Komunikasi lintas fungsi yang kuat',
    ],
    relatedMajors: ['manajemen', 'teknik-informatika', 'ilmu-ekonomi', 'sistem-informasi'],
    growthOutlook: 'Tinggi',
    seoTitle: 'Karier Business Analyst di Indonesia — Gaji, Skill, dan Prospek | Sekil.id',
    seoDescription:
      'Panduan lengkap karier Business Analyst di Indonesia: rata-rata gaji Rp 8–28 juta/bulan, skill yang dibutuhkan, jurusan kuliah relevan, dan jalur karier BA.',
    primaryKeyword: 'karier business analyst',
  },
  {
    slug: 'human-resources-specialist',
    name: 'HR Specialist',
    category: 'bisnis',
    description:
      'HR Specialist mengelola fungsi sumber daya manusia — dari rekrutmen dan onboarding hingga pengembangan talent dan manajemen kinerja. Di era People Analytics, HR modern semakin data-driven. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 5000000, max: 18000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['S', 'E', 'C'],
    commonPersonalities: ['enfj', 'esfj', 'isfj', 'estj', 'holland-s', 'holland-e'],
    requiredSkills: [
      'Rekrutmen dan seleksi kandidat',
      'Pemahaman hukum ketenagakerjaan Indonesia',
      'Performance management dan KPI',
      'People analytics dasar',
      'Komunikasi interpersonal dan mediasi konflik',
    ],
    relatedMajors: ['psikologi', 'manajemen', 'hukum'],
    growthOutlook: 'Sedang',
    seoTitle: 'Karier HR Specialist di Indonesia — Gaji dan Prospek | Sekil.id',
    seoDescription:
      'Panduan karier HR Specialist di Indonesia: rata-rata gaji, skill yang dibutuhkan, jurusan kuliah relevan, dan jalur karier di bidang human resources.',
    primaryKeyword: 'karier hr specialist',
  },
  {
    slug: 'management-consultant',
    name: 'Management Consultant',
    category: 'bisnis',
    description:
      'Management Consultant membantu organisasi memecahkan masalah bisnis kompleks dan meningkatkan kinerja — dari strategi korporat hingga transformasi operasional. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 12000000, max: 50000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1/S2',
    hollandCodes: ['E', 'I', 'C'],
    commonPersonalities: ['entj', 'intj', 'entp', 'estj', 'holland-e', 'holland-i'],
    requiredSkills: [
      'Analisis bisnis dan problem solving struktural',
      'Presentasi eksekutif dan storytelling dengan data',
      'Project management',
      'Pemahaman industri yang luas',
      'Kemampuan Excel dan PowerPoint tingkat lanjut',
    ],
    relatedMajors: ['manajemen', 'ilmu-ekonomi', 'teknik-industri', 'hukum'],
    growthOutlook: 'Tinggi',
    seoTitle: 'Karier Management Consultant di Indonesia — Gaji dan Prospek | Sekil.id',
    seoDescription:
      'Panduan karier Management Consultant di Indonesia: rata-rata gaji, skill yang dibutuhkan, jurusan kuliah relevan, dan jalur karier di big 4 dan boutique consulting.',
    primaryKeyword: 'karier management consultant',
  },
  {
    slug: 'supply-chain-manager',
    name: 'Supply Chain Manager',
    category: 'bisnis',
    description:
      'Supply Chain Manager mengelola aliran barang, informasi, dan sumber daya dari pemasok hingga konsumen akhir — memastikan efisiensi, keandalan, dan ketahanan rantai pasokan. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 12000000, max: 35000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['E', 'C', 'R'],
    commonPersonalities: ['estj', 'entj', 'estp', 'istj', 'holland-e', 'holland-c'],
    requiredSkills: [
      'Manajemen logistik dan inventory',
      'ERP systems (SAP, Oracle)',
      'Analisis data dan forecasting',
      'Negosiasi dengan supplier',
      'Pemahaman regulasi impor/ekspor',
    ],
    relatedMajors: ['manajemen', 'teknik-industri', 'ilmu-ekonomi'],
    growthOutlook: 'Tinggi',
    seoTitle: 'Karier Supply Chain Manager di Indonesia — Gaji dan Prospek | Sekil.id',
    seoDescription:
      'Panduan karier Supply Chain Manager di Indonesia: rata-rata gaji, skill yang dibutuhkan, jurusan kuliah relevan, dan prospek di era disruption logistik.',
    primaryKeyword: 'karier supply chain manager',
  },
  {
    slug: 'financial-analyst',
    name: 'Financial Analyst',
    category: 'keuangan',
    description:
      'Financial Analyst menganalisis data keuangan untuk membantu organisasi membuat keputusan investasi dan strategi keuangan yang optimal. Di industri perbankan dan pasar modal Indonesia yang terus berkembang, peran ini sangat dicari. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 7000000, max: 30000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['I', 'C', 'E'],
    commonPersonalities: ['intj', 'istj', 'intp', 'entj', 'holland-i', 'holland-c'],
    requiredSkills: [
      'Analisis laporan keuangan',
      'Pemodelan keuangan di Excel',
      'Valuasi perusahaan (DCF, comparable)',
      'Pemahaman pasar modal Indonesia',
      'CFA preparation (opsional tapi sangat nilai tambah)',
    ],
    relatedMajors: ['akuntansi', 'manajemen', 'ilmu-ekonomi', 'statistika'],
    growthOutlook: 'Tinggi',
    seoTitle: 'Karier Financial Analyst di Indonesia — Gaji dan Prospek | Sekil.id',
    seoDescription:
      'Panduan karier Financial Analyst di Indonesia: rata-rata gaji, skill yang dibutuhkan, jurusan kuliah relevan, dan jalur karier di perbankan dan pasar modal.',
    primaryKeyword: 'karier financial analyst',
  },

  // ────────────────────────────────────────
  // Kesehatan (4)
  // ────────────────────────────────────────
  {
    slug: 'dokter-umum',
    name: 'Dokter Umum',
    category: 'kesehatan',
    description:
      'Dokter Umum memberikan pelayanan kesehatan primer — diagnosis, pengobatan, dan pencegahan penyakit umum. Sebagai pintu masuk sistem kesehatan, dokter umum berperan krusial dalam layanan kesehatan masyarakat Indonesia. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 8000000, max: 25000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'Profesi',
    hollandCodes: ['I', 'S', 'R'],
    commonPersonalities: ['infj', 'isfj', 'esfj', 'intj', 'holland-i', 'holland-s'],
    requiredSkills: [
      'Ilmu kedokteran dasar dan klinis',
      'Diagnosis dan penatalaksanaan penyakit umum',
      'Komunikasi dokter-pasien yang efektif',
      'Pengambilan keputusan klinis',
      'Rekam medis elektronik',
    ],
    relatedMajors: ['kedokteran'],
    growthOutlook: 'Tinggi',
    seoTitle: 'Karier Dokter Umum di Indonesia — Prospek dan Jalur Karier | Sekil.id',
    seoDescription:
      'Panduan karier Dokter Umum di Indonesia: gaji, jalur pendidikan, spesialisasi lanjutan, dan prospek karier di layanan kesehatan primer.',
    primaryKeyword: 'karier dokter umum',
  },
  {
    slug: 'psikolog-klinis',
    name: 'Psikolog Klinis',
    category: 'kesehatan',
    description:
      'Psikolog Klinis mengevaluasi, mendiagnosis, dan memberikan intervensi psikologis untuk berbagai kondisi mental dan emosional. Di Indonesia, permintaan untuk layanan kesehatan mental terus meningkat signifikan. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 6000000, max: 25000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S2',
    hollandCodes: ['I', 'S', 'A'],
    commonPersonalities: ['infj', 'infp', 'enfj', 'isfj', 'holland-i', 'holland-s'],
    requiredSkills: [
      'Asesmen psikologi dan interpretasi tes',
      'Teknik intervensi psikologis (CBT, ACT, dll)',
      'Etika profesi psikologi',
      'Dokumentasi klinis',
      'Empati dan kemampuan mendengarkan aktif',
    ],
    relatedMajors: ['psikologi'],
    growthOutlook: 'Tinggi',
    seoTitle: 'Karier Psikolog Klinis di Indonesia — Prospek dan Jalur Pendidikan | Sekil.id',
    seoDescription:
      'Panduan karier Psikolog Klinis di Indonesia: gaji, jalur pendidikan S2 Profesi, area spesialisasi, dan prospek layanan kesehatan mental.',
    primaryKeyword: 'karier psikolog klinis',
  },
  {
    slug: 'apoteker',
    name: 'Apoteker',
    category: 'kesehatan',
    description:
      'Apoteker mengelola penyediaan dan dispensing obat-obatan, memberikan konsultasi farmasi, dan memastikan penggunaan obat yang aman dan efektif. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 5000000, max: 18000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'Profesi',
    hollandCodes: ['I', 'C', 'S'],
    commonPersonalities: ['istj', 'isfj', 'intj', 'holland-i', 'holland-c'],
    requiredSkills: [
      'Farmakologi dan ilmu farmasi',
      'Manajemen apotek dan farmasi rumah sakit',
      'Konseling pasien tentang penggunaan obat',
      'Regulasi farmasi Indonesia (BPOM)',
    ],
    relatedMajors: ['farmasi'],
    growthOutlook: 'Sedang',
    seoTitle: 'Karier Apoteker di Indonesia — Gaji dan Prospek | Sekil.id',
    seoDescription:
      'Panduan karier Apoteker di Indonesia: gaji, jalur pendidikan, bidang kerja (apotek, RS, industri farmasi), dan prospek profesi.',
    primaryKeyword: 'karier apoteker',
  },
  {
    slug: 'perawat',
    name: 'Perawat',
    category: 'kesehatan',
    description:
      'Perawat memberikan perawatan langsung kepada pasien, mengelola kondisi kesehatan, dan menjadi koordinator utama dalam sistem pelayanan kesehatan. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 4000000, max: 15000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'D3',
    hollandCodes: ['S', 'I', 'R'],
    commonPersonalities: ['isfj', 'esfj', 'infj', 'holland-s', 'holland-i'],
    requiredSkills: [
      'Asuhan keperawatan dan prosedur klinis',
      'Komunikasi terapeutik',
      'Manajemen obat-obatan',
      'Respon darurat dan pertolongan pertama',
    ],
    relatedMajors: ['ilmu-gizi'],
    growthOutlook: 'Tinggi',
    seoTitle: 'Karier Perawat di Indonesia — Gaji dan Prospek | Sekil.id',
    seoDescription:
      'Panduan karier Perawat di Indonesia: gaji, jalur pendidikan (DIII vs S1 Keperawatan), spesialisasi, dan prospek di rumah sakit dan klinik.',
    primaryKeyword: 'karier perawat',
  },

  // ────────────────────────────────────────
  // Pendidikan (3)
  // ────────────────────────────────────────
  {
    slug: 'guru-bk',
    name: 'Guru BK (Bimbingan Konseling)',
    category: 'pendidikan',
    description:
      'Guru BK membantu siswa dalam pengembangan pribadi, sosial, belajar, dan karier. Mereka adalah ujung tombak layanan psikologis di sekolah dan berperan krusial dalam membantu siswa memilih jurusan dan jalur karier. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 3500000, max: 12000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['S', 'A', 'I'],
    commonPersonalities: ['infj', 'enfj', 'isfj', 'infp', 'holland-s'],
    requiredSkills: [
      'Teknik konseling individual dan kelompok',
      'Pemahaman perkembangan remaja',
      'Asesmen minat dan kepribadian',
      'Bimbingan karier untuk siswa SMA/SMK',
      'Komunikasi dengan orang tua',
    ],
    relatedMajors: ['psikologi', 'pendidikan-guru-sd'],
    growthOutlook: 'Sedang',
    seoTitle: 'Karier Guru BK di Indonesia — Prospek dan Kualifikasi | Sekil.id',
    seoDescription:
      'Panduan karier Guru BK (Bimbingan Konseling) di Indonesia: kualifikasi, gaji, tanggung jawab, dan peran dalam bimbingan karier siswa.',
    primaryKeyword: 'karier guru bk',
  },
  {
    slug: 'dosen',
    name: 'Dosen',
    category: 'pendidikan',
    description:
      'Dosen menjalankan tridharma perguruan tinggi: pengajaran, penelitian, dan pengabdian masyarakat. Karier akademik di Indonesia menawarkan stabilitas dan kebebasan intelektual yang unik. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 5000000, max: 25000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S2',
    hollandCodes: ['I', 'S', 'A'],
    commonPersonalities: ['intj', 'infj', 'intp', 'holland-i', 'holland-s'],
    requiredSkills: [
      'Keahlian mendalam di bidang spesialisasi',
      'Kemampuan mengajar dan fasilitasi kelas',
      'Penelitian akademik dan penulisan karya ilmiah',
      'Pembimbingan mahasiswa',
    ],
    relatedMajors: ['psikologi', 'teknik-informatika', 'manajemen'],
    growthOutlook: 'Sedang',
    seoTitle: 'Karier Dosen di Indonesia — Jalur Akademik dan Prospek | Sekil.id',
    seoDescription:
      'Panduan karier Dosen di Indonesia: kualifikasi minimum (S2), jenjang karier akademik, gaji, dan peluang di perguruan tinggi negeri vs swasta.',
    primaryKeyword: 'karier dosen',
  },
  {
    slug: 'education-consultant',
    name: 'Education Consultant',
    category: 'pendidikan',
    description:
      'Education Consultant membantu siswa dan keluarga dalam pengambilan keputusan pendidikan — dari pemilihan sekolah hingga persiapan masuk perguruan tinggi dalam dan luar negeri. Conten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 5000000, max: 20000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['S', 'E', 'I'],
    commonPersonalities: ['enfj', 'entj', 'esfj', 'holland-s', 'holland-e'],
    requiredSkills: [
      'Pengetahuan sistem pendidikan Indonesia dan internasional',
      'Konseling dan coaching karier pendidikan',
      'Kemampuan presentasi dan pelatihan',
      'Jaringan dengan institusi pendidikan',
    ],
    relatedMajors: ['psikologi', 'pendidikan-guru-sd', 'komunikasi'],
    growthOutlook: 'Tinggi',
    seoTitle: 'Karier Education Consultant di Indonesia — Prospek dan Skill | Sekil.id',
    seoDescription:
      'Panduan karier Education Consultant di Indonesia: skill yang dibutuhkan, gaji, pasar kerja, dan peluang di era ekspansi pendidikan internasional.',
    primaryKeyword: 'karier education consultant',
  },

  // ────────────────────────────────────────
  // Kreatif (4)
  // ────────────────────────────────────────
  {
    slug: 'graphic-designer',
    name: 'Graphic Designer',
    category: 'kreatif',
    description:
      'Graphic Designer menciptakan komunikasi visual — dari identitas brand hingga materi iklan digital. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 4000000, max: 18000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['A', 'R', 'E'],
    commonPersonalities: ['isfp', 'infp', 'enfp', 'esfp', 'holland-a', 'holland-r'],
    requiredSkills: [
      'Adobe Creative Suite (Illustrator, Photoshop, InDesign)',
      'Prinsip desain visual dan tipografi',
      'Branding dan identitas visual',
      'Desain untuk media digital dan cetak',
    ],
    relatedMajors: ['desain-komunikasi-visual', 'arsitektur'],
    growthOutlook: 'Sedang',
    seoTitle: 'Karier Graphic Designer di Indonesia — Gaji dan Prospek | Sekil.id',
    seoDescription:
      'Panduan karier Graphic Designer di Indonesia: rata-rata gaji, skill yang dibutuhkan, portfolio tips, dan peluang di agensi dan startup.',
    primaryKeyword: 'karier graphic designer',
  },
  {
    slug: 'content-creator',
    name: 'Content Creator',
    category: 'kreatif',
    description:
      'Content Creator memproduksi konten digital — tulisan, video, podcast, atau visual — untuk platform digital. Di Indonesia dengan penetrasi media sosial yang tinggi, karier ini menawarkan peluang monetisasi yang semakin besar. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 3000000, max: 30000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['A', 'E', 'S'],
    commonPersonalities: ['enfp', 'esfp', 'isfp', 'infp', 'holland-a', 'holland-e'],
    requiredSkills: [
      'Produksi konten (video editing, writing, fotografi)',
      'Pemahaman algoritma platform digital',
      'Strategi konten dan engagement',
      'Personal branding',
      'Monetisasi konten',
    ],
    relatedMajors: ['komunikasi', 'desain-komunikasi-visual'],
    growthOutlook: 'Sangat Tinggi',
    seoTitle: 'Karier Content Creator di Indonesia — Prospek dan Tips | Sekil.id',
    seoDescription:
      'Panduan karier Content Creator di Indonesia: platform, monetisasi, skill yang dibutuhkan, dan cara membangun karier berkelanjutan di industri konten digital.',
    primaryKeyword: 'karier content creator',
  },
  {
    slug: 'copywriter',
    name: 'Copywriter',
    category: 'kreatif',
    description:
      'Copywriter menulis konten persuasif untuk keperluan marketing dan periklanan — dari tagline iklan hingga email campaign. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 4000000, max: 18000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['A', 'E', 'I'],
    commonPersonalities: ['infp', 'enfp', 'isfp', 'entp', 'holland-a', 'holland-e'],
    requiredSkills: [
      'Penulisan persuasif dan storytelling',
      'Pemahaman psikologi konsumen',
      'SEO copywriting',
      'Riset dan tone of voice brand',
    ],
    relatedMajors: ['komunikasi', 'sastra-inggris'],
    growthOutlook: 'Sedang',
    seoTitle: 'Karier Copywriter di Indonesia — Gaji dan Prospek | Sekil.id',
    seoDescription:
      'Panduan karier Copywriter di Indonesia: rata-rata gaji, skill penulisan yang dibutuhkan, perbedaan copywriter vs content writer, dan peluang karier.',
    primaryKeyword: 'karier copywriter',
  },
  {
    slug: 'film-director',
    name: 'Sutradara (Film Director)',
    category: 'kreatif',
    description:
      'Sutradara memimpin seluruh proses kreatif produksi film atau video — dari konseptualisasi hingga pasca-produksi. Industri film Indonesia sedang tumbuh pesat. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 5000000, max: 50000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['A', 'E', 'I'],
    commonPersonalities: ['enfj', 'entj', 'enfp', 'holland-a', 'holland-e'],
    requiredSkills: [
      'Visual storytelling dan sinematografi',
      'Kepemimpinan tim kreatif',
      'Penulisan skrip dan adaptasi narasi',
      'Post-production editing',
    ],
    relatedMajors: ['komunikasi', 'desain-komunikasi-visual'],
    growthOutlook: 'Tinggi',
    seoTitle: 'Karier Sutradara Film di Indonesia — Prospek dan Jalur Karier | Sekil.id',
    seoDescription:
      'Panduan karier Sutradara / Film Director di Indonesia: jalur masuk industri film, skill yang dibutuhkan, dan prospek di era OTT dan streaming.',
    primaryKeyword: 'karier sutradara film',
  },

  // ────────────────────────────────────────
  // Sosial / NGO (2)
  // ────────────────────────────────────────
  {
    slug: 'social-worker',
    name: 'Pekerja Sosial',
    category: 'sosial',
    description:
      'Pekerja Sosial membantu individu, keluarga, dan komunitas dalam menghadapi tantangan sosial dan meningkatkan kualitas hidup. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 3500000, max: 12000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['S', 'A', 'I'],
    commonPersonalities: ['infj', 'infp', 'enfj', 'isfj', 'holland-s'],
    requiredSkills: [
      'Asesmen kebutuhan klien dan komunitas',
      'Teknik konseling dan pendampingan sosial',
      'Pemahaman kebijakan sosial Indonesia',
      'Manajemen kasus dan dokumentasi',
    ],
    relatedMajors: ['sosiologi', 'psikologi'],
    growthOutlook: 'Sedang',
    seoTitle: 'Karier Pekerja Sosial di Indonesia — Prospek dan Kualifikasi | Sekil.id',
    seoDescription:
      'Panduan karier Pekerja Sosial di Indonesia: kualifikasi, bidang kerja (pemerintah, NGO, RS), gaji, dan prospek di sektor sosial.',
    primaryKeyword: 'karier pekerja sosial',
  },
  {
    slug: 'ngo-program-manager',
    name: 'NGO Program Manager',
    category: 'sosial',
    description:
      'NGO Program Manager merencanakan, mengimplementasikan, dan mengevaluasi program sosial di organisasi non-profit. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 6000000, max: 20000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1/S2',
    hollandCodes: ['S', 'E', 'I'],
    commonPersonalities: ['enfj', 'infj', 'entj', 'holland-s', 'holland-e'],
    requiredSkills: [
      'Project management dan monitoring evaluasi',
      'Penulisan proposal dan laporan donor',
      'Manajemen anggaran',
      'Koordinasi dengan stakeholder',
    ],
    relatedMajors: ['sosiologi', 'manajemen', 'hubungan-internasional'],
    growthOutlook: 'Sedang',
    seoTitle: 'Karier NGO Program Manager di Indonesia — Prospek dan Skill | Sekil.id',
    seoDescription:
      'Panduan karier NGO Program Manager di Indonesia: skill yang dibutuhkan, gaji di sektor non-profit, dan peluang di LSM lokal dan internasional.',
    primaryKeyword: 'karier ngo program manager',
  },

  // ────────────────────────────────────────
  // Hukum (2)
  // ────────────────────────────────────────
  {
    slug: 'pengacara',
    name: 'Pengacara (Advokat)',
    category: 'hukum',
    description:
      'Pengacara memberikan nasihat hukum dan mewakili klien dalam proses hukum. Di Indonesia, profesi advokat diatur oleh UU No. 18 Tahun 2003. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 5000000, max: 80000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'Profesi',
    hollandCodes: ['E', 'I', 'S'],
    commonPersonalities: ['entj', 'intj', 'entp', 'estj', 'holland-e', 'holland-i'],
    requiredSkills: [
      'Ilmu hukum dan jurisprudeni Indonesia',
      'Litigasi dan negosiasi',
      'Legal research dan penulisan dokumen hukum',
      'Komunikasi persuasif',
    ],
    relatedMajors: ['hukum'],
    growthOutlook: 'Sedang',
    seoTitle: 'Karier Pengacara di Indonesia — Jalur Profesi dan Prospek | Sekil.id',
    seoDescription:
      'Panduan karier Pengacara / Advokat di Indonesia: jalur pendidikan, PKPA, ujian profesi, spesialisasi hukum, dan prospek karier.',
    primaryKeyword: 'karier pengacara',
  },
  {
    slug: 'compliance-officer',
    name: 'Compliance Officer',
    category: 'hukum',
    description:
      'Compliance Officer memastikan organisasi beroperasi sesuai regulasi yang berlaku — dari regulasi OJK untuk sektor keuangan hingga PDPA dan kebijakan internal. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 8000000, max: 30000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['C', 'E', 'I'],
    commonPersonalities: ['istj', 'estj', 'intj', 'holland-c', 'holland-e'],
    requiredSkills: [
      'Pemahaman regulasi industri (OJK, BI, BPOM, dll)',
      'Risk assessment dan audit internal',
      'Penulisan kebijakan dan prosedur',
      'Kemampuan investigasi dan pelaporan',
    ],
    relatedMajors: ['hukum', 'akuntansi', 'manajemen'],
    growthOutlook: 'Tinggi',
    seoTitle: 'Karier Compliance Officer di Indonesia — Gaji dan Prospek | Sekil.id',
    seoDescription:
      'Panduan karier Compliance Officer di Indonesia: gaji, skill yang dibutuhkan, regulasi yang relevan, dan peluang di sektor keuangan dan korporat.',
    primaryKeyword: 'karier compliance officer',
  },

  // ────────────────────────────────────────
  // Teknik (2)
  // ────────────────────────────────────────
  {
    slug: 'civil-engineer',
    name: 'Insinyur Sipil',
    category: 'teknik',
    description:
      'Insinyur Sipil merancang, membangun, dan mengawasi proyek infrastruktur — dari jalan dan jembatan hingga gedung dan sistem drainase. Proyek infrastruktur masif pemerintah Indonesia menciptakan demand yang tinggi. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 6000000, max: 25000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['R', 'I', 'C'],
    commonPersonalities: ['istp', 'istj', 'intj', 'estj', 'holland-r', 'holland-i'],
    requiredSkills: [
      'Pemodelan struktur (AutoCAD, SAP2000, ETABS)',
      'Manajemen proyek konstruksi',
      'Analisis tanah dan geoteknik',
      'Regulasi bangunan Indonesia (SNI)',
    ],
    relatedMajors: ['teknik-sipil'],
    growthOutlook: 'Tinggi',
    seoTitle: 'Karier Insinyur Sipil di Indonesia — Gaji dan Prospek | Sekil.id',
    seoDescription:
      'Panduan karier Insinyur Sipil di Indonesia: rata-rata gaji, skill yang dibutuhkan, spesialisasi, dan peluang di proyek infrastruktur pemerintah.',
    primaryKeyword: 'karier insinyur sipil',
  },
  {
    slug: 'mechanical-engineer',
    name: 'Insinyur Mesin',
    category: 'teknik',
    description:
      'Insinyur Mesin merancang, menganalisis, dan memproduksi sistem mekanis — dari mesin industri hingga produk konsumer. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 6000000, max: 25000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['R', 'I', 'C'],
    commonPersonalities: ['istp', 'istj', 'intj', 'intp', 'holland-r', 'holland-i'],
    requiredSkills: [
      'CAD/CAM (SolidWorks, AutoCAD)',
      'Analisis elemen hingga (FEA)',
      'Termodinamika dan mekanika fluida',
      'Manajemen proyek manufaktur',
    ],
    relatedMajors: ['teknik-mesin'],
    growthOutlook: 'Sedang',
    seoTitle: 'Karier Insinyur Mesin di Indonesia — Gaji dan Prospek | Sekil.id',
    seoDescription:
      'Panduan karier Insinyur Mesin di Indonesia: rata-rata gaji, skill yang dibutuhkan, industri yang membutuhkan, dan prospek di era industri 4.0.',
    primaryKeyword: 'karier insinyur mesin',
  },

  // ────────────────────────────────────────
  // Keuangan (1)
  // ────────────────────────────────────────
  {
    slug: 'akuntan',
    name: 'Akuntan',
    category: 'keuangan',
    description:
      'Akuntan mencatat, menganalisis, dan melaporkan informasi keuangan untuk membantu pengambilan keputusan bisnis dan memenuhi kewajiban regulasi. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    salaryRange: { min: 5000000, max: 25000000, currency: 'IDR', period: 'per bulan' },
    educationLevel: 'S1',
    hollandCodes: ['C', 'I', 'E'],
    commonPersonalities: ['istj', 'estj', 'intj', 'isfj', 'holland-c', 'holland-i'],
    requiredSkills: [
      'Standar akuntansi Indonesia (PSAK)',
      'Software akuntansi (SAP, MYOB, Accurate)',
      'Perpajakan Indonesia',
      'Audit dan pengendalian internal',
      'Sertifikasi: CA (Chartered Accountant)',
    ],
    relatedMajors: ['akuntansi', 'manajemen'],
    growthOutlook: 'Sedang',
    seoTitle: 'Karier Akuntan di Indonesia — Gaji dan Jalur Profesi | Sekil.id',
    seoDescription:
      'Panduan karier Akuntan di Indonesia: gaji, jalur sertifikasi (CA, CPA), spesialisasi (pajak, audit, manajemen), dan prospek karier.',
    primaryKeyword: 'karier akuntan',
  },
];

export function getCareerBySlug(slug: string): Career | undefined {
  return CAREERS.find((c) => c.slug === slug);
}

export function getAllCareerSlugs(): string[] {
  return CAREERS.map((c) => c.slug);
}

export function getCareersByCategory(category: CareerCategory): Career[] {
  return CAREERS.filter((c) => c.category === category);
}
