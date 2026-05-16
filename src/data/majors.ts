export type MajorFaculty =
  | 'Teknik'
  | 'Kedokteran'
  | 'Psikologi'
  | 'Ekonomi & Bisnis'
  | 'Hukum'
  | 'Ilmu Sosial & Komunikasi'
  | 'Seni & Desain'
  | 'MIPA'
  | 'Kesehatan'
  | 'Pendidikan';

export interface TopUniversity {
  name: string;
  type: 'negeri' | 'swasta';
}

export interface Major {
  slug: string;
  name: string;
  shortName: string;
  faculty: MajorFaculty;
  description: string;
  typicalDuration: string;
  hollandCodes: string[];
  commonPersonalities: string[];
  careerPaths: string[];
  topUniversitiesIndonesia: TopUniversity[];
  seoTitle: string;
  seoDescription: string;
  primaryKeyword: string;
}

export const MAJORS: Major[] = [
  // ────────────────────────────────────────
  // Teknik (8)
  // ────────────────────────────────────────
  {
    slug: 'teknik-informatika',
    name: 'Teknik Informatika',
    shortName: 'TI',
    faculty: 'Teknik',
    description:
      'Teknik Informatika (TI) adalah program studi yang mempelajari teori dan praktik komputasi — dari algoritma dan struktur data hingga kecerdasan buatan, jaringan komputer, dan rekayasa perangkat lunak. Di era digital, TI adalah salah satu jurusan dengan prospek karier paling luas dan gaji tertinggi di Indonesia. Lulusan TI dicari di hampir setiap industri — dari startup teknologi hingga perbankan, konsultan, dan manufaktur.',
    typicalDuration: '4 tahun',
    hollandCodes: ['I', 'R', 'C'],
    commonPersonalities: ['intj', 'intp', 'istp', 'istj', 'holland-i', 'holland-r'],
    careerPaths: [
      'software-engineer',
      'data-scientist',
      'data-analyst',
      'cybersecurity-analyst',
      'product-manager',
      'ui-ux-designer',
    ],
    topUniversitiesIndonesia: [
      { name: 'Institut Teknologi Bandung (ITB)', type: 'negeri' },
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Institut Teknologi Sepuluh Nopember (ITS)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
      { name: 'BINUS University', type: 'swasta' },
      { name: 'Universitas Telkom', type: 'swasta' },
    ],
    seoTitle: 'Jurusan Teknik Informatika — Prospek Karier, Kampus Terbaik, dan Mata Kuliah | Sekil.id',
    seoDescription:
      'Panduan lengkap jurusan Teknik Informatika: prospek karier, gaji lulusan, universitas terbaik Indonesia, mata kuliah unggulan, dan tips masuk jurusan TI.',
    primaryKeyword: 'jurusan teknik informatika',
  },
  {
    slug: 'teknik-sipil',
    name: 'Teknik Sipil',
    shortName: 'TS',
    faculty: 'Teknik',
    description:
      'Teknik Sipil mempelajari perancangan, pembangunan, dan pemeliharaan infrastruktur fisik — jalan, jembatan, gedung, bendungan, dan sistem sanitasi. Di Indonesia dengan program pembangunan infrastruktur yang masif, lulusan Teknik Sipil memiliki prospek yang sangat kuat. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun',
    hollandCodes: ['R', 'I', 'C'],
    commonPersonalities: ['istp', 'istj', 'intj', 'estj', 'holland-r', 'holland-i'],
    careerPaths: ['civil-engineer', 'management-consultant'],
    topUniversitiesIndonesia: [
      { name: 'Institut Teknologi Bandung (ITB)', type: 'negeri' },
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
      { name: 'Institut Teknologi Sepuluh Nopember (ITS)', type: 'negeri' },
      { name: 'Universitas Diponegoro (UNDIP)', type: 'negeri' },
    ],
    seoTitle: 'Jurusan Teknik Sipil — Prospek Karier dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Teknik Sipil: prospek karier di infrastruktur Indonesia, gaji lulusan, universitas terbaik, dan mata kuliah utama.',
    primaryKeyword: 'jurusan teknik sipil',
  },
  {
    slug: 'teknik-elektro',
    name: 'Teknik Elektro',
    shortName: 'TE',
    faculty: 'Teknik',
    description:
      'Teknik Elektro mempelajari sistem kelistrikan, elektronika, dan telekomunikasi — mulai dari sirkuit elektronik hingga sistem tenaga listrik dan teknologi IoT. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun',
    hollandCodes: ['R', 'I', 'C'],
    commonPersonalities: ['istp', 'intp', 'intj', 'istj', 'holland-r', 'holland-i'],
    careerPaths: ['software-engineer', 'cybersecurity-analyst', 'data-analyst'],
    topUniversitiesIndonesia: [
      { name: 'Institut Teknologi Bandung (ITB)', type: 'negeri' },
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Institut Teknologi Sepuluh Nopember (ITS)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
    ],
    seoTitle: 'Jurusan Teknik Elektro — Prospek Karier dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Teknik Elektro: prospek karier di industri energi, telekomunikasi, dan teknologi, universitas terbaik, dan mata kuliah utama.',
    primaryKeyword: 'jurusan teknik elektro',
  },
  {
    slug: 'teknik-industri',
    name: 'Teknik Industri',
    shortName: 'TID',
    faculty: 'Teknik',
    description:
      'Teknik Industri mengoptimalkan sistem produksi dan bisnis yang kompleks — menggabungkan teknik, manajemen, dan analisis data untuk meningkatkan efisiensi organisasi. Lulusan TID sangat fleksibel dan dicari di consulting, manufacturing, dan startup. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun',
    hollandCodes: ['I', 'R', 'E'],
    commonPersonalities: ['entj', 'intj', 'estj', 'istj', 'holland-i', 'holland-e'],
    careerPaths: ['management-consultant', 'supply-chain-manager', 'business-analyst'],
    topUniversitiesIndonesia: [
      { name: 'Institut Teknologi Bandung (ITB)', type: 'negeri' },
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Institut Teknologi Sepuluh Nopember (ITS)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
    ],
    seoTitle: 'Jurusan Teknik Industri — Prospek Karier dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Teknik Industri: prospek karier di consulting, manufaktur, dan startup, universitas terbaik, dan perbedaan TI vs Teknik Sipil.',
    primaryKeyword: 'jurusan teknik industri',
  },
  {
    slug: 'teknik-mesin',
    name: 'Teknik Mesin',
    shortName: 'TM',
    faculty: 'Teknik',
    description:
      'Teknik Mesin mempelajari perancangan dan analisis sistem mekanis — dari mesin dan alat industri hingga otomotif dan energi. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun',
    hollandCodes: ['R', 'I', 'C'],
    commonPersonalities: ['istp', 'istj', 'intp', 'intj', 'holland-r', 'holland-i'],
    careerPaths: ['mechanical-engineer', 'civil-engineer'],
    topUniversitiesIndonesia: [
      { name: 'Institut Teknologi Bandung (ITB)', type: 'negeri' },
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
    ],
    seoTitle: 'Jurusan Teknik Mesin — Prospek Karier dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Teknik Mesin: prospek karier di otomotif, energi, dan manufaktur, universitas terbaik, dan mata kuliah utama.',
    primaryKeyword: 'jurusan teknik mesin',
  },
  {
    slug: 'arsitektur',
    name: 'Arsitektur',
    shortName: 'Arsi',
    faculty: 'Teknik',
    description:
      'Arsitektur menggabungkan seni, desain, dan teknik untuk menciptakan bangunan dan ruang yang fungsional sekaligus estetis. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '5 tahun',
    hollandCodes: ['A', 'R', 'I'],
    commonPersonalities: ['infp', 'isfp', 'intj', 'intp', 'holland-a', 'holland-r'],
    careerPaths: ['graphic-designer', 'ui-ux-designer'],
    topUniversitiesIndonesia: [
      { name: 'Institut Teknologi Bandung (ITB)', type: 'negeri' },
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
      { name: 'Universitas Parahyangan (UNPAR)', type: 'swasta' },
    ],
    seoTitle: 'Jurusan Arsitektur — Prospek Karier dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Arsitektur: prospek karier di properti dan desain, universitas terbaik Indonesia, dan tips masuk jurusan arsitektur.',
    primaryKeyword: 'jurusan arsitektur',
  },
  {
    slug: 'sistem-informasi',
    name: 'Sistem Informasi',
    shortName: 'SI',
    faculty: 'Teknik',
    description:
      'Sistem Informasi mempelajari pengelolaan informasi dalam konteks organisasi — menggabungkan teknologi, manajemen, dan analisis bisnis. Lebih berorientasi pada bisnis dibanding Teknik Informatika. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun',
    hollandCodes: ['I', 'C', 'E'],
    commonPersonalities: ['intj', 'istj', 'entj', 'intp', 'holland-i', 'holland-c'],
    careerPaths: ['business-analyst', 'data-analyst', 'software-engineer', 'compliance-officer'],
    topUniversitiesIndonesia: [
      { name: 'Institut Teknologi Sepuluh Nopember (ITS)', type: 'negeri' },
      { name: 'BINUS University', type: 'swasta' },
      { name: 'Universitas Telkom', type: 'swasta' },
    ],
    seoTitle: 'Jurusan Sistem Informasi — Prospek Karier dan Perbedaan dengan TI | Sekil.id',
    seoDescription:
      'Panduan jurusan Sistem Informasi: perbedaan dengan Teknik Informatika, prospek karier di business analyst dan IT, serta universitas terbaik.',
    primaryKeyword: 'jurusan sistem informasi',
  },

  // ────────────────────────────────────────
  // Kesehatan / Kedokteran (3)
  // ────────────────────────────────────────
  {
    slug: 'kedokteran',
    name: 'Pendidikan Dokter',
    shortName: 'FK',
    faculty: 'Kedokteran',
    description:
      'Pendidikan Dokter adalah program studi dengan durasi terpanjang — 6 tahun (S1 + Profesi). Meski kompetitif dan berat, lulusannya memiliki karier yang sangat stabil dan dihormati. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '6 tahun (termasuk profesi)',
    hollandCodes: ['I', 'S', 'R'],
    commonPersonalities: ['infj', 'isfj', 'intj', 'isfp', 'holland-i', 'holland-s'],
    careerPaths: ['dokter-umum', 'psikolog-klinis'],
    topUniversitiesIndonesia: [
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
      { name: 'Universitas Airlangga (UNAIR)', type: 'negeri' },
      { name: 'Universitas Padjadjaran (UNPAD)', type: 'negeri' },
      { name: 'Universitas Diponegoro (UNDIP)', type: 'negeri' },
    ],
    seoTitle: 'Jurusan Kedokteran — Prospek, Jalur Masuk, dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Kedokteran di Indonesia: durasi kuliah, jalur masuk, biaya, spesialisasi, dan universitas terbaik Fakultas Kedokteran.',
    primaryKeyword: 'jurusan kedokteran',
  },
  {
    slug: 'farmasi',
    name: 'Farmasi',
    shortName: 'Farmasi',
    faculty: 'Kesehatan',
    description:
      'Farmasi mempelajari ilmu obat-obatan — dari sintesis kimiawi hingga dispensing dan konseling farmasi. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4-5 tahun (termasuk profesi apoteker)',
    hollandCodes: ['I', 'C', 'S'],
    commonPersonalities: ['istj', 'isfj', 'intj', 'holland-i', 'holland-c'],
    careerPaths: ['apoteker'],
    topUniversitiesIndonesia: [
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
      { name: 'Universitas Airlangga (UNAIR)', type: 'negeri' },
      { name: 'Institut Teknologi Bandung (ITB)', type: 'negeri' },
    ],
    seoTitle: 'Jurusan Farmasi — Prospek Karier dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Farmasi di Indonesia: prospek karier di apotek, industri farmasi, dan RS, universitas terbaik, dan jalur sertifikasi apoteker.',
    primaryKeyword: 'jurusan farmasi',
  },
  {
    slug: 'ilmu-gizi',
    name: 'Ilmu Gizi',
    shortName: 'Gizi',
    faculty: 'Kesehatan',
    description:
      'Ilmu Gizi mempelajari hubungan antara makanan, nutrisi, dan kesehatan manusia. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun',
    hollandCodes: ['I', 'S', 'R'],
    commonPersonalities: ['isfj', 'esfj', 'infj', 'holland-s', 'holland-i'],
    careerPaths: ['perawat', 'social-worker'],
    topUniversitiesIndonesia: [
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
      { name: 'Institut Pertanian Bogor (IPB)', type: 'negeri' },
    ],
    seoTitle: 'Jurusan Ilmu Gizi — Prospek Karier dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Ilmu Gizi di Indonesia: prospek karier di rumah sakit, industri pangan, dan konsultasi nutrisi, serta universitas terbaik.',
    primaryKeyword: 'jurusan ilmu gizi',
  },

  // ────────────────────────────────────────
  // Psikologi (1)
  // ────────────────────────────────────────
  {
    slug: 'psikologi',
    name: 'Psikologi',
    shortName: 'Psikologi',
    faculty: 'Psikologi',
    description:
      'Psikologi mempelajari perilaku manusia dan proses mental — dari psikologi perkembangan dan kognitif hingga psikologi industri, klinis, dan sosial. Jurusan ini menawarkan fleksibilitas karier yang luar biasa karena pemahaman tentang manusia relevan di hampir semua industri. Lulusan psikologi bekerja sebagai HRD, konselor, researcher, dan psikolog klinis. Di Sekil.id, psikologi adalah fondasi dari semua produk asesmen kami.',
    typicalDuration: '4 tahun (S1) + 2 tahun (Profesi, jika diperlukan)',
    hollandCodes: ['S', 'I', 'A'],
    commonPersonalities: ['infj', 'infp', 'enfj', 'isfj', 'isfp', 'holland-s', 'holland-i'],
    careerPaths: [
      'psikolog-klinis',
      'human-resources-specialist',
      'guru-bk',
      'education-consultant',
      'social-worker',
    ],
    topUniversitiesIndonesia: [
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
      { name: 'Universitas Airlangga (UNAIR)', type: 'negeri' },
      { name: 'Universitas Jenderal Achmad Yani (UNJANI)', type: 'negeri' },
      { name: 'Universitas Padjadjaran (UNPAD)', type: 'negeri' },
      { name: 'Universitas Katolik Indonesia Atma Jaya', type: 'swasta' },
    ],
    seoTitle: 'Jurusan Psikologi — Prospek Karier, Mata Kuliah, dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan lengkap jurusan Psikologi di Indonesia: prospek karier, perbedaan S1 vs Profesi, universitas terbaik termasuk UNJANI, dan karier di HR dan konseling.',
    primaryKeyword: 'jurusan psikologi',
  },

  // ────────────────────────────────────────
  // Ekonomi & Bisnis (4)
  // ────────────────────────────────────────
  {
    slug: 'manajemen',
    name: 'Manajemen',
    shortName: 'Manajemen',
    faculty: 'Ekonomi & Bisnis',
    description:
      'Manajemen adalah jurusan bisnis yang paling populer di Indonesia — mempelajari pengelolaan organisasi, sumber daya manusia, operasional, dan strategi bisnis. Fleksibilitas jurusan ini membuatnya relevan di hampir setiap industri. Lulusan manajemen bekerja sebagai manajer, konsultan, wirausahawan, dan analis bisnis. Prospek karier sangat luas dengan median gaji yang bervariasi tergantung spesialisasi.',
    typicalDuration: '4 tahun',
    hollandCodes: ['E', 'S', 'C'],
    commonPersonalities: ['entj', 'estj', 'enfj', 'entp', 'estp', 'holland-e', 'holland-s'],
    careerPaths: [
      'management-consultant',
      'business-analyst',
      'marketing-analyst',
      'human-resources-specialist',
      'supply-chain-manager',
    ],
    topUniversitiesIndonesia: [
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
      { name: 'Universitas Airlangga (UNAIR)', type: 'negeri' },
      { name: 'Universitas Brawijaya (UB)', type: 'negeri' },
      { name: 'BINUS University', type: 'swasta' },
      { name: 'Prasetiya Mulya University', type: 'swasta' },
    ],
    seoTitle: 'Jurusan Manajemen — Prospek Karier, Spesialisasi, dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan lengkap jurusan Manajemen di Indonesia: prospek karier, spesialisasi (keuangan, SDM, pemasaran), universitas terbaik, dan perbedaan dengan Akuntansi.',
    primaryKeyword: 'jurusan manajemen',
  },
  {
    slug: 'akuntansi',
    name: 'Akuntansi',
    shortName: 'Akuntansi',
    faculty: 'Ekonomi & Bisnis',
    description:
      'Akuntansi mempelajari pengukuran, pemrosesan, dan pelaporan informasi keuangan. Salah satu jurusan dengan tingkat penyerapan kerja tertinggi dan karier yang stabil di Indonesia. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun',
    hollandCodes: ['C', 'I', 'E'],
    commonPersonalities: ['istj', 'estj', 'intj', 'isfj', 'holland-c', 'holland-i'],
    careerPaths: ['akuntan', 'financial-analyst', 'compliance-officer', 'business-analyst'],
    topUniversitiesIndonesia: [
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
      { name: 'Universitas Airlangga (UNAIR)', type: 'negeri' },
      { name: 'Universitas Diponegoro (UNDIP)', type: 'negeri' },
      { name: 'BINUS University', type: 'swasta' },
    ],
    seoTitle: 'Jurusan Akuntansi — Prospek Karier dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Akuntansi di Indonesia: prospek karier di KAP, perusahaan, dan pemerintah, universitas terbaik, dan jalur sertifikasi CA.',
    primaryKeyword: 'jurusan akuntansi',
  },
  {
    slug: 'ilmu-ekonomi',
    name: 'Ilmu Ekonomi',
    shortName: 'Ekonomi',
    faculty: 'Ekonomi & Bisnis',
    description:
      'Ilmu Ekonomi menganalisis bagaimana masyarakat mengalokasikan sumber daya — lebih teoritis dan analitik dibanding Manajemen. Lulusan ekonomi sangat cocok untuk karier di analisis kebijakan, riset ekonomi, dan lembaga keuangan. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun',
    hollandCodes: ['I', 'C', 'E'],
    commonPersonalities: ['intj', 'intp', 'entj', 'istj', 'holland-i', 'holland-c'],
    careerPaths: ['financial-analyst', 'business-analyst', 'management-consultant', 'data-scientist'],
    topUniversitiesIndonesia: [
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
      { name: 'Universitas Airlangga (UNAIR)', type: 'negeri' },
    ],
    seoTitle: 'Jurusan Ilmu Ekonomi — Prospek Karier dan Perbedaan dengan Manajemen | Sekil.id',
    seoDescription:
      'Panduan jurusan Ilmu Ekonomi di Indonesia: perbedaan dengan Manajemen dan Akuntansi, prospek karier di BI, lembaga keuangan, dan konsultan.',
    primaryKeyword: 'jurusan ilmu ekonomi',
  },
  {
    slug: 'kewirausahaan',
    name: 'Kewirausahaan',
    shortName: 'Wirausaha',
    faculty: 'Ekonomi & Bisnis',
    description:
      'Kewirausahaan mengajarkan cara mendirikan dan mengembangkan bisnis — dari validasi ide hingga strategi skalabilitas. Jurusan yang relatif baru di Indonesia namun semakin relevan di era startup. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun',
    hollandCodes: ['E', 'A', 'S'],
    commonPersonalities: ['entj', 'entp', 'estp', 'enfp', 'holland-e', 'holland-a'],
    careerPaths: ['marketing-analyst', 'product-manager', 'content-creator'],
    topUniversitiesIndonesia: [
      { name: 'Prasetiya Mulya University', type: 'swasta' },
      { name: 'BINUS University', type: 'swasta' },
      { name: 'Universitas Ciputra', type: 'swasta' },
    ],
    seoTitle: 'Jurusan Kewirausahaan — Prospek dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Kewirausahaan di Indonesia: apa yang dipelajari, prospek karier di dunia startup, dan universitas terbaik untuk entrepreneur muda.',
    primaryKeyword: 'jurusan kewirausahaan',
  },

  // ────────────────────────────────────────
  // Hukum (1)
  // ────────────────────────────────────────
  {
    slug: 'hukum',
    name: 'Ilmu Hukum',
    shortName: 'Hukum',
    faculty: 'Hukum',
    description:
      'Ilmu Hukum mempelajari sistem dan peraturan yang mengatur masyarakat — dari hukum perdata dan pidana hingga hukum bisnis dan internasional. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun (S1) + pendidikan profesi advokat',
    hollandCodes: ['E', 'I', 'S'],
    commonPersonalities: ['entj', 'intj', 'entp', 'estj', 'holland-e', 'holland-i'],
    careerPaths: ['pengacara', 'compliance-officer', 'management-consultant'],
    topUniversitiesIndonesia: [
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
      { name: 'Universitas Airlangga (UNAIR)', type: 'negeri' },
      { name: 'Universitas Padjadjaran (UNPAD)', type: 'negeri' },
      { name: 'Universitas Diponegoro (UNDIP)', type: 'negeri' },
    ],
    seoTitle: 'Jurusan Ilmu Hukum — Prospek Karier dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Ilmu Hukum di Indonesia: prospek karier di law firm, perusahaan, dan pemerintah, universitas terbaik, dan jalur profesi advokat.',
    primaryKeyword: 'jurusan ilmu hukum',
  },

  // ────────────────────────────────────────
  // Ilmu Sosial & Komunikasi (4)
  // ────────────────────────────────────────
  {
    slug: 'komunikasi',
    name: 'Ilmu Komunikasi',
    shortName: 'Ikom',
    faculty: 'Ilmu Sosial & Komunikasi',
    description:
      'Ilmu Komunikasi mempelajari proses komunikasi manusia — dari komunikasi interpersonal hingga media massa, PR, dan komunikasi digital. Jurusan yang sangat relevan di era media sosial dan konten digital. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun',
    hollandCodes: ['A', 'S', 'E'],
    commonPersonalities: ['enfp', 'enfj', 'esfp', 'estp', 'holland-a', 'holland-s'],
    careerPaths: ['marketing-analyst', 'content-creator', 'copywriter', 'film-director'],
    topUniversitiesIndonesia: [
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
      { name: 'Universitas Airlangga (UNAIR)', type: 'negeri' },
      { name: 'BINUS University', type: 'swasta' },
      { name: 'London School of Public Relations (LSPR)', type: 'swasta' },
    ],
    seoTitle: 'Jurusan Ilmu Komunikasi — Prospek Karier dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Ilmu Komunikasi di Indonesia: peminatan (PR, broadcasting, komunikasi digital), prospek karier, dan universitas terbaik.',
    primaryKeyword: 'jurusan ilmu komunikasi',
  },
  {
    slug: 'sosiologi',
    name: 'Sosiologi',
    shortName: 'Sosiologi',
    faculty: 'Ilmu Sosial & Komunikasi',
    description:
      'Sosiologi mempelajari struktur, dinamika, dan perubahan masyarakat. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun',
    hollandCodes: ['I', 'S', 'A'],
    commonPersonalities: ['infj', 'infp', 'enfj', 'intp', 'holland-i', 'holland-s'],
    careerPaths: ['social-worker', 'ngo-program-manager', 'education-consultant'],
    topUniversitiesIndonesia: [
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
      { name: 'Universitas Airlangga (UNAIR)', type: 'negeri' },
    ],
    seoTitle: 'Jurusan Sosiologi — Prospek Karier dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Sosiologi di Indonesia: prospek karier di NGO, pemerintah, dan riset sosial, universitas terbaik, dan perbedaan dengan Psikologi.',
    primaryKeyword: 'jurusan sosiologi',
  },
  {
    slug: 'hubungan-internasional',
    name: 'Hubungan Internasional',
    shortName: 'HI',
    faculty: 'Ilmu Sosial & Komunikasi',
    description:
      'Hubungan Internasional mempelajari interaksi antar negara, organisasi internasional, dan isu-isu global — dari diplomasi hingga perdagangan internasional dan keamanan global. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun',
    hollandCodes: ['E', 'I', 'S'],
    commonPersonalities: ['entj', 'enfj', 'intj', 'infj', 'holland-e', 'holland-i'],
    careerPaths: ['ngo-program-manager', 'management-consultant', 'pengacara'],
    topUniversitiesIndonesia: [
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
      { name: 'Universitas Airlangga (UNAIR)', type: 'negeri' },
      { name: 'Universitas Parahyangan (UNPAR)', type: 'swasta' },
    ],
    seoTitle: 'Jurusan Hubungan Internasional — Prospek Karier dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Hubungan Internasional di Indonesia: prospek karier di Kemenlu, NGO, dan perusahaan multinasional, serta universitas terbaik.',
    primaryKeyword: 'jurusan hubungan internasional',
  },
  {
    slug: 'sastra-inggris',
    name: 'Sastra Inggris',
    shortName: 'Sastra Inggris',
    faculty: 'Ilmu Sosial & Komunikasi',
    description:
      'Sastra Inggris tidak hanya mempelajari literatur — tetapi juga linguistik, terjemahan, dan komunikasi lintas budaya. Kemampuan bahasa Inggris yang kuat membuka peluang karier di banyak bidang. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun',
    hollandCodes: ['A', 'I', 'S'],
    commonPersonalities: ['infp', 'infj', 'enfp', 'intp', 'holland-a', 'holland-i'],
    careerPaths: ['copywriter', 'content-creator', 'education-consultant'],
    topUniversitiesIndonesia: [
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
      { name: 'Universitas Padjadjaran (UNPAD)', type: 'negeri' },
    ],
    seoTitle: 'Jurusan Sastra Inggris — Prospek Karier dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Sastra Inggris di Indonesia: prospek karier di linguistik, penerjemahan, dan komunikasi, universitas terbaik, dan perbedaan dengan Ilmu Komunikasi.',
    primaryKeyword: 'jurusan sastra inggris',
  },

  // ────────────────────────────────────────
  // Seni & Desain (1)
  // ────────────────────────────────────────
  {
    slug: 'desain-komunikasi-visual',
    name: 'Desain Komunikasi Visual',
    shortName: 'DKV',
    faculty: 'Seni & Desain',
    description:
      'Desain Komunikasi Visual (DKV) menggabungkan seni visual dan komunikasi untuk menyampaikan pesan yang efektif. Di era digital, lulusan DKV sangat dicari di industri kreatif, startup, dan periklanan. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun',
    hollandCodes: ['A', 'R', 'E'],
    commonPersonalities: ['isfp', 'infp', 'enfp', 'esfp', 'holland-a', 'holland-r'],
    careerPaths: ['graphic-designer', 'ui-ux-designer', 'content-creator', 'film-director'],
    topUniversitiesIndonesia: [
      { name: 'Institut Teknologi Bandung (ITB)', type: 'negeri' },
      { name: 'Universitas Bina Nusantara (BINUS)', type: 'swasta' },
      { name: 'Institut Kesenian Jakarta (IKJ)', type: 'swasta' },
      { name: 'FSRD Institut Teknologi Bandung', type: 'negeri' },
    ],
    seoTitle: 'Jurusan DKV (Desain Komunikasi Visual) — Prospek Karier dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Desain Komunikasi Visual (DKV) di Indonesia: prospek karier di studio desain, agensi iklan, dan startup, serta universitas terbaik.',
    primaryKeyword: 'jurusan desain komunikasi visual',
  },

  // ────────────────────────────────────────
  // MIPA (3)
  // ────────────────────────────────────────
  {
    slug: 'statistika',
    name: 'Statistika',
    shortName: 'Statistika',
    faculty: 'MIPA',
    description:
      'Statistika adalah ilmu pengumpulan, analisis, dan interpretasi data — fondasi dari data science dan analisis bisnis modern. Salah satu jurusan dengan prospek karier terbaik di era big data. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun',
    hollandCodes: ['I', 'C', 'R'],
    commonPersonalities: ['intj', 'intp', 'istj', 'entj', 'holland-i', 'holland-c'],
    careerPaths: ['data-scientist', 'data-analyst', 'financial-analyst', 'business-analyst'],
    topUniversitiesIndonesia: [
      { name: 'Institut Pertanian Bogor (IPB)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
      { name: 'Institut Teknologi Sepuluh Nopember (ITS)', type: 'negeri' },
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
    ],
    seoTitle: 'Jurusan Statistika — Prospek Karier di Data Science dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Statistika di Indonesia: koneksi ke data science, prospek karier, universitas terbaik, dan perbedaan dengan Matematika.',
    primaryKeyword: 'jurusan statistika',
  },
  {
    slug: 'fisika',
    name: 'Fisika',
    shortName: 'Fisika',
    faculty: 'MIPA',
    description:
      'Fisika mempelajari hukum-hukum fundamental yang mengatur alam semesta — dari mekanika kuantum hingga fisika material dan instrumentasi. Lulusan fisika memiliki kemampuan analitik yang sangat kuat yang dicari di berbagai industri. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun',
    hollandCodes: ['I', 'R', 'C'],
    commonPersonalities: ['intj', 'intp', 'istp', 'istj', 'holland-i', 'holland-r'],
    careerPaths: ['data-scientist', 'software-engineer', 'financial-analyst'],
    topUniversitiesIndonesia: [
      { name: 'Institut Teknologi Bandung (ITB)', type: 'negeri' },
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
    ],
    seoTitle: 'Jurusan Fisika — Prospek Karier dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Fisika di Indonesia: prospek karier di industri dan riset, universitas terbaik, dan kenapa lulusan Fisika dicari di industri teknologi.',
    primaryKeyword: 'jurusan fisika',
  },

  // ────────────────────────────────────────
  // MIPA cont.
  // ────────────────────────────────────────
  {
    slug: 'biologi',
    name: 'Biologi',
    shortName: 'Biologi',
    faculty: 'MIPA',
    description:
      'Biologi mempelajari kehidupan — dari biologi molekuler dan genetika hingga ekologi dan biologi konservasi. Fondasi untuk karier di kedokteran, farmasi, bioteknologi, dan riset lingkungan. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun',
    hollandCodes: ['I', 'R', 'S'],
    commonPersonalities: ['infj', 'intj', 'intp', 'isfj', 'holland-i', 'holland-r'],
    careerPaths: ['dokter-umum', 'apoteker', 'dosen'],
    topUniversitiesIndonesia: [
      { name: 'Institut Pertanian Bogor (IPB)', type: 'negeri' },
      { name: 'Universitas Indonesia (UI)', type: 'negeri' },
      { name: 'Universitas Gadjah Mada (UGM)', type: 'negeri' },
      { name: 'Institut Teknologi Bandung (ITB)', type: 'negeri' },
    ],
    seoTitle: 'Jurusan Biologi — Prospek Karier dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan Biologi di Indonesia: prospek karier di bioteknologi, farmasi, dan riset, universitas terbaik, dan koneksi ke kedokteran.',
    primaryKeyword: 'jurusan biologi',
  },

  // ────────────────────────────────────────
  // Pendidikan (1)
  // ────────────────────────────────────────
  {
    slug: 'pendidikan-guru-sd',
    name: 'Pendidikan Guru Sekolah Dasar (PGSD)',
    shortName: 'PGSD',
    faculty: 'Pendidikan',
    description:
      'PGSD mempersiapkan calon guru sekolah dasar yang kompeten dalam mengajar seluruh mata pelajaran untuk siswa usia 6–12 tahun. Dengan Program Pengangkatan PPPK yang aktif, prospek karier sebagai guru ASN semakin terbuka. Konten ini sedang dalam proses pengembangan dan akan diperbarui setelah review akademik.',
    typicalDuration: '4 tahun',
    hollandCodes: ['S', 'A', 'I'],
    commonPersonalities: ['isfj', 'esfj', 'enfj', 'infj', 'holland-s'],
    careerPaths: ['guru-bk', 'education-consultant', 'dosen'],
    topUniversitiesIndonesia: [
      { name: 'Universitas Negeri Jakarta (UNJ)', type: 'negeri' },
      { name: 'Universitas Negeri Yogyakarta (UNY)', type: 'negeri' },
      { name: 'Universitas Pendidikan Indonesia (UPI)', type: 'negeri' },
      { name: 'Universitas Negeri Malang (UM)', type: 'negeri' },
    ],
    seoTitle: 'Jurusan PGSD — Prospek Karier Guru SD dan Kampus Terbaik | Sekil.id',
    seoDescription:
      'Panduan jurusan PGSD (Pendidikan Guru Sekolah Dasar) di Indonesia: prospek PPPK, gaji guru, universitas terbaik, dan jalur karier sebagai guru SD.',
    primaryKeyword: 'jurusan pgsd',
  },
];

export function getMajorBySlug(slug: string): Major | undefined {
  return MAJORS.find((m) => m.slug === slug);
}

export function getAllMajorSlugs(): string[] {
  return MAJORS.map((m) => m.slug);
}

export function getMajorsByFaculty(faculty: MajorFaculty): Major[] {
  return MAJORS.filter((m) => m.faculty === faculty);
}
