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
    price: 159000,
    priceDisplay: 'Rp 159.000',
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
    duration: '25–60 menit, bervariasi per siswa',
    price: 229000,
    priceDisplay: 'Rp 229.000',
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
    duration: '25–60 menit, bervariasi per siswa',
    price: 179000,
    priceDisplay: 'Rp 179.000',
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
    duration: '25–60 menit, bervariasi per siswa',
    price: 179000,
    priceDisplay: 'Rp 179.000',
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
    duration: '25–60 menit, bervariasi per siswa',
    price: 209000,
    priceDisplay: 'Rp 209.000',
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
  {
    slug: 'self-discovery-ai',
    name: 'Self DiscoveryAI',
    nameDisplay: 'Self DiscoveryAI — Kenali Dirimu',
    tagline: 'Peta diri komprehensif: siapa Anda, bagaimana Anda bekerja, apa yang paling bermakna bagi Anda',
    description:
      'Self DiscoveryAI mengintegrasikan profil preferensi kepribadian dan inventori kebutuhan kerja untuk menghasilkan peta diri yang holistik. 20 menit untuk memahami kekuatan alami, kebutuhan, dan cara kerja terbaik Anda.',
    longDescription:
      'Self DiscoveryAI dirancang untuk mereka yang ingin memahami dirinya lebih dalam sebelum membuat keputusan karier atau hidup yang signifikan. Dengan mengintegrasikan kerangka preferensi kepribadian dan inventori kebutuhan & peran kerja, Self DiscoveryAI menghasilkan peta diri holistik — mencakup bagaimana Anda memproses informasi, apa yang memotivasi Anda, dan lingkungan seperti apa yang membuat Anda tumbuh paling baik.',
    duration: '25–60 menit, bervariasi per siswa',
    price: 179000,
    priceDisplay: 'Rp 179.000',
    targetPersonas: ['mahasiswa', 'fresh-grad', 'karyawan'],
    instruments: ['mbti', 'papi'],
    outputs: [
      'Profil preferensi kepribadian dengan 4 dimensi utama',
      'Peta kebutuhan & peran kerja: apa yang memotivasi dan menguras energi Anda',
      'Narasi self-discovery dipersonalisasi AI dalam konteks kerja dan kehidupan',
      'Profil lingkungan kerja ideal berdasarkan kebutuhan dan preferensi',
      'Panduan pengembangan diri berbasis titik terkuat dan blind spot',
      'Laporan PDF 15+ halaman dalam Bahasa Indonesia',
    ],
    sampleReportTeaser:
      'Laporan Self DiscoveryAI mencakup: profil preferensi kepribadian 4 dimensi, peta kebutuhan & peran kerja dalam 10 dimensi, narasi self-discovery yang dipersonalisasi AI, dan panduan "cara kerja terbaik Anda" untuk dikomunikasikan ke atasan, rekan, dan tim.',
    bundleSuggestions: ['psyai', 'career-interest'],
    faq: [
      {
        q: 'Apa bedanya Self DiscoveryAI dengan PsyAI?',
        a: 'PsyAI berfokus pada integrasi minat vokasional dan kepribadian untuk arah karier. Self DiscoveryAI lebih dalam pada self-understanding — siapa Anda, apa kebutuhan kerja Anda, dan bagaimana Anda berfungsi terbaik — tanpa terlalu fokus pada rekomendasi karier spesifik. Cocok untuk yang ingin memahami diri sebelum memutuskan langkah berikutnya.',
      },
      {
        q: 'Siapa yang paling cocok mengikuti tes ini?',
        a: 'Self DiscoveryAI paling bermanfaat untuk mahasiswa di persimpangan pilihan karier, fresh graduate yang ingin memahami diri sebelum memulai karier, dan karyawan yang sedang dalam proses refleksi diri atau perubahan karier.',
      },
      {
        q: 'Berapa lama tes dan bagaimana cara mendapatkan laporan?',
        a: '20 menit untuk menyelesaikan tes. Laporan tersedia langsung setelah selesai dalam format PDF yang dapat diunduh dan dikirim ke email Anda.',
      },
    ],
    seoTitle: 'Self Discovery AI — Kenali Dirimu Lebih Dalam | Sekil.id',
    seoDescription:
      'Self DiscoveryAI mengintegrasikan profil kepribadian dan inventori kebutuhan kerja untuk peta diri yang komprehensif. Kenali kekuatan, kebutuhan, dan cara kerja terbaik Anda dalam 20 menit.',
    primaryKeyword: 'tes self discovery',
  },
  {
    slug: 'goal-align-ai',
    name: 'Goal AlignAI',
    nameDisplay: 'Goal AlignAI — Selaraskan Tujuan Karier',
    tagline: 'Selaraskan ambisi karier dengan profil kebutuhan kerja dan motivasi asli Anda',
    description:
      'Goal AlignAI membantu Anda menyusun tujuan karier yang benar-benar selaras dengan kebutuhan, motivasi, dan kekuatan kerja Anda — menghasilkan roadmap karier yang realistis dan menggerakkan semangat.',
    longDescription:
      'Banyak orang menetapkan tujuan karier berdasarkan ekspektasi sosial atau tekanan lingkungan — bukan berdasarkan profil diri yang sesungguhnya. Goal AlignAI menggabungkan analisis inventori kebutuhan & peran kerja dengan eksplorasi tujuan karier untuk menghasilkan roadmap yang selaras dengan motivasi intrinsik Anda. Hasilnya: tujuan yang tidak hanya realistis, tapi juga menggerakkan energi dan komitmen jangka panjang.',
    duration: '25–60 menit, bervariasi per siswa',
    price: 179000,
    priceDisplay: 'Rp 179.000',
    targetPersonas: ['fresh-grad', 'karyawan', 'manager'],
    instruments: ['papi'],
    outputs: [
      'Profil kebutuhan & motivasi kerja: apa yang benar-benar menggerakkan Anda',
      'Analisis keselarasan antara tujuan karier dan profil kebutuhan Anda',
      'Roadmap karier 1–3 tahun yang selaras dengan profil motivasi',
      'Identifikasi hambatan internal dan strategi mengatasinya',
      'Panduan komunikasi tujuan karier ke atasan atau mentor',
      'Laporan PDF 12+ halaman dalam Bahasa Indonesia',
    ],
    sampleReportTeaser:
      'Laporan Goal AlignAI mencakup: profil motivasi kerja dan kebutuhan karier Anda, analisis keselarasan tujuan versus profil, roadmap karier dengan milestone konkret, serta identifikasi hambatan internal yang perlu diatasi untuk mencapai tujuan tersebut.',
    bundleSuggestions: ['self-discovery-ai', 'psyai'],
    faq: [
      {
        q: 'Apa yang membedakan Goal AlignAI dari career coaching biasa?',
        a: 'Goal AlignAI berbasis data profil psikologis — bukan opini atau asumsi. Roadmap yang dihasilkan didasarkan pada inventori kebutuhan & peran kerja yang tervalidasi, sehingga lebih akurat mencerminkan motivasi asli Anda daripada sekadar nasihat umum.',
      },
      {
        q: 'Siapa yang paling cocok mengikuti Goal AlignAI?',
        a: 'Fresh graduate yang akan memulai karier dan ingin arah yang jelas, karyawan yang merasa karier tidak selaras dengan motivasi aslinya, dan manajer yang ingin merekalkulasi tujuan karier jangka menengah.',
      },
      {
        q: 'Apakah hasilnya bisa digunakan dalam sesi mentoring atau coaching?',
        a: 'Ya. Laporan Goal AlignAI dirancang sebagai bahan diskusi produktif dalam sesi mentoring, coaching karier, atau konsultasi HR. Profil dan roadmap yang konkret mempercepat proses karena titik awal sudah berbasis data.',
      },
    ],
    seoTitle: 'Goal AlignAI — Selaraskan Tujuan Karier dengan Profil Anda | Sekil.id',
    seoDescription:
      'Goal AlignAI membantu menyusun roadmap karier yang selaras dengan motivasi dan kebutuhan kerja asli Anda. 20 menit untuk tujuan karier yang lebih bermakna dan realistis.',
    primaryKeyword: 'goal alignment karier',
  },
  {
    slug: 'goal-orientation-coaching',
    name: 'Goal Orientation Coaching',
    nameDisplay: 'Goal Orientation Coaching — Coaching Karier Premium',
    tagline: 'Sesi coaching 1-on-1 dengan psikolog karier berbasis data profil Anda',
    description:
      'Paket premium Goal Orientation Coaching menggabungkan asesmen profil kebutuhan kerja dengan sesi coaching intensif 1-on-1 bersama psikolog karier Sekil.id. Dapatkan action plan karier yang konkret, tervalidasi, dan didampingi profesional.',
    longDescription:
      'Goal Orientation Coaching adalah layanan premium Sekil.id yang menggabungkan rigor asesmen psikologis dengan kedalaman coaching profesional. Sesi dimulai dengan asesmen inventori kebutuhan & peran kerja untuk membangun profil yang objektif, dilanjutkan dengan sesi coaching 1-on-1 bersama psikolog karier. Hasilnya: action plan karier yang tidak hanya diinginkan, tapi dapat dicapai sesuai profil dan kondisi aktual Anda.',
    duration: '45 menit',
    price: 359000,
    priceDisplay: 'Rp 359.000',
    targetPersonas: ['karyawan', 'manager'],
    instruments: ['papi'],
    outputs: [
      'Asesmen profil kebutuhan & peran kerja sebelum sesi coaching',
      'Sesi coaching 1-on-1 45 menit dengan psikolog karier Sekil.id',
      'Goal clarity framework: tujuan jangka pendek, menengah, dan panjang',
      'Identifikasi hambatan dan strategi eksekusi yang realistis',
      'Action plan tertulis 90 hari yang dapat langsung dimulai',
      'Ringkasan sesi dan catatan psikolog dalam format PDF',
    ],
    sampleReportTeaser:
      'Setelah sesi Goal Orientation Coaching, Anda mendapatkan: ringkasan profil kebutuhan & peran kerja, goal clarity framework dengan milestone konkret, action plan 90 hari yang dipersonalisasi, dan catatan psikolog mengenai rekomendasi pengembangan lanjutan.',
    bundleSuggestions: ['goal-align-ai', 'professional-authenticity-test'],
    faq: [
      {
        q: 'Bagaimana jadwal sesi coaching diatur?',
        a: 'Setelah pembelian, tim Sekil.id akan menghubungi Anda dalam 1 hari kerja untuk menjadwalkan sesi. Sesi dapat dilakukan via video call (Zoom/Google Meet) sesuai jadwal yang disepakati.',
      },
      {
        q: 'Apakah psikolog yang akan coaching sudah bersertifikat?',
        a: 'Ya. Semua psikolog karier Sekil.id adalah psikolog berlisensi dengan keahlian di bidang psikologi industri dan karier. Profil psikolog dapat diminta sebelum sesi.',
      },
      {
        q: 'Apakah ada sesi follow-up setelah coaching?',
        a: 'Paket dasar mencakup 1 sesi coaching. Follow-up session tersedia dengan pembelian terpisah. Untuk paket institusional yang mencakup multiple sesi, hubungi tim kami.',
      },
    ],
    seoTitle: 'Goal Orientation Coaching — Coaching Karier dengan Psikolog | Sekil.id',
    seoDescription:
      'Sesi coaching karier 1-on-1 dengan psikolog Sekil.id berbasis asesmen profil kebutuhan kerja. Dapatkan action plan 90 hari yang konkret dan tervalidasi profesional.',
    primaryKeyword: 'coaching karier psikolog',
  },
  {
    slug: 'professional-authenticity-test',
    name: 'Professional Authenticity Test',
    nameDisplay: 'Professional Authenticity Test — Keaslian di Tempat Kerja',
    tagline: 'Ukur seberapa autentik Anda bekerja dan identifikasi kesenjangan antara diri asli dan peran profesional',
    description:
      'Professional Authenticity Test mengukur keselarasan antara nilai-nilai diri, kebutuhan kerja, dan cara Anda berpresentasi di lingkungan profesional. Identifikasi "authenticity gap" yang mungkin menyebabkan kelelahan atau ketidakpuasan karier.',
    longDescription:
      'Ketidakselarasan antara siapa Anda sebenarnya dan bagaimana Anda berperilaku di tempat kerja adalah sumber utama kelelahan dan ketidakpuasan karier jangka panjang. Professional Authenticity Test mengukur gap ini menggunakan inventori kebutuhan & peran kerja yang diadaptasi untuk konteks keaslian profesional — menghasilkan profil yang menunjukkan area di mana Anda paling dan paling tidak autentik, beserta strategi untuk mempersempit kesenjangan tersebut.',
    duration: '25–60 menit, bervariasi per siswa',
    price: 179000,
    priceDisplay: 'Rp 179.000',
    targetPersonas: ['fresh-grad', 'karyawan', 'manager'],
    instruments: ['papi'],
    outputs: [
      'Profil keaslian profesional: area di mana Anda paling dan paling kurang autentik',
      'Analisis authenticity gap antara nilai diri dan perilaku profesional',
      'Identifikasi pemicu ketidakautentikan: situasi, orang, atau konteks tertentu',
      'Strategi mempersempit authenticity gap dengan langkah konkret',
      'Panduan komunikasi yang lebih autentik di tempat kerja',
      'Laporan PDF 12+ halaman dalam Bahasa Indonesia',
    ],
    sampleReportTeaser:
      'Laporan Professional Authenticity Test mencakup: skor keaslian per dimensi profesional, analisis authenticity gap antara nilai dan perilaku, identifikasi situasi pemicu, dan 5 strategi konkret untuk bekerja dengan lebih autentik tanpa mengorbankan profesionalisme.',
    bundleSuggestions: ['self-discovery-ai', 'goal-orientation-coaching'],
    faq: [
      {
        q: 'Apa yang dimaksud dengan "authenticity gap" dalam konteks kerja?',
        a: 'Authenticity gap adalah jarak antara siapa Anda sebenarnya (nilai, kebutuhan, preferensi kerja) dan bagaimana Anda berpresentasi di tempat kerja. Gap yang terlalu besar adalah sumber utama kelelahan dan ketidakpuasan karier kronis.',
      },
      {
        q: 'Apakah tes ini hanya untuk individu yang "tidak autentik"?',
        a: 'Tidak. Semua orang menyesuaikan diri di tempat kerja — itu normal. Tes ini mengukur seberapa besar penyesuaian tersebut dan apakah sudah melewati ambang yang berdampak negatif pada wellbeing dan performa.',
      },
      {
        q: 'Bagaimana hasil tes ini bisa membantu karier saya?',
        a: 'Dengan memahami di mana dan mengapa Anda tidak autentik, Anda bisa membuat keputusan yang lebih tepat: apakah perlu mengubah cara berkomunikasi, mencari peran yang lebih sesuai, atau mempertimbangkan perubahan lingkungan kerja.',
      },
    ],
    seoTitle: 'Professional Authenticity Test — Keaslian di Tempat Kerja | Sekil.id',
    seoDescription:
      'Ukur keselarasan antara nilai diri dan perilaku profesional. Professional Authenticity Test mengidentifikasi authenticity gap dan memberikan strategi konkret untuk bekerja lebih autentik.',
    primaryKeyword: 'tes keaslian profesional',
  },
  {
    slug: 'job-burnout-test',
    name: 'Job Burnout Test',
    nameDisplay: 'Job Burnout Test — Deteksi Risiko Burnout',
    tagline: 'Deteksi dini risiko burnout dan susun strategi pemulihan berbasis data',
    description:
      'Job Burnout Test mengukur tingkat kelelahan kerja di tiga dimensi: kelelahan emosional, depersonalisasi, dan efektivitas diri. Dapatkan profil risiko burnout yang akurat dan panduan pemulihan yang konkret dalam 15 menit.',
    longDescription:
      'Burnout bukan sekadar kelelahan biasa — ia adalah kondisi psikologis yang berkembang bertahap dan berdampak serius pada kesehatan, produktivitas, dan hubungan kerja. Job Burnout Test menggunakan asesmen kebutuhan & peran kerja yang diadaptasi untuk mengukur tiga dimensi burnout paling kritis: kelelahan emosional, depersonalisasi, dan efektivitas diri. Hasilnya mencakup profil risiko dan rencana pemulihan berbasis evidence.',
    duration: '15 menit',
    price: 209000,
    priceDisplay: 'Rp 209.000',
    targetPersonas: ['karyawan', 'manager'],
    instruments: ['papi'],
    outputs: [
      'Skor 3 dimensi burnout: Kelelahan Emosional, Depersonalisasi, dan Efektivitas Diri',
      'Profil risiko burnout keseluruhan: rendah, sedang, atau tinggi',
      'Identifikasi dimensi burnout yang paling kritis saat ini',
      'Analisis penyebab potensial berdasarkan profil kebutuhan kerja',
      'Panduan pemulihan bertahap dengan 10 strategi berbasis evidence',
      'Laporan PDF 10+ halaman dalam Bahasa Indonesia',
    ],
    sampleReportTeaser:
      'Laporan Job Burnout Test mencakup: skor per dimensi burnout dengan interpretasi mendalam, profil risiko keseluruhan, identifikasi faktor penyebab dari lingkungan dan pola kerja, serta panduan pemulihan 30-60-90 hari yang dapat langsung dimulai.',
    bundleSuggestions: ['professional-authenticity-test', 'emotional-intelligence-test'],
    faq: [
      {
        q: 'Apakah tes ini bisa mendiagnosis burnout secara klinis?',
        a: 'Tidak. Job Burnout Test adalah alat skrining dan self-assessment — bukan alat diagnostik klinis. Hasilnya bersifat indikatif dan edukatif. Jika Anda mengalami gejala burnout yang parah, sangat disarankan untuk berkonsultasi dengan psikolog atau dokter berlisensi.',
      },
      {
        q: 'Seberapa sering saya perlu mengulang tes ini?',
        a: 'Kami merekomendasikan melakukan Job Burnout Test setiap 6 bulan sebagai check-in rutin, atau segera jika ada perubahan signifikan dalam kondisi kerja atau kesehatan mental.',
      },
      {
        q: 'Apakah employer atau HRD bisa melihat hasil tes saya?',
        a: 'Tidak. Hasil tes hanya dapat diakses oleh peserta yang bersangkutan. Kami tidak berbagi data individual dengan employer, HR, atau pihak ketiga manapun tanpa persetujuan eksplisit peserta.',
      },
    ],
    seoTitle: 'Job Burnout Test — Deteksi Risiko Burnout Kerja | Sekil.id',
    seoDescription:
      'Deteksi dini risiko burnout dengan asesmen tervalidasi. Job Burnout Test mengukur 3 dimensi burnout dan memberikan panduan pemulihan berbasis evidence dalam 15 menit.',
    primaryKeyword: 'tes burnout kerja',
  },
  {
    slug: 'personal-authenticity-test',
    name: 'Personal Authenticity Test',
    nameDisplay: 'Personal Authenticity Test — Keaslian Diri Sejati',
    tagline: 'Temukan dan ekspresikan versi diri yang paling autentik dalam kehidupan sehari-hari',
    description:
      'Personal Authenticity Test mengukur keselarasan antara nilai-nilai inti, preferensi hidup, dan cara Anda menjalani keseharian. Untuk individu yang ingin hidup lebih bermakna dan selaras dengan siapa diri mereka sebenarnya.',
    longDescription:
      'Keaslian diri bukan tentang sempurna atau tidak berubah — ini tentang menjalani hidup yang selaras dengan nilai dan preferensi terdalam Anda. Personal Authenticity Test mengintegrasikan kerangka preferensi kepribadian dengan inventori kebutuhan personal untuk menghasilkan profil keaslian yang menyeluruh: di area mana Anda sudah autentik, di mana Anda paling sering menekan diri sendiri, dan apa yang perlu diubah untuk hidup yang lebih bermakna.',
    duration: '25–60 menit, bervariasi per siswa',
    price: 209000,
    priceDisplay: 'Rp 209.000',
    targetPersonas: ['mahasiswa', 'fresh-grad', 'karyawan'],
    instruments: ['mbti', 'papi'],
    outputs: [
      'Profil nilai inti: apa yang paling penting bagi Anda dalam hidup dan hubungan',
      'Skor keaslian diri per domain: karier, hubungan, ekspresi diri, dan pilihan hidup',
      'Identifikasi area di mana Anda paling sering menekan atau menyembunyikan diri',
      'Analisis akar ketidakautentikan: ekspektasi sosial, rasa takut, atau kebiasaan',
      'Panduan hidup lebih autentik dengan langkah konkret dan bertahap',
      'Laporan PDF 12+ halaman dalam Bahasa Indonesia',
    ],
    sampleReportTeaser:
      'Laporan Personal Authenticity Test mencakup: profil nilai inti dan preferensi hidup, skor keaslian per domain kehidupan, analisis mendalam tentang pola ketidakautentikan, serta panduan 5 langkah untuk mulai menjalani hidup yang lebih selaras dengan diri asli Anda.',
    bundleSuggestions: ['self-discovery-ai', 'job-burnout-test'],
    faq: [
      {
        q: 'Apa bedanya Personal Authenticity Test dengan Professional Authenticity Test?',
        a: 'Professional Authenticity Test berfokus pada konteks tempat kerja. Personal Authenticity Test lebih luas — mencakup seluruh domain kehidupan: karier, hubungan, ekspresi diri, dan pilihan hidup secara keseluruhan.',
      },
      {
        q: 'Apakah tes ini cocok untuk remaja atau siswa?',
        a: 'Tes ini paling optimal untuk usia 18 tahun ke atas. Untuk siswa SMA, Career Interest atau Path Finder AI mungkin lebih relevan sebagai titik awal eksplorasi diri.',
      },
      {
        q: 'Apakah hasil tes ini bisa berubah?',
        a: 'Ya. Nilai, preferensi, dan tingkat keaslian diri dapat berkembang seiring pengalaman dan pertumbuhan. Kami merekomendasikan re-assessment setiap 12–18 bulan, atau setelah transisi hidup yang signifikan.',
      },
    ],
    seoTitle: 'Personal Authenticity Test — Keaslian Diri Sejati | Sekil.id',
    seoDescription:
      'Ukur keselarasan antara nilai inti dan cara hidup Anda sehari-hari. Personal Authenticity Test membantu Anda hidup lebih autentik dan bermakna dalam 20 menit.',
    primaryKeyword: 'tes keaslian diri',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export const PRODUCT_CODES: Record<string, string> = {
  'career-interest': 'CI',
  psyai: 'PSYAI',
  'path-finder-ai': 'PFAI',
  'leadership-styles-test': 'LST',
  'emotional-intelligence-test': 'EQ',
  'self-discovery-ai': 'SDAI',
  'goal-align-ai': 'GAAI',
  'goal-orientation-coaching': 'GOC',
  'professional-authenticity-test': 'PAT',
  'job-burnout-test': 'JBT',
  'personal-authenticity-test': 'PEAT',
};

export const ACCENT_SEQUENCE: ('peach' | 'blue' | 'navy')[] = [
  'peach',
  'blue',
  'navy',
  'peach',
  'blue',
  'navy',
  'peach',
  'blue',
  'navy',
  'peach',
  'blue',
];
