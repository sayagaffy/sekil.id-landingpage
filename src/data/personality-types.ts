export type PersonalityCategory = 'mbti' | 'holland';

export interface PersonalityType {
  slug: string;
  type: PersonalityCategory;
  code: string;
  name: string;
  tagline: string;
  description: string;
  coreTraits: string[];
  strengths: string[];
  challenges: string[];
  commonCareers: string[];
  commonMajors: string[];
  relatedProducts: string[];
  seoTitle: string;
  seoDescription: string;
  primaryKeyword: string;
}

export const PERSONALITY_TYPES: PersonalityType[] = [
  // ────────────────────────────────────────
  // MBTI — 16 tipe
  // ────────────────────────────────────────
  {
    slug: 'intj',
    type: 'mbti',
    code: 'INTJ',
    name: 'The Architect',
    tagline: 'Strategis, mandiri, dan berorientasi pada sistem',
    description:
      'INTJ — The Architect — adalah tipe kepribadian yang menggabungkan pemikiran strategis jangka panjang dengan kemampuan analitik yang tajam. Mereka adalah perencana alami yang melihat pola di mana orang lain hanya melihat kekacauan, dan memiliki dorongan kuat untuk mengimplementasikan solusi yang efisien dan elegan. INTJ adalah salah satu tipe paling langka, terutama di kalangan perempuan.',
    coreTraits: [
      'Pemikir jangka panjang yang selalu melihat "big picture"',
      'Sangat analitik — mendekati masalah dengan logika, bukan emosi',
      'Mandiri dan percaya diri pada visi dan penilaian sendiri',
      'Standar tinggi untuk diri sendiri dan orang di sekitarnya',
      'Introvert yang membutuhkan kesendirian untuk memulihkan energi',
    ],
    strengths: [
      'Kemampuan perencanaan strategis yang luar biasa',
      'Tekad kuat untuk menyelesaikan apa yang sudah dimulai',
      'Berpikir kritis dan tidak mudah dipengaruhi opini populer',
      'Efisien dalam bekerja — fokus pada hasil, bukan proses',
    ],
    challenges: [
      'Bisa terlihat arogan atau tidak berempati karena pendekatan yang terlalu rasional',
      'Perfeksionisme yang berlebihan dapat menghambat eksekusi',
      'Kesulitan bekerja dengan orang yang dianggap tidak kompeten',
    ],
    commonCareers: [
      'data-scientist',
      'software-engineer',
      'management-consultant',
      'financial-analyst',
      'business-analyst',
    ],
    commonMajors: ['teknik-informatika', 'statistika', 'ilmu-ekonomi', 'fisika'],
    relatedProducts: ['psyai', 'career-interest', 'leadership-styles-test'],
    seoTitle: 'Kepribadian INTJ The Architect — Karier, Kekuatan, dan Tantangan | Sekil.id',
    seoDescription:
      'Pelajari kepribadian INTJ (The Architect): ciri-ciri, kekuatan, tantangan, karier yang cocok, dan jurusan kuliah ideal untuk tipe INTJ di Indonesia.',
    primaryKeyword: 'kepribadian intj',
  },
  {
    slug: 'intp',
    type: 'mbti',
    code: 'INTP',
    name: 'The Thinker',
    tagline: 'Logis, inovatif, dan selalu ingin tahu',
    description:
      'INTP adalah pemikir analitik yang selalu mencari penjelasan logis untuk segala hal. Mereka unggul dalam mengidentifikasi inkonsistensi dan membangun teori yang kohesif. Konten ini sedang dalam proses pengembangan oleh tim Sekil.id dan akan diperbarui setelah review akademik oleh tim psikologi UNJANI.',
    coreTraits: [
      'Berpikir secara logis dan objektif',
      'Sangat fleksibel dan terbuka terhadap ide baru',
      'Lebih tertarik pada teori daripada praktik sehari-hari',
    ],
    strengths: [
      'Kemampuan analitis yang sangat kuat',
      'Kreativitas dalam memecahkan masalah kompleks',
      'Objektif dan tidak mudah terpengaruh bias emosional',
    ],
    challenges: [
      'Kesulitan menyelesaikan proyek karena selalu menemukan angle baru',
      'Komunikasi kadang terlalu abstrak bagi orang lain',
    ],
    commonCareers: ['data-scientist', 'software-engineer', 'financial-analyst'],
    commonMajors: ['teknik-informatika', 'fisika', 'statistika'],
    relatedProducts: ['psyai', 'career-interest'],
    seoTitle: 'Kepribadian INTP The Thinker — Karier dan Jurusan Ideal | Sekil.id',
    seoDescription:
      'Panduan kepribadian INTP (The Thinker): ciri-ciri, kekuatan, karier yang cocok, dan jurusan kuliah untuk tipe INTP di Indonesia.',
    primaryKeyword: 'kepribadian intp',
  },
  {
    slug: 'entj',
    type: 'mbti',
    code: 'ENTJ',
    name: 'The Commander',
    tagline: 'Pemimpin alami yang berorientasi pada visi besar',
    description:
      'ENTJ adalah pemimpin karismatik yang tegas, ambisius, dan sangat baik dalam mengorganisasi orang dan sumber daya menuju tujuan. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik oleh tim psikologi UNJANI.',
    coreTraits: [
      'Natural leader dengan kemampuan eksekusi yang kuat',
      'Strategis dan berorientasi pada efisiensi',
      'Tegas dalam pengambilan keputusan',
    ],
    strengths: [
      'Kemampuan kepemimpinan dan mobilisasi tim yang luar biasa',
      'Pemikir strategis jangka panjang',
      'Percaya diri dan karismatik',
    ],
    challenges: [
      'Bisa terlalu dominan dan tidak sabar',
      'Kesulitan menerima ketidakefisienan',
    ],
    commonCareers: ['management-consultant', 'business-analyst', 'marketing-analyst'],
    commonMajors: ['manajemen', 'ilmu-ekonomi', 'hukum'],
    relatedProducts: ['psyai', 'leadership-styles-test'],
    seoTitle: 'Kepribadian ENTJ The Commander — Karier dan Jurusan Ideal | Sekil.id',
    seoDescription:
      'Panduan kepribadian ENTJ (The Commander): ciri-ciri, kekuatan, karier yang cocok, dan jurusan kuliah untuk tipe ENTJ di Indonesia.',
    primaryKeyword: 'kepribadian entj',
  },
  {
    slug: 'entp',
    type: 'mbti',
    code: 'ENTP',
    name: 'The Debater',
    tagline: 'Inovatif, energik, dan suka tantangan intelektual',
    description:
      'ENTP adalah pemikir cepat yang suka mendebat ide dan menemukan celah logis dalam argumen. Mereka inovatif dan entrepreneurial. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik oleh tim psikologi UNJANI.',
    coreTraits: [
      'Sangat adaptif dan cepat berpikir',
      'Suka tantangan dan perdebatan intelektual',
      'Inovatif dalam menemukan solusi tidak konvensional',
    ],
    strengths: [
      'Sangat kreatif dan terbuka terhadap perubahan',
      'Kemampuan argumentasi dan persuasi yang kuat',
      'Entrepreneurial mindset yang kuat',
    ],
    challenges: [
      'Kesulitan fokus pada satu hal dalam waktu lama',
      'Bisa terlihat argumentatif atau suka konfrontasi',
    ],
    commonCareers: ['marketing-analyst', 'business-analyst', 'management-consultant'],
    commonMajors: ['manajemen', 'komunikasi', 'ilmu-ekonomi'],
    relatedProducts: ['psyai', 'career-interest'],
    seoTitle: 'Kepribadian ENTP The Debater — Karier dan Jurusan Ideal | Sekil.id',
    seoDescription:
      'Panduan kepribadian ENTP (The Debater): ciri-ciri, kekuatan, karier yang cocok, dan jurusan kuliah untuk tipe ENTP di Indonesia.',
    primaryKeyword: 'kepribadian entp',
  },
  {
    slug: 'infj',
    type: 'mbti',
    code: 'INFJ',
    name: 'The Advocate',
    tagline: 'Visioner empatik yang ingin membuat perbedaan',
    description:
      'INFJ adalah tipe kepribadian paling langka yang menggabungkan intuisi yang tajam dengan empati mendalam. Mereka terdorong untuk membantu orang lain dan mencari makna yang lebih dalam. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik oleh tim psikologi UNJANI.',
    coreTraits: [
      'Sangat empati dan peka terhadap perasaan orang lain',
      'Memiliki intuisi yang kuat tentang orang dan situasi',
      'Visioner dengan nilai-nilai yang kuat',
    ],
    strengths: [
      'Empati dan kemampuan memahami orang lain yang luar biasa',
      'Kreativitas dan visi jangka panjang yang kuat',
      'Dedikasi tinggi terhadap tujuan yang bermakna',
    ],
    challenges: [
      'Sensitif terhadap konflik dan kritik',
      'Perfeksionisme dan ekspektasi tinggi pada diri sendiri',
    ],
    commonCareers: ['psikolog-klinis', 'social-worker', 'guru-bk'],
    commonMajors: ['psikologi', 'pendidikan-guru-sd', 'sosiologi'],
    relatedProducts: ['psyai', 'emotional-intelligence-test'],
    seoTitle: 'Kepribadian INFJ The Advocate — Karier dan Jurusan Ideal | Sekil.id',
    seoDescription:
      'Panduan kepribadian INFJ (The Advocate): ciri-ciri, kekuatan, karier yang cocok, dan jurusan kuliah untuk tipe INFJ di Indonesia.',
    primaryKeyword: 'kepribadian infj',
  },
  {
    slug: 'infp',
    type: 'mbti',
    code: 'INFP',
    name: 'The Mediator',
    tagline: 'Idealis kreatif yang mencari makna dan koneksi',
    description:
      'INFP adalah idealis yang dipandu oleh nilai-nilai personal yang kuat. Mereka kreatif, empatik, dan selalu mencari cara untuk membuat dunia menjadi tempat yang lebih baik. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik oleh tim psikologi UNJANI.',
    coreTraits: [
      'Dipandu oleh nilai-nilai personal yang kuat',
      'Kreatif dan imajinatif dalam ekspresi diri',
      'Sangat empati dan penuh perhatian',
    ],
    strengths: [
      'Kreativitas dan kemampuan ekspresi yang unik',
      'Empati mendalam dan kemampuan memahami perasaan orang lain',
      'Dedikasi tinggi terhadap nilai dan tujuan bermakna',
    ],
    challenges: [
      'Terlalu idealis sehingga kadang sulit berkompromi',
      'Sensitif terhadap konflik dan kritik yang keras',
    ],
    commonCareers: ['copywriter', 'social-worker', 'guru-bk', 'content-creator'],
    commonMajors: ['psikologi', 'sastra-inggris', 'komunikasi'],
    relatedProducts: ['psyai', 'career-interest', 'emotional-intelligence-test'],
    seoTitle: 'Kepribadian INFP The Mediator — Karier dan Jurusan Ideal | Sekil.id',
    seoDescription:
      'Panduan kepribadian INFP (The Mediator): ciri-ciri, kekuatan, karier yang cocok, dan jurusan kuliah untuk tipe INFP di Indonesia.',
    primaryKeyword: 'kepribadian infp',
  },
  {
    slug: 'enfj',
    type: 'mbti',
    code: 'ENFJ',
    name: 'The Protagonist',
    tagline: 'Pemimpin karismatik yang menginspirasi orang lain',
    description:
      'ENFJ adalah pemimpin alami yang hangat, empatik, dan sangat terampil dalam memotivasi orang lain untuk mencapai potensi terbaik mereka. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik oleh tim psikologi UNJANI.',
    coreTraits: [
      'Karismatik dan mampu mempengaruhi orang lain secara positif',
      'Sangat empatik dan peduli terhadap perkembangan orang lain',
      'Terorganisir dan bertanggung jawab',
    ],
    strengths: [
      'Kemampuan komunikasi dan kepemimpinan yang luar biasa',
      'Empati tinggi yang membangun kepercayaan tim',
      'Pandai mengelola dinamika kelompok',
    ],
    challenges: [
      'Terlalu fokus pada kebutuhan orang lain hingga mengabaikan diri sendiri',
      'Sensitif terhadap konflik dan tidak suka disharmoni',
    ],
    commonCareers: ['guru-bk', 'human-resources-specialist', 'management-consultant'],
    commonMajors: ['psikologi', 'manajemen', 'komunikasi'],
    relatedProducts: ['psyai', 'emotional-intelligence-test', 'leadership-styles-test'],
    seoTitle: 'Kepribadian ENFJ The Protagonist — Karier dan Jurusan Ideal | Sekil.id',
    seoDescription:
      'Panduan kepribadian ENFJ (The Protagonist): ciri-ciri, kekuatan, karier yang cocok, dan jurusan kuliah untuk tipe ENFJ di Indonesia.',
    primaryKeyword: 'kepribadian enfj',
  },
  {
    slug: 'enfp',
    type: 'mbti',
    code: 'ENFP',
    name: 'The Campaigner',
    tagline: 'Antusias, kreatif, dan penuh energi sosial',
    description:
      'ENFP adalah jiwa bebas yang antusias dan kreatif, selalu penuh semangat dalam mengeksplorasi ide-ide baru dan koneksi dengan orang lain. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik oleh tim psikologi UNJANI.',
    coreTraits: [
      'Antusias dan penuh energi positif',
      'Sangat kreatif dan penuh ide-ide segar',
      'Empatik dan sangat baik dalam membangun koneksi',
    ],
    strengths: [
      'Kreativitas dan kemampuan brainstorming yang kuat',
      'Kemampuan sosial yang luar biasa — mudah berbaur',
      'Fleksibel dan adaptif terhadap perubahan',
    ],
    challenges: [
      'Kesulitan fokus dan sering loncat dari satu proyek ke proyek lain',
      'Terlalu optimis sehingga kadang kurang realistis',
    ],
    commonCareers: ['content-creator', 'marketing-analyst', 'copywriter'],
    commonMajors: ['komunikasi', 'desain-komunikasi-visual', 'manajemen'],
    relatedProducts: ['psyai', 'career-interest'],
    seoTitle: 'Kepribadian ENFP The Campaigner — Karier dan Jurusan Ideal | Sekil.id',
    seoDescription:
      'Panduan kepribadian ENFP (The Campaigner): ciri-ciri, kekuatan, karier yang cocok, dan jurusan kuliah untuk tipe ENFP di Indonesia.',
    primaryKeyword: 'kepribadian enfp',
  },
  {
    slug: 'istj',
    type: 'mbti',
    code: 'ISTJ',
    name: 'The Logistician',
    tagline: 'Bertanggung jawab, terorganisir, dan dapat diandalkan',
    description:
      'ISTJ adalah tipe yang paling dapat diandalkan — mereka sangat berdedikasi terhadap komitmen, berorientasi pada detail, dan menjunjung tinggi tradisi serta tanggung jawab. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    coreTraits: [
      'Sangat dapat diandalkan dan berkomitmen',
      'Berorientasi pada detail dan akurasi',
      'Menghargai tradisi dan prosedur',
    ],
    strengths: [
      'Dapat diandalkan dan konsisten dalam memenuhi komitmen',
      'Sangat terorganisir dan metodis',
      'Integritas tinggi dan jujur',
    ],
    challenges: [
      'Resistensi terhadap perubahan dan cara baru',
      'Kadang terlalu kaku mengikuti aturan',
    ],
    commonCareers: ['akuntan', 'compliance-officer', 'financial-analyst'],
    commonMajors: ['akuntansi', 'manajemen', 'hukum'],
    relatedProducts: ['psyai', 'career-interest'],
    seoTitle: 'Kepribadian ISTJ The Logistician — Karier dan Jurusan Ideal | Sekil.id',
    seoDescription:
      'Panduan kepribadian ISTJ (The Logistician): ciri-ciri, kekuatan, karier yang cocok, dan jurusan kuliah untuk tipe ISTJ di Indonesia.',
    primaryKeyword: 'kepribadian istj',
  },
  {
    slug: 'isfj',
    type: 'mbti',
    code: 'ISFJ',
    name: 'The Defender',
    tagline: 'Penyayang, loyal, dan selalu siap membantu',
    description:
      'ISFJ adalah tipe yang paling altruistik — mereka hangat, peduli, dan sangat berkomitmen untuk mendukung dan melindungi orang-orang yang mereka cintai. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    coreTraits: [
      'Hangat, penuh perhatian, dan empatik',
      'Sangat loyal dan berkomitmen',
      'Berorientasi pada detail dalam mendukung orang lain',
    ],
    strengths: [
      'Kemampuan empati dan dukungan emosional yang tinggi',
      'Dapat diandalkan dan konsisten',
      'Sangat sabar dan toleran',
    ],
    challenges: [
      'Terlalu mengutamakan orang lain hingga mengabaikan kebutuhan sendiri',
      'Kesulitan mengatakan tidak dan menetapkan batas',
    ],
    commonCareers: ['perawat', 'guru-bk', 'human-resources-specialist'],
    commonMajors: ['psikologi', 'pendidikan-guru-sd', 'ilmu-gizi'],
    relatedProducts: ['psyai', 'emotional-intelligence-test'],
    seoTitle: 'Kepribadian ISFJ The Defender — Karier dan Jurusan Ideal | Sekil.id',
    seoDescription:
      'Panduan kepribadian ISFJ (The Defender): ciri-ciri, kekuatan, karier yang cocok, dan jurusan kuliah untuk tipe ISFJ di Indonesia.',
    primaryKeyword: 'kepribadian isfj',
  },
  {
    slug: 'estj',
    type: 'mbti',
    code: 'ESTJ',
    name: 'The Executive',
    tagline: 'Terorganisir, tegas, dan menjunjung tinggi aturan',
    description:
      'ESTJ adalah administrator dan manajer alami yang percaya pada aturan dan standar yang jelas. Mereka efisien, terpercaya, dan sangat baik dalam mengelola proyek dan orang. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    coreTraits: [
      'Tegas dan berorientasi pada aturan',
      'Sangat terorganisir dan metodis',
      'Tanggung jawab tinggi dan dapat diandalkan',
    ],
    strengths: [
      'Kemampuan manajemen dan organisasi yang kuat',
      'Konsisten dan dapat diandalkan',
      'Ketegasan dalam pengambilan keputusan',
    ],
    challenges: [
      'Kurang fleksibel terhadap cara-cara yang berbeda',
      'Bisa terkesan kaku dan judgemental',
    ],
    commonCareers: ['management-consultant', 'human-resources-specialist', 'supply-chain-manager'],
    commonMajors: ['manajemen', 'akuntansi', 'teknik-industri'],
    relatedProducts: ['psyai', 'leadership-styles-test'],
    seoTitle: 'Kepribadian ESTJ The Executive — Karier dan Jurusan Ideal | Sekil.id',
    seoDescription:
      'Panduan kepribadian ESTJ (The Executive): ciri-ciri, kekuatan, karier yang cocok, dan jurusan kuliah untuk tipe ESTJ di Indonesia.',
    primaryKeyword: 'kepribadian estj',
  },
  {
    slug: 'esfj',
    type: 'mbti',
    code: 'ESFJ',
    name: 'The Consul',
    tagline: 'Peduli, sosial, dan membangun harmoni di sekitarnya',
    description:
      'ESFJ sangat fokus pada kebutuhan orang lain dan membangun harmoni dalam lingkungan sosial mereka. Mereka populer, dapat diandalkan, dan sangat baik dalam peran yang melibatkan dukungan interpersonal. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    coreTraits: [
      'Sangat peduli dan fokus pada kebutuhan orang lain',
      'Sosial dan membangun koneksi dengan mudah',
      'Bertanggung jawab dan menghargai tradisi',
    ],
    strengths: [
      'Kemampuan interpersonal dan dukungan sosial yang kuat',
      'Dapat diandalkan dan berkomitmen',
      'Pandai membangun dan menjaga harmoni kelompok',
    ],
    challenges: [
      'Terlalu peka terhadap kritik dan penolakan',
      'Kesulitan menghadapi konflik secara langsung',
    ],
    commonCareers: ['human-resources-specialist', 'perawat', 'guru-bk'],
    commonMajors: ['psikologi', 'pendidikan-guru-sd', 'komunikasi'],
    relatedProducts: ['psyai', 'emotional-intelligence-test'],
    seoTitle: 'Kepribadian ESFJ The Consul — Karier dan Jurusan Ideal | Sekil.id',
    seoDescription:
      'Panduan kepribadian ESFJ (The Consul): ciri-ciri, kekuatan, karier yang cocok, dan jurusan kuliah untuk tipe ESFJ di Indonesia.',
    primaryKeyword: 'kepribadian esfj',
  },
  {
    slug: 'istp',
    type: 'mbti',
    code: 'ISTP',
    name: 'The Virtuoso',
    tagline: 'Praktis, analitis, dan mahir dalam segala hal teknis',
    description:
      'ISTP adalah pemecah masalah pragmatis yang sangat ahli dalam memahami cara kerja sistem dan mesin. Mereka tenang, observatif, dan sangat efisien saat bekerja dengan tangan. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    coreTraits: [
      'Sangat praktis dan berorientasi pada solusi konkret',
      'Observatif dan analitik terhadap cara kerja sesuatu',
      'Tenang dalam situasi krisis',
    ],
    strengths: [
      'Kemampuan teknis dan pemecahan masalah praktis yang tinggi',
      'Tenang dan efisien di bawah tekanan',
      'Fleksibel dan adaptif',
    ],
    challenges: [
      'Kurang sabar terhadap hal-hal yang dianggap tidak efisien',
      'Kesulitan mengekspresikan emosi',
    ],
    commonCareers: ['software-engineer', 'civil-engineer', 'mechanical-engineer'],
    commonMajors: ['teknik-informatika', 'teknik-mesin', 'teknik-sipil'],
    relatedProducts: ['psyai', 'career-interest'],
    seoTitle: 'Kepribadian ISTP The Virtuoso — Karier dan Jurusan Ideal | Sekil.id',
    seoDescription:
      'Panduan kepribadian ISTP (The Virtuoso): ciri-ciri, kekuatan, karier yang cocok, dan jurusan kuliah untuk tipe ISTP di Indonesia.',
    primaryKeyword: 'kepribadian istp',
  },
  {
    slug: 'isfp',
    type: 'mbti',
    code: 'ISFP',
    name: 'The Adventurer',
    tagline: 'Artistik, fleksibel, dan hidup penuh dalam momen',
    description:
      'ISFP — The Adventurer — adalah jiwa artistik yang tenang namun penuh semangat. Mereka sangat sensitif terhadap keindahan di sekitar mereka, dan mengekspresikan diri melalui tindakan dan kreasi yang estetis. ISFP hidup di momen sekarang, fleksibel, dan sangat menghargai kebebasan dan autentisitas. Mereka adalah kolaborator yang hangat meski tidak suka tampil ke depan.',
    coreTraits: [
      'Artistik dan memiliki estetika yang sangat berkembang',
      'Fleksibel dan spontan — suka mengalir bersama situasi',
      'Hangat dan penuh perhatian meski jarang mengekspresikannya secara verbal',
      'Sangat terhubung dengan nilai-nilai personal dan autentisitas',
      'Praktis dan berorientasi pada pengalaman nyata',
    ],
    strengths: [
      'Kreativitas dan sensitivitas estetika yang tinggi',
      'Sangat adaptif dan tidak kaku terhadap perubahan',
      'Empati tulus yang terasa natural, bukan performatif',
      'Baik dalam pekerjaan yang membutuhkan ketelitian sensoris',
    ],
    challenges: [
      'Menghindari konflik bahkan ketika perlu dihadapi',
      'Kesulitan merencanakan jangka panjang — lebih suka improvisasi',
      'Sensitif terhadap kritik dan bisa menarik diri',
    ],
    commonCareers: ['graphic-designer', 'content-creator', 'ui-ux-designer', 'copywriter'],
    commonMajors: ['desain-komunikasi-visual', 'komunikasi', 'arsitektur'],
    relatedProducts: ['psyai', 'career-interest'],
    seoTitle: 'Kepribadian ISFP The Adventurer — Karier, Kekuatan, dan Jurusan Ideal | Sekil.id',
    seoDescription:
      'Pelajari kepribadian ISFP (The Adventurer): ciri-ciri, kekuatan, tantangan, karier yang cocok, dan jurusan kuliah untuk tipe ISFP di Indonesia.',
    primaryKeyword: 'kepribadian isfp',
  },
  {
    slug: 'estp',
    type: 'mbti',
    code: 'ESTP',
    name: 'The Entrepreneur',
    tagline: 'Energik, pragmatis, dan tumbuh subur di lapangan',
    description:
      'ESTP adalah tipe paling action-oriented — mereka menyukai risiko, perubahan cepat, dan memecahkan masalah secara langsung di lapangan. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    coreTraits: [
      'Energik dan selalu siap untuk bertindak',
      'Pragmatis dan berorientasi pada hasil nyata',
      'Sangat baik dalam membaca orang dan situasi',
    ],
    strengths: [
      'Kemampuan eksekusi cepat dan decisive',
      'Sangat adaptif terhadap situasi yang berubah',
      'Kemampuan negosiasi dan persuasi yang tinggi',
    ],
    challenges: [
      'Kesulitan dengan komitmen jangka panjang',
      'Kadang terlalu impulsif dalam pengambilan keputusan',
    ],
    commonCareers: ['marketing-analyst', 'management-consultant', 'supply-chain-manager'],
    commonMajors: ['manajemen', 'kewirausahaan', 'komunikasi'],
    relatedProducts: ['psyai', 'leadership-styles-test'],
    seoTitle: 'Kepribadian ESTP The Entrepreneur — Karier dan Jurusan Ideal | Sekil.id',
    seoDescription:
      'Panduan kepribadian ESTP (The Entrepreneur): ciri-ciri, kekuatan, karier yang cocok, dan jurusan kuliah untuk tipe ESTP di Indonesia.',
    primaryKeyword: 'kepribadian estp',
  },
  {
    slug: 'esfp',
    type: 'mbti',
    code: 'ESFP',
    name: 'The Entertainer',
    tagline: 'Spontan, antusias, dan penuh semangat hidup',
    description:
      'ESFP menikmati hidup sepenuhnya — mereka spontan, sosial, dan selalu membawa energi positif ke lingkungan sekitar. Mereka tumbuh subur dalam situasi yang melibatkan interaksi manusia dan ekspresi diri. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    coreTraits: [
      'Spontan dan fleksibel',
      'Sangat sosial dan menikmati interaksi manusia',
      'Penuh semangat dan energi positif',
    ],
    strengths: [
      'Kemampuan sosial dan komunikasi yang sangat kuat',
      'Kreatif dan penuh energi',
      'Sangat baik dalam situasi yang membutuhkan improvisasi',
    ],
    challenges: [
      'Kesulitan dengan perencanaan jangka panjang',
      'Sensitif terhadap kritik dan konflik',
    ],
    commonCareers: ['content-creator', 'marketing-analyst', 'graphic-designer'],
    commonMajors: ['komunikasi', 'desain-komunikasi-visual', 'kewirausahaan'],
    relatedProducts: ['psyai', 'career-interest'],
    seoTitle: 'Kepribadian ESFP The Entertainer — Karier dan Jurusan Ideal | Sekil.id',
    seoDescription:
      'Panduan kepribadian ESFP (The Entertainer): ciri-ciri, kekuatan, karier yang cocok, dan jurusan kuliah untuk tipe ESFP di Indonesia.',
    primaryKeyword: 'kepribadian esfp',
  },

  // ────────────────────────────────────────
  // Minat Vokasional — 6 tipe
  // ────────────────────────────────────────
  {
    slug: 'holland-r',
    type: 'holland',
    code: 'R',
    name: 'Realistic (Realistik)',
    tagline: 'Praktis, teknis, dan berorientasi pada hal nyata',
    description:
      'Tipe Realistic menyukai pekerjaan yang melibatkan benda, mesin, alat, dan aktivitas fisik. Mereka cenderung praktis, atletis, dan menyukai pekerjaan dengan hasil yang konkret dan terukur. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    coreTraits: [
      'Berorientasi pada benda fisik dan hasil nyata',
      'Praktis dan teknis dalam pendekatan',
      'Lebih suka bekerja dengan tangan daripada dengan ide abstrak',
    ],
    strengths: [
      'Kemampuan teknis dan mekanikal yang tinggi',
      'Pragmatis dan berorientasi pada solusi nyata',
      'Konsisten dan dapat diandalkan dalam pekerjaan fisik',
    ],
    challenges: [
      'Kurang nyaman dengan pekerjaan yang melibatkan banyak interaksi sosial',
      'Kurang sabar dengan abstraksi dan teori',
    ],
    commonCareers: ['civil-engineer', 'mechanical-engineer', 'software-engineer'],
    commonMajors: ['teknik-sipil', 'teknik-mesin', 'teknik-elektro'],
    relatedProducts: ['career-interest', 'psyai'],
    seoTitle: 'Minat Vokasional R (Realistic) — Karier dan Jurusan yang Cocok | Sekil.id',
    seoDescription:
      'Panduan tipe Minat Vokasional Realistic (R): ciri-ciri, karier yang cocok, dan jurusan kuliah untuk profil minat Realistic di Indonesia.',
    // KEYWORD_PENDING: ganti token di bawah dengan keyword final setelah verifikasi volume via Autocomplete/Ubersuggest
    primaryKeyword: '__NEEDS_KEYWORD_VERIFY__ tes minat bakat teknik',
  },
  {
    slug: 'holland-i',
    type: 'holland',
    code: 'I',
    name: 'Investigative (Investigatif)',
    tagline: 'Analitis, intelektual, dan selalu ingin menggali lebih dalam',
    description:
      'Tipe Investigative adalah pemikir analitik yang terdorong oleh rasa ingin tahu intelektual. Mereka sangat menikmati riset, analisis, dan pemecahan masalah yang kompleks — dan lebih nyaman bekerja dengan ide dan data daripada dengan orang atau benda fisik. Tipe I adalah fondasi dari profesi-profesi akademik dan saintifik di seluruh dunia.',
    coreTraits: [
      'Sangat terdorong oleh rasa ingin tahu intelektual',
      'Analitis dan metodis dalam mendekati masalah',
      'Lebih suka bekerja secara mandiri dengan data dan ide',
      'Skeptis secara konstruktif — selalu mencari bukti sebelum menerima klaim',
      'Menikmati kedalaman dibanding keluasan',
    ],
    strengths: [
      'Kemampuan riset dan analisis mendalam yang kuat',
      'Objektif dan tidak mudah dipengaruhi opini populer',
      'Konsisten dalam mengikuti metodologi yang ketat',
      'Sangat baik dalam pekerjaan yang membutuhkan presisi tinggi',
    ],
    challenges: [
      'Kurang nyaman dalam situasi yang membutuhkan banyak interaksi sosial',
      'Dapat terlihat terlalu kritis atau skeptis terhadap ide orang lain',
      'Kadang terlalu terpaku pada analisis hingga lambat mengambil tindakan',
    ],
    commonCareers: ['data-scientist', 'financial-analyst', 'dokter-umum', 'business-analyst'],
    commonMajors: ['teknik-informatika', 'statistika', 'kedokteran', 'fisika', 'psikologi'],
    relatedProducts: ['career-interest', 'psyai', 'path-finder-ai'],
    seoTitle: 'Minat Vokasional I (Investigative) — Karier dan Jurusan yang Cocok | Sekil.id',
    seoDescription:
      'Panduan tipe Minat Vokasional Investigative (I): ciri-ciri, kekuatan, karier yang cocok, dan jurusan kuliah untuk profil minat Investigative di Indonesia.',
    // KEYWORD_PENDING: ganti token di bawah dengan keyword final setelah verifikasi volume via Autocomplete/Ubersuggest
    primaryKeyword: '__NEEDS_KEYWORD_VERIFY__ tes minat bakat sains',
  },
  {
    slug: 'holland-a',
    type: 'holland',
    code: 'A',
    name: 'Artistic (Artistik)',
    tagline: 'Kreatif, ekspresif, dan menghargai orisinalitas',
    description:
      'Tipe Artistic menyukai ekspresi kreatif, estetika, dan lingkungan yang fleksibel. Mereka menghindari struktur kaku dan rutinitas, lebih memilih kebebasan untuk mengeksplorasi dan bereksperimen. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    coreTraits: [
      'Sangat kreatif dan imajinatif',
      'Menghargai orisinalitas dan ekspresi diri',
      'Lebih suka lingkungan yang fleksibel dan tidak terstruktur',
    ],
    strengths: [
      'Kreativitas dan kemampuan estetika yang tinggi',
      'Kemampuan berpikir "outside the box"',
      'Ekspresif dan komunikatif melalui medium kreatif',
    ],
    challenges: [
      'Kurang nyaman dengan pekerjaan yang berulang dan terstruktur',
      'Kadang kesulitan bekerja dalam batasan yang ketat',
    ],
    commonCareers: ['graphic-designer', 'ui-ux-designer', 'content-creator', 'copywriter'],
    commonMajors: ['desain-komunikasi-visual', 'arsitektur', 'komunikasi', 'sastra-inggris'],
    relatedProducts: ['career-interest', 'psyai'],
    seoTitle: 'Minat Vokasional A (Artistic) — Karier dan Jurusan yang Cocok | Sekil.id',
    seoDescription:
      'Panduan tipe Minat Vokasional Artistic (A): ciri-ciri, karier yang cocok, dan jurusan kuliah untuk profil minat Artistic di Indonesia.',
    // KEYWORD_PENDING: ganti token di bawah dengan keyword final setelah verifikasi volume via Autocomplete/Ubersuggest
    primaryKeyword: '__NEEDS_KEYWORD_VERIFY__ tes minat bakat seni',
  },
  {
    slug: 'holland-s',
    type: 'holland',
    code: 'S',
    name: 'Social (Sosial)',
    tagline: 'Empatik, komunikatif, dan terdorong membantu orang lain',
    description:
      'Tipe Social menyukai membantu, mengajar, dan berinteraksi dengan orang lain. Mereka sangat empatik dan berorientasi pada hubungan interpersonal, dan tumbuh subur dalam lingkungan kerja yang melibatkan kolaborasi dan pemberdayaan orang lain. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    coreTraits: [
      'Sangat empatik dan peduli terhadap orang lain',
      'Menikmati mengajar, melatih, dan membimbing',
      'Berorientasi pada hubungan interpersonal',
    ],
    strengths: [
      'Kemampuan komunikasi interpersonal yang sangat kuat',
      'Empati tinggi yang membangun kepercayaan',
      'Sabar dan pandai mendengarkan',
    ],
    challenges: [
      'Kesulitan dalam pekerjaan yang tidak melibatkan orang',
      'Bisa terlalu mengutamakan harmoni hingga menghindari konflik yang perlu',
    ],
    commonCareers: ['guru-bk', 'psikolog-klinis', 'human-resources-specialist', 'social-worker'],
    commonMajors: ['psikologi', 'pendidikan-guru-sd', 'sosiologi', 'komunikasi'],
    relatedProducts: ['career-interest', 'psyai', 'emotional-intelligence-test'],
    seoTitle: 'Minat Vokasional S (Social) — Karier dan Jurusan yang Cocok | Sekil.id',
    seoDescription:
      'Panduan tipe Minat Vokasional Social (S): ciri-ciri, karier yang cocok, dan jurusan kuliah untuk profil minat Social di Indonesia.',
    // KEYWORD_PENDING: ganti token di bawah dengan keyword final setelah verifikasi volume via Autocomplete/Ubersuggest
    primaryKeyword: '__NEEDS_KEYWORD_VERIFY__ tes minat bakat sosial',
  },
  {
    slug: 'holland-e',
    type: 'holland',
    code: 'E',
    name: 'Enterprising (Wirausaha)',
    tagline: 'Ambisius, persuasif, dan berorientasi pada kepemimpinan',
    description:
      'Tipe Enterprising menyukai memimpin, memengaruhi, dan mengambil risiko bisnis. Mereka berorientasi pada kekuasaan, status, dan pencapaian, dan sangat baik dalam pekerjaan yang membutuhkan negosiasi, penjualan, dan kepemimpinan. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    coreTraits: [
      'Ambisius dan berorientasi pada pencapaian',
      'Persuasif dan pandai memengaruhi orang lain',
      'Menyukai kompetisi dan pengambilan risiko terkalkulasi',
    ],
    strengths: [
      'Kemampuan kepemimpinan dan persuasi yang kuat',
      'Entrepreneurial dan berani mengambil inisiatif',
      'Sangat berorientasi pada hasil',
    ],
    challenges: [
      'Bisa terlalu dominan atau kurang mempertimbangkan perasaan orang lain',
      'Kadang mengambil risiko yang terlalu besar',
    ],
    commonCareers: ['marketing-analyst', 'management-consultant', 'supply-chain-manager'],
    commonMajors: ['manajemen', 'kewirausahaan', 'ilmu-ekonomi', 'hukum'],
    relatedProducts: ['career-interest', 'psyai', 'leadership-styles-test'],
    seoTitle: 'Minat Vokasional E (Enterprising) — Karier dan Jurusan yang Cocok | Sekil.id',
    seoDescription:
      'Panduan tipe Minat Vokasional Enterprising (E): ciri-ciri, karier yang cocok, dan jurusan kuliah untuk profil minat Enterprising di Indonesia.',
    // KEYWORD_PENDING: ganti token di bawah dengan keyword final setelah verifikasi volume via Autocomplete/Ubersuggest
    primaryKeyword: '__NEEDS_KEYWORD_VERIFY__ tes minat bakat bisnis',
  },
  {
    slug: 'holland-c',
    type: 'holland',
    code: 'C',
    name: 'Conventional (Konvensional)',
    tagline: 'Terorganisir, teliti, dan bekerja terbaik dalam sistem yang jelas',
    description:
      'Tipe Conventional menyukai keteraturan, prosedur, dan bekerja dalam sistem yang terstruktur. Mereka sangat teliti, dapat diandalkan, dan sangat baik dalam pekerjaan administratif, keuangan, dan analitis yang membutuhkan akurasi tinggi. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    coreTraits: [
      'Terorganisir dan metodis dalam bekerja',
      'Sangat teliti dan berorientasi pada akurasi',
      'Bekerja terbaik dengan instruksi dan prosedur yang jelas',
    ],
    strengths: [
      'Ketelitian dan akurasi yang tinggi',
      'Dapat diandalkan dan konsisten',
      'Sangat baik dalam manajemen data dan administrasi',
    ],
    challenges: [
      'Kurang nyaman dengan ambiguitas dan situasi tidak terstruktur',
      'Resistensi terhadap perubahan yang tiba-tiba',
    ],
    commonCareers: ['akuntan', 'financial-analyst', 'compliance-officer', 'data-analyst'],
    commonMajors: ['akuntansi', 'manajemen', 'statistika', 'sistem-informasi'],
    relatedProducts: ['career-interest', 'psyai'],
    seoTitle: 'Minat Vokasional C (Conventional) — Karier dan Jurusan yang Cocok | Sekil.id',
    seoDescription:
      'Panduan tipe Minat Vokasional Conventional (C): ciri-ciri, karier yang cocok, dan jurusan kuliah untuk profil minat Conventional di Indonesia.',
    // KEYWORD_PENDING: ganti token di bawah dengan keyword final setelah verifikasi volume via Autocomplete/Ubersuggest
    primaryKeyword: '__NEEDS_KEYWORD_VERIFY__ tes minat bakat administrasi',
  },
];

export function getPersonalityBySlug(slug: string): PersonalityType | undefined {
  return PERSONALITY_TYPES.find((p) => p.slug === slug);
}

export function getAllPersonalitySlugs(): string[] {
  return PERSONALITY_TYPES.map((p) => p.slug);
}

export function getPersonalitiesByType(type: PersonalityCategory): PersonalityType[] {
  return PERSONALITY_TYPES.filter((p) => p.type === type);
}
