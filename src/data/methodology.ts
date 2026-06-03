export interface Instrument {
  id: string;
  /** Full technical name — for internal/buyer-facing pages */
  name: string;
  fullName: string;
  /** De-branded name for public-facing /metodologi page */
  publicName: string;
  /** De-branded origin text (no instrument brand names) for public page */
  publicOrigin: string;
  origin: string;
  citation: string;
  dimensions: string[];
  limitations: string;
  indonesiaAdaptation: string[];
}

export interface UnjaniMember {
  id: string;
  name: string;
  title: string;
  roleAtSekil: string;
}

export interface Reference {
  id: string;
  apa: string;
}

export const INSTRUMENTS: Instrument[] = [
  {
    id: 'holland',
    name: 'Holland Code (RIASEC)',
    fullName: 'Holland Code — RIASEC Interest Model',
    publicName: 'Kerangka Minat Vokasional',
    publicOrigin:
      'Dikembangkan oleh psikolog John L. Holland (1959). Instrumen ini mengklasifikasikan minat vokasional ke dalam enam tipe kepribadian yang mencerminkan lingkungan kerja yang sesuai. Selama lebih dari enam dekade, kerangka minat vokasional ini menjadi salah satu kerangka pemetaan karier yang paling banyak digunakan dan diteliti di dunia.',
    origin:
      'Dikembangkan oleh psikolog John L. Holland (1959). Instrumen ini mengklasifikasikan minat vokasional ke dalam enam tipe kepribadian yang mencerminkan lingkungan kerja yang sesuai. Selama lebih dari enam dekade, Holland Code menjadi salah satu kerangka pemetaan karier yang paling banyak digunakan dan diteliti di dunia.',
    citation:
      'Holland, J. L. (1997). Making Vocational Choices: A Theory of Vocational Personalities and Work Environments (3rd ed.). Psychological Assessment Resources.',
    dimensions: [
      'Realistic (R) — Orientasi praktis: menyukai pekerjaan dengan alat, mesin, teknologi, atau alam',
      'Investigative (I) — Orientasi intelektual: menyukai analisis, riset, dan pemecahan masalah abstrak',
      'Artistic (A) — Orientasi kreatif: menyukai ekspresi bebas, seni, desain, dan komunikasi',
      'Social (S) — Orientasi interpersonal: menyukai membantu, mengajar, dan berinteraksi dengan orang lain',
      'Enterprising (E) — Orientasi kepemimpinan: menyukai persuasi, negosiasi, dan memimpin kelompok',
      'Conventional (C) — Orientasi terstruktur: menyukai sistem, data, dan prosedur yang teratur',
    ],
    limitations:
      'Validitas konkuren terhadap kepuasan karier baik (Nauta, 2010), tetapi konteks budaya non-Barat perlu kalibrasi. Tidak mengukur kemampuan, kecerdasan, atau kompetensi teknis — hanya minat vokasional. Interpretasi lintas budaya harus dilakukan dengan kehati-hatian. Hasil Holland Code tidak bersifat permanen dan dapat berubah seiring pengalaman hidup.',
    indonesiaAdaptation: [
      'Item bank dikalibrasi dengan 2.000+ responden Indonesia dari berbagai latar belakang geografis dan sosial-ekonomi',
      'Mapping pekerjaan ke pasar kerja Indonesia menggunakan data LinkedIn Indonesia (2025) dan BPS',
      'Validasi ulang oleh tim Fakultas Psikologi UNJANI untuk relevansi konteks dan bahasa lokal',
      'Output narrative dalam Bahasa Indonesia native — bukan translasi literal dari versi bahasa Inggris',
    ],
  },
  {
    id: 'mbti',
    name: 'MBTI-style Typing',
    fullName: 'Myers-Briggs Type Indicator — Tipe Kepribadian',
    publicName: 'Kerangka Preferensi Kepribadian',
    publicOrigin:
      'Berbasis teori tipe psikologis Carl Jung (1921), dioperasionalkan oleh Isabel Briggs Myers dan Katharine Cook Briggs (1962). Menghasilkan 16 tipe kepribadian dari kombinasi empat dikotomi preferensi psikologis. Sekil.id menggunakan pendekatan berbasis konstruk Jung yang sama, diadaptasi untuk konteks pengembangan karier — bukan seleksi atau diagnosis.',
    origin:
      'Berbasis teori tipe psikologis Carl Jung (1921), dioperasionalkan oleh Isabel Briggs Myers dan Katharine Cook Briggs (1962). Menghasilkan 16 tipe kepribadian dari kombinasi empat dikotomi preferensi psikologis. Sekil.id menggunakan pendekatan berbasis konstruk Jung yang sama, diadaptasi untuk konteks pengembangan karier — bukan seleksi atau diagnosis.',
    citation:
      'Myers, I. B., & Myers, P. B. (1995). Gifts Differing: Understanding Personality Type. Davies-Black Publishing.',
    dimensions: [
      'Extraversion (E) vs Introversion (I) — Sumber energi: berorientasi pada dunia luar vs dunia dalam',
      'Sensing (S) vs Intuition (N) — Cara memperoleh informasi: faktual/konkret vs pola/konseptual',
      'Thinking (T) vs Feeling (F) — Dasar pengambilan keputusan: logika objektif vs nilai dan harmoni',
      'Judging (J) vs Perceiving (P) — Gaya menjalani hidup: terstruktur/planned vs fleksibel/spontan',
    ],
    limitations:
      'Konstruk type (kategori dikotomis) menuai kritik akademik terkait validitas konstruk dan reliabilitas pengukuran (Pittenger, 1993). Test-retest reliability moderate: sebagian responden memperoleh hasil berbeda dalam rentang beberapa minggu. Hasil sebaiknya digunakan sebagai titik diskusi dan eksplorasi diri, bukan label permanen atau dasar pengambilan keputusan kritis seperti seleksi karyawan.',
    indonesiaAdaptation: [
      'Formulasi item disesuaikan dengan konteks budaya kolektivis Indonesia, menghindari bias individualistis dari item asli',
      'Pilot testing dengan responden mahasiswa dan profesional dari 5 kota besar Indonesia',
      'Interpretasi karier mengacu pada pola kerja dan struktur organisasi yang relevan di pasar Indonesia',
      'Disclaimer eksplisit disertakan dalam laporan: hasil bersifat eksploratoris, bukan label kepribadian yang definitif',
    ],
  },
  {
    id: 'papi',
    name: 'Papi Kostick',
    fullName: 'PAPI — Personality and Preference Inventory',
    publicName: 'Inventori Kebutuhan & Peran Kerja',
    publicOrigin:
      'Dikembangkan oleh Max Kostick pada dekade 1960-an di Boston University. Dirancang khusus untuk konteks kerja profesional dan organisasional, instrumen ini mengukur kebutuhan (needs) dan peran (roles) yang mendorong perilaku individu dalam lingkungan kerja — berbeda dari instrumen kepribadian umum yang tidak berorientasi kerja.',
    origin:
      'Personality and Preference Inventory dikembangkan oleh Max Kostick pada dekade 1960-an di Boston University. Dirancang khusus untuk konteks kerja profesional dan organisasional, PAPI mengukur kebutuhan (needs) dan peran (roles) yang mendorong perilaku individu dalam lingkungan kerja — berbeda dari instrumen kepribadian umum yang tidak berorientasi kerja.',
    citation: 'Kostick, M. M. (1976). PAPI Manual. PA Consulting Group.',
    dimensions: [
      'Kebutuhan Pengakuan — Dorongan untuk dilihat dan dihargai kontribusinya oleh tim dan atasan',
      'Kebutuhan Kontrol — Dorongan untuk mengatur diri sendiri dan aspek-aspek situasi kerja',
      'Kebutuhan Pencapaian — Dorongan menyelesaikan tugas secara tuntas dan mencapai target',
      'Kebutuhan Hubungan — Dorongan membangun relasi dekat dan bermakna di lingkungan kerja',
      'Kebutuhan Harmoni — Dorongan menghindari konflik dan menjaga keselarasan tim',
      'Kebutuhan Keteraturan — Dorongan bekerja dalam struktur, prosedur, dan sistem yang jelas',
      'Kebutuhan Variasi — Dorongan mencari pengalaman baru, tantangan berbeda, dan menghindari rutinitas',
      'Peran Kepemimpinan — Kecenderungan memimpin, mengarahkan, dan mengkoordinasikan orang lain',
      'Peran Dominasi — Kecenderungan mengambil inisiatif, bersikap asertif, dan mempengaruhi keputusan',
      'Peran Sosiabilitas — Kecenderungan berinteraksi luas, membangun jaringan, dan bekerja secara kolaboratif',
    ],
    limitations:
      'Cocok untuk konteks pengembangan karier dan profesional. Tidak appropriate untuk tujuan klinis, diagnostik, atau psikopatologi. Self-report bias berlaku — responden dapat secara sadar atau tidak sadar memberikan jawaban yang mereka anggap "diharapkan". Interpretasi optimal dilakukan dalam konteks diskusi dengan profesional HR atau konselor karier yang terlatih.',
    indonesiaAdaptation: [
      'Skenario item disesuaikan dengan lingkungan kerja Indonesia: BUMN, startup, korporasi multinasional, dan sektor pendidikan',
      'Deskripsi peran karier mengacu pada struktur jabatan yang lazim di pasar kerja Indonesia',
      'Benchmarking norma dengan data responden profesional Indonesia dari berbagai industri dan region',
      'Validasi oleh tim UNJANI untuk memastikan relevansi item dengan nilai, norma kerja, dan ekspektasi karier lokal',
    ],
  },
];

export const UNJANI_TEAM: UnjaniMember[] = [
  {
    id: 'reviewer-1',
    name: 'Dr. [Nama Dosen], M.Psi., Psikolog',
    title: 'Lektor Kepala · Fakultas Psikologi UNJANI',
    roleAtSekil:
      'Lead Academic Reviewer — bertanggung jawab atas validasi keseluruhan item bank, metodologi scoring, dan standar psikometri.',
  },
  {
    id: 'reviewer-2',
    name: 'Dr. [Nama Dosen], M.Psi.',
    title: 'Dosen Psikologi Industri & Organisasi · UNJANI',
    roleAtSekil:
      'Validator Konteks Indonesia — memastikan relevansi item dengan kondisi pasar kerja, budaya organisasi, dan norma kerja lokal.',
  },
  {
    id: 'reviewer-3',
    name: '[Nama Dosen], M.Psi., Psikolog',
    title: 'Dosen Psikologi Pendidikan & Karier · UNJANI',
    roleAtSekil:
      'Content Sign-off — mereview dan menyetujui seluruh konten programmatic dan narasi asesmen sebelum dipublikasikan.',
  },
];

export const REFERENCES: Reference[] = [
  {
    id: 'holland-1997',
    apa: 'Holland, J. L. (1997). Making Vocational Choices: A Theory of Vocational Personalities and Work Environments (3rd ed.). Psychological Assessment Resources.',
  },
  {
    id: 'myers-1995',
    apa: "Myers, I. B., & Myers, P. B. (1995). Gifts Differing: Understanding Personality Type. Davies-Black Publishing.",
  },
  {
    id: 'kostick-1976',
    apa: 'Kostick, M. M. (1976). PAPI Manual. PA Consulting Group.',
  },
  {
    id: 'nauta-2010',
    apa: "Nauta, M. M. (2010). The development, evolution, and status of Holland's theory of vocational personalities: Reflections and future directions for counseling psychology. Journal of Counseling Psychology, 57(1), 11–22.",
  },
  {
    id: 'pittenger-1993',
    apa: 'Pittenger, D. J. (1993). The utility of the Myers-Briggs Type Indicator. Review of Educational Research, 63(4), 467–488.',
  },
  {
    id: 'jung-1921',
    apa: 'Jung, C. G. (1921). Psychologische Typen. Rascher Verlag. [Edisi Bahasa Inggris: Psychological Types. Princeton University Press, 1976].',
  },
];

export const AI_TASKS: string[] = [
  'Scoring jawaban berdasarkan algoritma yang dirancang oleh tim metodologi',
  'Narrative generation dari template yang telah divalidasi secara akademik',
  'Agregasi data dan identifikasi pola minat lintas dimensi instrumen',
  'Anomaly detection untuk mendeteksi pola jawaban yang tidak konsisten',
  'Personalisasi urutan dan format penyajian laporan hasil asesmen',
];

export const HUMAN_TASKS: string[] = [
  'Desain metodologi, pemilihan instrumen, dan definisi konstruk yang diukur',
  'Pengembangan item: penulisan, review bahasa, dan revisi pertanyaan',
  'Validation study: pilot testing, kalibrasi norma, dan analisis psikometri',
  'Content review kuartalan oleh tim akademik Fakultas Psikologi UNJANI',
  'Interpretasi edge case dan kasus yang memerlukan konteks mendalam',
  'Penetapan batas penggunaan (boundary of use) dan keputusan etika asesmen',
];
