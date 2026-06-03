export type TargetPersona = 'siswa-sma' | 'mahasiswa' | 'fresh-grad' | 'karyawan' | 'manager';
export type InstrumentKey = 'holland' | 'mbti' | 'papi';

export interface Product {
  slug: string;
  name: string;
  nameDisplay: string;
  tagline: string;
  description: string;
  longDescription: string;
  duration: string;
  price: number;
  priceDisplay: string;
  targetPersonas: TargetPersona[];
  instruments: InstrumentKey[];
  outputs: string[];
  sampleReportTeaser: string;
  bundleSuggestions: string[];
  faq: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
  primaryKeyword: string;
}

export const PRODUCTS: Product[] = [
  {
    slug: 'career-interest',
    name: 'Career Interest',
    nameDisplay: 'Career Interest — Peta Minat Karier',
    tagline: 'Temukan arah karier yang paling sesuai dengan profil minat vokasional Anda',
    description:
      'Tes minat karier menggunakan asesmen vokasional tervalidasi akademik untuk siswa SMA dan mahasiswa. Dapatkan profil minat 6 dimensi dan rekomendasi karier yang sesuai dengan profil unik Anda dalam 15 menit.',
    longDescription:
      'Career Interest menggunakan kerangka minat vokasional yang telah divalidasi akademik selama 60+ tahun untuk memetakan preferensi karier Anda. Dalam 15 menit, Anda mendapatkan profil unik yang mencerminkan kombinasi minat vokasional Anda, beserta rekomendasi karier dan jurusan yang paling sesuai — semuanya dikalibrasi untuk konteks pasar kerja Indonesia menggunakan data LinkedIn 2025.',
    duration: '15 menit',
    price: 150000,
    priceDisplay: 'Rp 150.000',
    targetPersonas: ['siswa-sma', 'mahasiswa'],
    instruments: ['holland'],
    outputs: [
      'Profil minat vokasional unik Anda dengan breakdown visual 6 dimensi',
      'Top 10 rekomendasi karier yang match dengan profil minat',
      'Rekomendasi 5 jurusan kuliah yang paling relevan',
      'Deskripsi lingkungan kerja yang paling cocok untuk profil vokasional Anda',
      'Narasi kepribadian karier yang dipersonalisasi (500+ kata)',
      'Laporan PDF 10+ halaman dalam Bahasa Indonesia',
    ],
    sampleReportTeaser:
      'Laporan Career Interest Anda mencakup: breakdown visual enam dimensi minat dalam format spider chart, narasi kepribadian vokasional yang dipersonalisasi, tabel 10 karier yang paling match dengan tingkat kecocokan dan proyeksi pertumbuhan industri hingga 2030, serta rekomendasi 5 jurusan kuliah dengan alasan spesifik mengapa jurusan tersebut sesuai dengan profil Anda.',
    bundleSuggestions: ['psyai', 'path-finder-ai'],
    faq: [
      {
        q: 'Bagaimana tes ini mengidentifikasi minat karier saya?',
        a: 'Asesmen ini menggunakan kerangka minat vokasional enam-dimensi yang dikembangkan psikolog John L. Holland (1959) dan telah diteliti selama 60+ tahun. Enam dimensi — Realistic, Investigative, Artistic, Social, Enterprising, Conventional — mencerminkan tipe minat dan lingkungan kerja yang sesuai. Kombinasi dimensi tertinggi Anda menghasilkan profil unik yang memandu eksplorasi karier.',
      },
      {
        q: 'Berapa lama tes Career Interest berlangsung?',
        a: '15 menit. Tes terdiri dari serangkaian pertanyaan preferensi aktivitas yang ringkas dan dapat diselesaikan dalam satu sesi di laptop atau smartphone. Tidak ada jawaban benar atau salah — yang penting Anda menjawab jujur sesuai preferensi asli Anda.',
      },
      {
        q: 'Siapa yang paling cocok mengikuti tes ini?',
        a: 'Career Interest dirancang untuk siswa SMA kelas 10–12 yang sedang merencanakan pilihan jurusan kuliah, dan mahasiswa yang ingin memvalidasi arah karier mereka. Jika Anda sudah bekerja dan ingin pivot karier, PsyAI atau Leadership Styles Test mungkin lebih sesuai.',
      },
      {
        q: 'Apakah hasil tes bisa berubah seiring waktu?',
        a: 'Ya. Minat vokasional dapat berevolusi seiring pengalaman, pendidikan, dan perkembangan diri. Sebaiknya Anda re-take tes setiap 2–3 tahun atau setelah transisi besar (masuk kuliah, berganti bidang studi). Hasil tidak bersifat permanen — ini adalah snapshot minat Anda saat ini, bukan label seumur hidup.',
      },
      {
        q: 'Apakah laporan tersedia dalam Bahasa Indonesia?',
        a: 'Ya, seluruh laporan Career Interest ditulis dalam Bahasa Indonesia native — bukan terjemahan literal dari versi bahasa Inggris. Terminologi karier, referensi universitas, dan prospek gaji disesuaikan dengan konteks pasar kerja Indonesia.',
      },
    ],
    seoTitle: 'Tes Minat Karier Tervalidasi | Career Interest Sekil.id',
    seoDescription:
      'Temukan minat karier Anda dengan asesmen vokasional tervalidasi akademik. 15 menit, dapatkan profil minat dan rekomendasi karier & jurusan untuk konteks Indonesia.',
    primaryKeyword: 'tes minat karier',
  },
  {
    slug: 'psyai',
    name: 'PsyAI',
    nameDisplay: 'PsyAI — Profil Kepribadian Terintegrasi',
    tagline: 'Asesmen kepribadian terintegrasi: minat vokasional dan preferensi kepribadian dalam satu laporan AI',
    description:
      'PsyAI menggabungkan asesmen minat vokasional dan profil kepribadian dalam satu asesmen terintegrasi 25 menit. Dapatkan profil kepribadian komprehensif dengan narasi yang dipersonalisasi AI dan action plan pengembangan diri.',
    longDescription:
      'PsyAI adalah asesmen kepribadian paling komprehensif di Sekil.id. Dengan menggabungkan pemetaan minat vokasional dan preferensi kepribadian berbasis konstruk psikologis Jung, PsyAI menghasilkan satu profil kohesif yang menjelaskan bukan hanya apa yang Anda minati, tapi bagaimana cara Anda bekerja, berkomunikasi, dan berkembang. Narasi laporan dihasilkan AI berbasis template yang divalidasi psikolog UNJANI.',
    duration: '25 menit',
    price: 195000,
    priceDisplay: 'Rp 195.000',
    targetPersonas: ['mahasiswa', 'fresh-grad', 'karyawan'],
    instruments: ['holland', 'mbti'],
    outputs: [
      'Profil minat vokasional 6 dimensi dengan breakdown visual',
      'Arketipe kepribadian karier Anda dari 16 profil yang tersedia',
      'Narasi kepribadian terintegrasi minat × kepribadian yang dipersonalisasi AI',
      'Matriks minat × kepribadian untuk pemetaan karier yang lebih presisi',
      'Action plan pengembangan diri berbasis profil (5 area prioritas)',
      'Panduan wawancara berbasis kepribadian untuk persiapan karier',
      'Laporan PDF 15+ halaman dalam Bahasa Indonesia',
    ],
    sampleReportTeaser:
      'Laporan PsyAI menggabungkan minat vokasional dan profil kepribadian dalam satu narasi kohesif 20+ halaman. Anda mendapatkan: matriks kepribadian × minat yang menjelaskan mengapa profil Anda cenderung gravitate ke lingkungan kerja tertentu, action plan pengembangan diri berbasis profil, dan panduan karier dengan rekomendasi spesifik untuk konteks Indonesia.',
    bundleSuggestions: ['career-interest', 'leadership-styles-test'],
    faq: [
      {
        q: 'Apa yang membedakan PsyAI dari tes kepribadian biasa?',
        a: 'PsyAI menggabungkan dua dimensi asesmen — pemetaan minat vokasional dan profil preferensi kepribadian — dalam satu laporan terintegrasi. Alih-alih dua hasil terpisah, Anda mendapat satu narasi kohesif yang menghubungkan minat, kepribadian, dan arah karier. AI berperan dalam narrative generation berbasis template yang telah divalidasi akademik oleh tim UNJANI.',
      },
      {
        q: 'Apakah AI yang menginterpretasikan hasil kepribadian saya?',
        a: 'Tidak. AI menghasilkan narasi dari template yang dirancang dan divalidasi oleh tim psikolog. AI tidak membuat penilaian klinis atau diagnostik — ia hanya membantu personalisasi bahasa laporan berdasarkan profil Anda. Seluruh framework interpretasi dirancang oleh manusia: tim akademik UNJANI dan psikolog Sekil.id.',
      },
      {
        q: 'Berapa lama proses tes hingga laporan tersedia?',
        a: '25 menit untuk tes, dan laporan tersedia langsung setelah tes selesai. Tidak ada waktu tunggu — sistem menghasilkan laporan secara otomatis. Laporan juga dikirimkan ke email Anda dalam format PDF.',
      },
      {
        q: 'Bisakah laporan PsyAI digunakan untuk proses seleksi karyawan?',
        a: 'Tidak disarankan untuk seleksi karyawan. PsyAI dirancang untuk pengembangan diri dan eksplorasi karier, bukan untuk tujuan seleksi atau penilaian kinerja. Menggunakan tes kepribadian untuk seleksi memiliki implikasi etika dan legal yang kompleks. Untuk konteks HR dan organisasi, konsultasikan dengan psikolog industri berlisensi.',
      },
      {
        q: 'Apa bedanya PsyAI dengan Career Interest?',
        a: 'Career Interest hanya mengukur minat vokasional dan berfokus pada pemetaan arah karier — cocok untuk yang sedang eksplorasi awal. PsyAI menggabungkan minat vokasional dan profil kepribadian, menghasilkan gambaran yang lebih holistik dengan narrative AI. Jika Anda sudah tahu bidang yang diminati dan ingin memahami kepribadian kerja secara lebih mendalam, PsyAI adalah pilihan yang tepat.',
      },
    ],
    seoTitle: 'Tes Kepribadian AI Terintegrasi | PsyAI Sekil.id',
    seoDescription:
      'PsyAI menggabungkan pemetaan minat vokasional dan profil kepribadian dalam satu asesmen terintegrasi. Dapatkan profil kepribadian komprehensif dan action plan karier dalam 25 menit.',
    primaryKeyword: 'tes kepribadian ai',
  },
  {
    slug: 'path-finder-ai',
    name: 'Path Finder AI',
    nameDisplay: 'Path Finder AI — Pilih Jurusan Kuliah',
    tagline: 'Pilih jurusan kuliah dengan data, bukan tebakan',
    description:
      'Path Finder AI membantu siswa SMA memilih jurusan kuliah berdasarkan profil minat vokasional dan preferensi kepribadian. Dapatkan rekomendasi 5 jurusan top match dengan prospek karier dan universitas Indonesia.',
    longDescription:
      'Path Finder AI dirancang khusus untuk siswa SMA yang menghadapi dilema pemilihan jurusan kuliah. Dengan menggabungkan profil minat vokasional dan preferensi kepribadian, Path Finder AI menyilangkan data tersebut dengan informasi jurusan, prospek karier, dan universitas Indonesia — menghasilkan rekomendasi yang personal dan berbasis data, bukan intuisi semata.',
    duration: '20 menit',
    price: 150000,
    priceDisplay: 'Rp 150.000',
    targetPersonas: ['siswa-sma'],
    instruments: ['holland', 'mbti'],
    outputs: [
      'Top 5 jurusan kuliah yang paling match dengan profil minat dan kepribadian Anda',
      'Analisis kesesuaian per jurusan: mengapa jurusan ini fit dengan profil Anda',
      'Prospek karier dan median gaji untuk setiap jurusan yang direkomendasikan',
      'Rekomendasi universitas Indonesia yang memiliki program tersebut (negeri & swasta)',
      'Tip persiapan masuk jurusan dan kegiatan pendukung karier',
      'Laporan PDF 12+ halaman dalam Bahasa Indonesia',
    ],
    sampleReportTeaser:
      'Laporan Path Finder AI mencakup: ranking 5 jurusan berdasarkan tingkat match dengan profil Anda, analisis satu-halaman per jurusan (prospek kerja, rata-rata gaji 5 tahun pertama, skill yang dibutuhkan, universitas terbaik Indonesia), serta panduan persiapan masuk dan rekomendasi kegiatan ekstrakurikuler yang mendukung karier di bidang tersebut.',
    bundleSuggestions: ['career-interest', 'psyai'],
    faq: [
      {
        q: 'Apakah rekomendasi jurusan Path Finder AI 100% akurat?',
        a: 'Tidak ada tes yang memberikan jaminan akurasi 100%. Path Finder AI memberikan rekomendasi berbasis profil minat vokasional dan kepribadian Anda, disilangkan dengan data pasar kerja dan struktur kurikulum universitas Indonesia. Hasil bersifat indikatif dan dirancang sebagai titik diskusi, bukan keputusan final. Kami merekomendasikan mendiskusikan hasilnya dengan guru BK atau konselor karier.',
      },
      {
        q: 'Dari mana data universitas dan jurusan diambil?',
        a: 'Data jurusan mengacu pada informasi publik Kemendikbudristek, akreditasi BAN-PT, dan LinkedIn Education Insights Indonesia 2025. Rekomendasi universitas bersifat umum berdasarkan reputasi program dan tidak merupakan endorsement atau kemitraan komersial dengan institusi manapun.',
      },
      {
        q: 'Path Finder AI cocok untuk siswa kelas berapa?',
        a: 'Paling optimal untuk siswa kelas 10 (sebelum penjurusan di beberapa sekolah) dan kelas 11-12 yang sedang dalam proses memilih program studi. Mahasiswa semester awal yang ragu dengan jurusan yang sudah dipilih juga dapat menggunakannya sebagai bahan refleksi.',
      },
      {
        q: 'Apakah Path Finder AI menggantikan konsultasi dengan konselor sekolah?',
        a: 'Tidak. Path Finder AI adalah alat bantu eksplorasi, bukan pengganti konsultasi profesional. Kami merekomendasikan menggunakan hasil tes sebagai bahan diskusi dengan guru BK, orang tua, atau konselor karier — bukan sebagai satu-satunya dasar keputusan.',
      },
      {
        q: 'Bagaimana cara mendapatkan laporan setelah tes?',
        a: 'Laporan tersedia langsung setelah tes selesai dalam format PDF yang bisa diunduh dan dibagikan. Laporan juga dikirimkan ke email yang Anda daftarkan. Tidak ada biaya tambahan untuk laporan — sudah termasuk dalam harga tes.',
      },
    ],
    seoTitle: 'Tes Pemilihan Jurusan Kuliah Berbasis AI | Path Finder AI Sekil.id',
    seoDescription:
      'Pilih jurusan kuliah dengan data, bukan tebakan. Path Finder AI menggunakan asesmen minat vokasional dan kepribadian untuk merekomendasikan 5 jurusan terbaik dengan prospek karier Indonesia.',
    primaryKeyword: 'tes pemilihan jurusan kuliah',
  },
  {
    slug: 'leadership-styles-test',
    name: 'Leadership Styles Test',
    nameDisplay: 'Leadership Styles Test — Gaya Kepemimpinan',
    tagline: 'Identifikasi dan kembangkan gaya kepemimpinan Anda berbasis asesmen tervalidasi',
    description:
      'Leadership Styles Test menggunakan asesmen kebutuhan & peran kerja tervalidasi untuk mengidentifikasi 4 gaya kepemimpinan situasional Anda. Dapatkan profil kepemimpinan, matriks strength-blind spot, dan Individual Development Plan dalam 20 menit.',
    longDescription:
      'Leadership Styles Test dirancang untuk karyawan dan manajer yang ingin memahami dan mengembangkan gaya kepemimpinan mereka secara berbasis data. Menggunakan inventori kebutuhan & peran kerja yang merupakan standar industri untuk konteks profesional — tes ini mengidentifikasi gaya kepemimpinan dominan Anda dari 4 profil situasional, lengkap dengan matriks kekuatan, blind spot, dan rencana pengembangan yang dapat langsung diimplementasikan.',
    duration: '20 menit',
    price: 150000,
    priceDisplay: 'Rp 150.000',
    targetPersonas: ['karyawan', 'manager'],
    instruments: ['papi'],
    outputs: [
      'Profil gaya kepemimpinan dominan dari 4 gaya situasional (Direktif, Coaching, Suportif, Delegatif)',
      'Skor 10 dimensi kebutuhan & peran kerja dalam spider chart',
      'Matriks kekuatan (strength) dan titik buta (blind spot) sebagai pemimpin',
      'Panduan konteks tim dan situasi di mana gaya Anda paling efektif',
      'Individual Development Plan (IDP) dengan 5 area pengembangan prioritas',
      'Laporan PDF 12+ halaman dalam Bahasa Indonesia',
    ],
    sampleReportTeaser:
      'Laporan Leadership Styles Test mencakup: profil gaya kepemimpinan dominan dari 4 gaya situasional, skor 10 dimensi profil kepemimpinan dalam spider chart, matriks kekuatan-blind spot dengan contoh situasi nyata, panduan "kapan menggunakan gaya mana" sesuai kematangan tim, dan Individual Development Plan (IDP) dengan 5 area pengembangan yang diprioritaskan.',
    bundleSuggestions: ['psyai', 'emotional-intelligence-test'],
    faq: [
      {
        q: 'Apa saja 4 gaya kepemimpinan yang diukur dalam tes ini?',
        a: 'Leadership Styles Test mengidentifikasi 4 profil berdasarkan prinsip Situational Leadership: (1) Direktif — pemimpin yang memberikan arahan jelas dan terstruktur; (2) Coaching — pemimpin yang mengembangkan kapabilitas tim; (3) Suportif — pemimpin yang membangun kepercayaan dan motivasi tim; (4) Delegatif — pemimpin yang memberikan otonomi penuh kepada tim. Setiap gaya efektif dalam konteks dan tingkat kematangan tim yang berbeda.',
      },
      {
        q: 'Apakah tes ini cocok untuk semua level jabatan?',
        a: 'Tes ini paling relevan untuk supervisor, manajer lini pertama, manajer menengah, dan calon pemimpin (high-potential employee). Untuk fresh graduate atau individual contributor tanpa pengalaman memimpin tim, Career Interest atau PsyAI mungkin lebih sesuai sebagai langkah awal.',
      },
      {
        q: 'Apa dasar ilmiah tes kepemimpinan ini?',
        a: 'Leadership Styles Test menggunakan inventori kebutuhan & peran kerja yang diadaptasi untuk konteks kepemimpinan. Instrumen ini mengukur dimensi kepemimpinan, dominasi, dan orientasi hubungan yang relevan untuk efektivitas manajerial. Telah digunakan dalam konteks pengembangan manajerial selama 50+ tahun dan divalidasi oleh tim Fakultas Psikologi UNJANI untuk konteks Indonesia.',
      },
      {
        q: 'Bisakah hasilnya digunakan untuk program leadership development HRD?',
        a: 'Ya. Laporan Leadership Styles Test mencakup profil gaya kepemimpinan, matriks kekuatan-blind spot, dan IDP yang dapat langsung diintegrasikan ke dalam program People Development. Untuk penggunaan skala organisasi (20+ peserta), hubungi tim Sekil.id melalui halaman Demo untuk penawaran institusional.',
      },
      {
        q: 'Berapa lama berlakunya hasil tes kepemimpinan?',
        a: 'Tidak ada batas waktu formal untuk laporan. Namun gaya kepemimpinan dapat berkembang seiring pengalaman dan pembelajaran. Kami merekomendasikan re-assessment setiap 12–18 bulan, atau setelah transisi peran yang signifikan seperti promosi ke posisi baru.',
      },
    ],
    seoTitle: 'Tes Gaya Kepemimpinan Tervalidasi | Leadership Styles Test Sekil.id',
    seoDescription:
      'Identifikasi gaya kepemimpinan Anda dengan asesmen tervalidasi akademik. Leadership Styles Test menghasilkan profil 4 gaya situasional, matriks strength-blind spot, dan Individual Development Plan.',
    primaryKeyword: 'tes gaya kepemimpinan',
  },
  {
    slug: 'emotional-intelligence-test',
    name: 'Emotional Intelligence Test',
    nameDisplay: 'EQ Test — Kecerdasan Emosional',
    tagline: 'Ukur dan kembangkan Emotional Intelligence untuk karier dan kehidupan',
    description:
      'EQ Test Sekil.id mengukur 4 dimensi kecerdasan emosional (EQ) menggunakan asesmen tervalidasi akademik yang diadaptasi untuk konteks Indonesia. Dapatkan skor EQ, analisis per dimensi, dan development tips yang dapat langsung diterapkan dalam 20 menit.',
    longDescription:
      'Emotional Intelligence Test mengukur empat dimensi kecerdasan emosional yang paling kritis untuk kesuksesan profesional: Self-Awareness, Self-Regulation, Empathy, dan Social Skills. Menggunakan inventori kebutuhan & peran kerja yang diadaptasi oleh tim psikolog UNJANI untuk konteks Indonesia, hasilnya mencakup skor per dimensi, analisis mendalam, dan rencana pengembangan EQ yang konkret dan dapat langsung diterapkan.',
    duration: '20 menit',
    price: 175000,
    priceDisplay: 'Rp 175.000',
    targetPersonas: ['mahasiswa', 'fresh-grad', 'karyawan'],
    instruments: ['papi'],
    outputs: [
      'Skor 4 dimensi EQ: Self-Awareness, Self-Regulation, Empathy, Social Skills (skala 100)',
      'Profil EQ keseluruhan dengan perbandingan terhadap norma responden Indonesia',
      'Analisis mendalam per dimensi dengan contoh perilaku konkret',
      'Identifikasi dimensi EQ terkuat dan yang paling perlu dikembangkan',
      '12 development tips praktis (3 per dimensi) yang dapat langsung diterapkan',
      'Rencana pengembangan EQ 6 bulan yang terstruktur',
      'Laporan PDF 12+ halaman dalam Bahasa Indonesia',
    ],
    sampleReportTeaser:
      'Laporan EQ Test mencakup: skor 4 dimensi EQ dalam skala 100 dengan visualisasi radar, profil EQ keseluruhan dengan perbandingan terhadap norma Indonesia, analisis mendalam per dimensi dengan contoh perilaku konkret, 12 development tips praktis (3 per dimensi) yang dapat mulai diterapkan, dan rencana pengembangan EQ 6 bulan yang terstruktur.',
    bundleSuggestions: ['leadership-styles-test', 'psyai'],
    faq: [
      {
        q: 'Apa itu Emotional Intelligence (EQ) dan mengapa penting?',
        a: 'Emotional Intelligence (EQ) adalah kemampuan mengenali, memahami, dan mengelola emosi — baik emosi diri sendiri maupun orang lain. Riset menunjukkan EQ berkontribusi signifikan terhadap keberhasilan profesional, kualitas hubungan kerja, dan efektivitas kepemimpinan. EQ bukan bawaan lahir — ia dapat dipelajari dan dikembangkan dengan praktik yang konsisten.',
      },
      {
        q: 'Apa 4 dimensi EQ yang diukur dalam tes ini?',
        a: 'EQ Test Sekil.id mengukur: (1) Self-Awareness — kemampuan mengenali emosi dan dampaknya pada perilaku dan keputusan; (2) Self-Regulation — kemampuan mengelola emosi dan impuls dalam situasi tekanan; (3) Empathy — kemampuan memahami perspektif dan perasaan orang lain; (4) Social Skills — kemampuan membangun dan menjaga hubungan yang efektif, termasuk dalam konteks konflik dan negosiasi.',
      },
      {
        q: 'Apakah EQ saya bisa meningkat setelah tes?',
        a: 'Ya. Berbeda dengan IQ yang relatif stabil, EQ sangat responsif terhadap pembelajaran dan latihan. Laporan EQ Test Sekil.id menyertakan development tips spesifik per dimensi — rekomendasi praktis yang bisa Anda mulai terapkan segera. Peningkatan EQ yang terukur biasanya membutuhkan 3–6 bulan praktik yang konsisten.',
      },
      {
        q: 'Apakah EQ Test ini sudah divalidasi secara ilmiah?',
        a: 'EQ Test Sekil.id menggunakan asesmen tervalidasi akademik yang diadaptasi untuk mengukur dimensi kecerdasan emosional dalam konteks kerja. Adaptasi dilakukan oleh tim Fakultas Psikologi UNJANI dan telah melalui proses pilot testing dengan responden Indonesia. Instrumen bersifat deskriptif dan edukatif — bukan alat diagnostik klinis.',
      },
      {
        q: 'Apa bedanya EQ Test Sekil.id dengan tes EQ lain yang beredar online?',
        a: 'Sebagian besar tes EQ online tidak memiliki basis akademik yang jelas dan tidak dikalibrasi untuk konteks Indonesia. EQ Test Sekil.id dibangun di atas instrumen yang digunakan dalam konteks profesional selama 50+ tahun, diadaptasi oleh psikolog UNJANI, dan menghasilkan laporan dalam Bahasa Indonesia native dengan rekomendasi yang relevan untuk lingkungan kerja Indonesia.',
      },
    ],
    seoTitle: 'Tes EQ Online Kecerdasan Emosional Tervalidasi | Sekil.id',
    seoDescription:
      'Ukur 4 dimensi Emotional Intelligence (EQ) dengan tes tervalidasi akademik. Dapatkan skor EQ, analisis mendalam, dan rencana pengembangan dalam 20 menit.',
    primaryKeyword: 'tes eq online',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export const PRODUCT_CODES: Record<string, string> = {
  'career-interest': 'RIASEC',
  psyai: 'PSYAI',
  'path-finder-ai': 'PFAI',
  'leadership-styles-test': 'LST',
  'emotional-intelligence-test': 'EQ',
};

export const ACCENT_SEQUENCE: ('peach' | 'blue' | 'navy')[] = [
  'peach',
  'blue',
  'navy',
  'peach',
  'blue',
];
