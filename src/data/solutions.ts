export type SegmentSlug =
  | 'untuk-sekolah'
  | 'untuk-perguruan-tinggi'
  | 'untuk-perusahaan'
  | 'untuk-yayasan';

export interface UseCase {
  title: string;
  description: string;
}

export interface SolutionStat {
  value: string;
  label: string;
}

export interface SolutionTestimonial {
  quote: string;
  author: string;
  role: string;
  institution: string;
}

export interface SolutionSegment {
  slug: SegmentSlug;
  name: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  heroAccent: 'peach' | 'blue' | 'navy' | 'ink';
  problems: string[];
  useCases: UseCase[];
  recommendedProducts: string[];
  stats: SolutionStat[];
  testimonial?: SolutionTestimonial;
  faq: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
  showATCDashboard: boolean;
}

export const SOLUTION_SEGMENTS: SolutionSegment[] = [
  {
    slug: 'untuk-sekolah',
    name: 'Untuk Sekolah',
    eyebrow: 'SOLUSI · SEKOLAH & SMA',
    headline: 'Bimbingan karier berbasis data untuk siswa SMA',
    subheadline:
      'Bantu siswa memilih jurusan kuliah dengan percaya diri — bukan tebakan. Asesmen minat karier tervalidasi akademik dalam satu platform yang mudah dikelola tim BK.',
    heroAccent: 'peach',
    problems: [
      'Siswa memilih jurusan berdasarkan tekanan teman sebaya atau orang tua, bukan minat asli mereka',
      'Guru BK kelebihan beban — 1 guru untuk ratusan siswa — tidak ada waktu untuk konseling individual yang bermakna',
      'Tidak ada data objektif untuk mendukung rekomendasi karier: semua berbasis kesan dan wawancara singkat',
      'Banyak siswa baru menyadari jurusan yang dipilih tidak sesuai minat setelah masuk kuliah',
    ],
    useCases: [
      {
        title: 'Bimbingan Konseling Massal',
        description:
          'Jalankan asesmen minat karier untuk seluruh siswa kelas 10–12 sekaligus. Guru BK mendapat ringkasan profil per kelas tanpa harus membaca laporan satu per satu.',
      },
      {
        title: 'Pra-UTBK & Pilihan Prodi',
        description:
          'Bantu siswa kelas 12 yang sedang menyusun pilihan prodi SNBP/SNBT dengan data minat yang objektif. Kurangi risiko salah pilih prodi.',
      },
      {
        title: 'Program Kemandirian Belajar',
        description:
          'Integrasikan asesmen ke dalam program kemandirian belajar atau ekstrakurikuler BK. Laporan PDF mandiri langsung diterima siswa — tanpa sesi tambahan dari guru.',
      },
      {
        title: 'Laporan Profil Kelas',
        description:
          'Dapatkan agregat profil minat per kelas: distribusi profil minat vokasional, dominansi preferensi kepribadian, dan tren karier yang diminati untuk perencanaan program sekolah.',
      },
    ],
    recommendedProducts: ['career-interest', 'path-finder-ai', 'psyai'],
    stats: [
      { value: '15 menit', label: 'Waktu pengerjaan per siswa' },
      { value: 'Rp 150k', label: 'Mulai dari per siswa' },
      { value: '3 instrumen', label: 'Tervalidasi akademik UNJANI' },
      { value: 'PDF instan', label: 'Laporan diterima siswa langsung' },
    ],
    testimonial: {
      quote:
        'Sebelumnya saya harus mewawancarai 200+ siswa satu per satu. Sekarang saya sudah punya data objektif sebelum sesi konseling — waktu diskusi jadi jauh lebih produktif.',
      author: 'Ibu Ratna',
      role: 'Guru BK',
      institution: 'SMAN 3 Bandung',
    },
    faq: [
      {
        q: 'Berapa minimum jumlah siswa untuk paket institusional?',
        a: 'Tidak ada minimum. Anda bisa mulai dari 1 siswa dengan harga reguler. Diskon volume mulai berlaku dari 500 seat ke atas — semakin banyak, semakin hemat hingga 50% untuk 50.000+ seat.',
      },
      {
        q: 'Apakah guru BK mendapat dashboard terpisah untuk memantau siswa?',
        a: 'Ya. Paket institusional mencakup akses ke dashboard guru BK yang menampilkan status asesmen dan distribusi hasil per kelas. Hubungi tim Sekil.id untuk demo dashboard.',
      },
      {
        q: 'Bagaimana cara siswa mengakses tes?',
        a: 'Setelah institusi melakukan pembelian, siswa menerima link tes unik melalui email. Tes dapat dikerjakan dari laptop atau smartphone — tidak memerlukan instalasi aplikasi.',
      },
      {
        q: 'Apakah ada pelatihan untuk guru BK?',
        a: 'Kami menyediakan webinar onboarding gratis untuk koordinator BK dan panduan interpretasi laporan. Untuk paket 1.000+ seat, kami bisa menjadwalkan pelatihan tatap muka.',
      },
    ],
    seoTitle: 'Asesmen Karier Massal untuk Sekolah & SMA | Solusi Sekil.id',
    seoDescription:
      'Bantu siswa SMA memilih jurusan kuliah berdasarkan data minat karier. Platform asesmen massal untuk guru BK dengan dashboard sekolah dan laporan individual otomatis.',
    showATCDashboard: false,
  },
  {
    slug: 'untuk-perguruan-tinggi',
    name: 'Untuk Perguruan Tinggi',
    eyebrow: 'SOLUSI · UNIVERSITAS & POLITEKNIK',
    headline: 'Asesmen karier mahasiswa yang memperkuat layanan kemahasiswaan',
    subheadline:
      'Dari orientasi mahasiswa baru hingga persiapan wisuda: satu platform asesmen terintegrasi yang membantu pusat karier memberikan bimbingan berbasis data.',
    heroAccent: 'blue',
    problems: [
      'Pusat karier tidak memiliki data kepribadian mahasiswa yang cukup untuk memberikan bimbingan yang tepat sasaran',
      'Mahasiswa tidak tahu kekuatan dan arah karier mereka — berakhir melamar pekerjaan secara membabi buta',
      'Tidak ada instrumen standar yang konsisten digunakan di seluruh angkatan dan program studi',
      'Data asesmen tersebar di berbagai sistem atau bahkan tidak terdokumentasi secara digital',
    ],
    useCases: [
      {
        title: 'Orientasi Mahasiswa Baru',
        description:
          'Jadikan asesmen kepribadian bagian dari PKKMB atau orientasi jurusan. Mahasiswa baru langsung memiliki peta awal kekuatan dan minat mereka sejak hari pertama.',
      },
      {
        title: 'Program Magang & Karier',
        description:
          'Integrasikan asesmen ke dalam program magang: mahasiswa menyertakan profil kepribadian dalam berkas lamaran, membantu mitra industri mencocokkan posisi yang sesuai.',
      },
      {
        title: 'Konseling Pusat Karier',
        description:
          'Konselor pusat karier dapat membaca laporan asesmen sebelum sesi tatap muka — menghemat waktu dan membuat diskusi lebih substansial dan terarah.',
      },
      {
        title: 'Tracer Study Berbasis Data',
        description:
          'Korelasikan profil kepribadian alumni dengan jalur karier mereka untuk memperkuat program tracer study dan narasi employability program studi.',
      },
    ],
    recommendedProducts: ['psyai', 'career-interest', 'emotional-intelligence-test'],
    stats: [
      { value: '25 menit', label: 'Waktu asesmen terlengkap' },
      { value: 'Rp 150k–195k', label: 'Per mahasiswa' },
      { value: 'API-ready', label: 'Integrasi SIAKAD tersedia' },
      { value: 'BAN-PT', label: 'Mendukung poin akreditasi kemahasiswaan' },
    ],
    testimonial: {
      quote:
        'Pusat karier kami akhirnya punya data yang bisa dibicarakan dengan mahasiswa, bukan hanya kesan subjektif. Program magang kami jadi lebih tepat sasaran setelah mengintegrasikan Sekil.id.',
      author: 'Dr. Hendra',
      role: 'Kepala Pusat Karier',
      institution: 'Universitas Swasta Nasional Jakarta',
    },
    faq: [
      {
        q: 'Apakah Sekil.id bisa diintegrasikan dengan sistem SIAKAD kampus?',
        a: 'Ya. Kami menyediakan API dan Webhook untuk integrasi dengan sistem informasi akademik. Mahasiswa bisa masuk menggunakan SSO institusi. Hubungi tim teknis kami untuk dokumentasi API.',
      },
      {
        q: 'Apakah laporan bisa diakses ulang oleh mahasiswa setelah lulus?',
        a: 'Laporan tersimpan dalam akun mahasiswa dan dapat diakses kapanpun. Institusi dapat mengatur retensi data sesuai kebijakan masing-masing.',
      },
      {
        q: 'Apakah asesmen ini bisa digunakan sebagai kredit mata kuliah pengembangan diri?',
        a: 'Bergantung pada kebijakan program studi masing-masing. Laporan asesmen dapat dijadikan portofolio pengembangan diri. Beberapa universitas mitra telah mengintegrasikan ini ke dalam kurikulum mata kuliah soft skills.',
      },
      {
        q: 'Bagaimana privasi data mahasiswa dikelola?',
        a: 'Data mahasiswa disimpan di server Indonesia dengan enkripsi at-rest dan in-transit. Institusi tetap menjadi controller data. Kami mematuhi UU PDP Indonesia dan menyediakan DPA untuk perguruan tinggi.',
      },
    ],
    seoTitle: 'Platform Asesmen Karier Mahasiswa untuk Universitas | Solusi Sekil.id',
    seoDescription:
      'Tingkatkan layanan pusat karier universitas dengan asesmen kepribadian tervalidasi. Dari orientasi mahasiswa baru hingga program magang berbasis data profil.',
    showATCDashboard: false,
  },
  {
    slug: 'untuk-perusahaan',
    name: 'Untuk Perusahaan',
    eyebrow: 'SOLUSI · KORPORAT & HR',
    headline: 'Asesmen psikologi karyawan yang dapat dipercaya HRD',
    subheadline:
      'Dari rekrutmen hingga pengembangan kepemimpinan: data kepribadian dan kecerdasan emosional yang akurat untuk keputusan talent management yang lebih baik.',
    heroAccent: 'navy',
    problems: [
      'Keputusan rekrutmen dan promosi masih terlalu bergantung pada intuisi — bukan data yang dapat dipertanggungjawabkan',
      'Biaya mismatch budaya dan jabatan sangat tinggi: rekrutmen ulang menghabiskan 50–200% gaji tahunan posisi tersebut',
      'Program leadership development tidak efisien karena tidak berbasis profil aktual peserta',
      'HR tidak punya benchmark kepribadian dan EQ yang konsisten lintas departemen dan angkatan',
    ],
    useCases: [
      {
        title: 'Pre-Employment Assessment',
        description:
          'Tambahkan profil kepribadian dan EQ ke dalam proses seleksi sebagai data pendukung keputusan — bukan pengganti wawancara, tapi filter berbasis data yang dapat dipertanggungjawabkan.',
      },
      {
        title: 'Leadership Development Program',
        description:
          'Gunakan Leadership Styles Test dan EQ Test sebagai baseline untuk program pengembangan manajer. IDP berbasis profil aktual, bukan asumsi trainer.',
      },
      {
        title: 'Team Profiling & Building',
        description:
          'Petakan profil kepribadian seluruh tim untuk memahami komposisi, dinamika, dan potensi blind spot kolektif. Berguna sebelum merger tim atau restrukturisasi.',
      },
      {
        title: 'Talent Review & Succession',
        description:
          'Sertakan data asesmen dalam proses talent review tahunan. Identifikasi high-potential berdasarkan kombinasi kinerja dan profil kepemimpinan.',
      },
    ],
    recommendedProducts: ['leadership-styles-test', 'emotional-intelligence-test', 'psyai'],
    stats: [
      { value: '20 menit', label: 'Per sesi asesmen karyawan' },
      { value: 'ISO 27001', label: 'Standar keamanan data' },
      { value: 'Rp 30 juta', label: 'ATC Dashboard/tahun (opsional)' },
      { value: 'HRIS API', label: 'Integrasi sistem HR tersedia' },
    ],
    testimonial: {
      quote:
        'Kami menggunakan Sekil.id untuk pre-employment screening di level manajerial. Data EQ dan leadership profile membantu tim HR punya talking point yang objektif dalam panel wawancara.',
      author: 'Budi Santoso',
      role: 'Head of Talent Acquisition',
      institution: 'Perusahaan Manufaktur Nasional',
    },
    faq: [
      {
        q: 'Apakah asesmen ini bisa digunakan sebagai satu-satunya alat seleksi karyawan?',
        a: 'Tidak kami rekomendasikan. Asesmen Sekil.id adalah data pendukung — bukan pengganti wawancara, uji kompetensi teknis, atau keputusan manusia. Gunakan sebagai satu lapisan dari proses seleksi yang komprehensif.',
      },
      {
        q: 'Apakah kandidat bisa memalsukan hasil asesmen?',
        a: 'Instrumen kami menggunakan teknik forced-choice dan consistency check untuk mendeteksi social desirability bias. Kami merekomendasikan komunikasikan kepada kandidat bahwa tes ini untuk pengembangan — hasilnya akan lebih jujur.',
      },
      {
        q: 'Apakah ada ATC Dashboard untuk memantau seluruh karyawan?',
        a: 'Ya. Kami menyediakan ATC (Assessment Tracking Center) Dashboard seharga Rp 30 juta/tahun — platform terintegrasi untuk memantau status asesmen, menganalisis distribusi profil, dan mengekspor data ke HRIS.',
      },
      {
        q: 'Bagaimana SLA dan dukungan teknis untuk enterprise?',
        a: 'Paket enterprise mencakup dedicated account manager, SLA 99.5% uptime, dan dukungan teknis prioritas. Kami juga menyediakan onboarding tatap muka untuk tim HR dan IT.',
      },
    ],
    seoTitle: 'Asesmen Psikologi Karyawan untuk Perusahaan & HRD | Solusi Sekil.id',
    seoDescription:
      'Platform asesmen psikologi korporat: leadership development, EQ assessment, dan talent profiling tervalidasi akademik. Integrasi HRIS dan ATC Dashboard tersedia.',
    showATCDashboard: true,
  },
  {
    slug: 'untuk-yayasan',
    name: 'Untuk Yayasan',
    eyebrow: 'SOLUSI · YAYASAN & LEMBAGA SOSIAL',
    headline: 'Asesmen karier bersubsidi untuk program sosial dan beasiswa',
    subheadline:
      'Bantu penerima manfaat yayasan Anda menemukan arah karier dengan asesmen tervalidasi akademik — dengan harga institusional dan dukungan implementasi yang fleksibel.',
    heroAccent: 'ink',
    problems: [
      'Penerima beasiswa atau program pemberdayaan sering tidak memiliki akses ke bimbingan karier yang berkualitas',
      'Yayasan sulit mengukur dampak program pengembangan SDM secara objektif dan terstandar',
      'Asesmen karier berkualitas biasanya terlalu mahal untuk diskalakan di program sosial dengan anggaran terbatas',
      'Tidak ada cara yang mudah untuk mendokumentasikan profil penerima manfaat secara sistematis',
    ],
    useCases: [
      {
        title: 'Program Beasiswa & Pendampingan',
        description:
          'Jadikan asesmen karier bagian dari onboarding penerima beasiswa. Data profil membantu mentor mengarahkan pendampingan yang lebih personal dan tepat sasaran.',
      },
      {
        title: 'Program Pemberdayaan Perempuan',
        description:
          'Gunakan EQ Test dan Career Interest untuk pemetaan potensi peserta program pemberdayaan. Data mendukung pelaporan dampak kepada donatur dan pemerintah.',
      },
      {
        title: 'Pelatihan & Bootcamp Karier',
        description:
          'Integrasikan asesmen ke dalam bootcamp atau pelatihan vokasional. Peserta mendapat profil diri yang memperkuat self-awareness dan motivasi belajar.',
      },
      {
        title: 'Monitoring & Evaluasi Dampak',
        description:
          'Gunakan data agregat asesmen untuk laporan M&E kepada donatur dan stakeholder. Profil sebelum-sesudah program memberikan narasi dampak yang terukur.',
      },
    ],
    recommendedProducts: ['career-interest', 'emotional-intelligence-test', 'path-finder-ai'],
    stats: [
      { value: 'Rp 150k', label: 'Mulai dari per penerima manfaat' },
      { value: 'Diskon NGO', label: 'Tersedia untuk yayasan terverifikasi' },
      { value: 'PDF & API', label: 'Fleksibel untuk berbagai sistem' },
      { value: 'M&E ready', label: 'Data siap untuk laporan dampak' },
    ],
    testimonial: {
      quote:
        'Program beasiswa kami sekarang punya data profil untuk 300+ penerima. Mentor bisa langsung menyesuaikan pendampingan berdasarkan profil minat — bukan hanya nilai akademik.',
      author: 'Dewi Kusuma',
      role: 'Program Director',
      institution: 'Yayasan Pendidikan Nusantara',
    },
    faq: [
      {
        q: 'Apakah ada diskon khusus untuk yayasan atau NGO?',
        a: 'Ya. Kami menyediakan harga khusus untuk yayasan terdaftar dan lembaga sosial non-profit yang terverifikasi. Diskon NGO berada di atas diskon volume reguler. Hubungi tim Sekil.id dengan menyertakan akta yayasan atau dokumen legalitas.',
      },
      {
        q: 'Apakah asesmen bisa dijalankan di daerah dengan koneksi internet terbatas?',
        a: 'Saat ini asesmen memerlukan koneksi internet untuk mengerjakan tes dan menerima laporan. Namun laporan PDF bisa diunduh dan disimpan offline setelah selesai. Kami sedang mengembangkan mode offline untuk pilot di daerah 3T.',
      },
      {
        q: 'Apakah Sekil.id menyediakan fasilitator untuk program?',
        a: 'Untuk program dengan 500+ penerima manfaat, kami dapat mengirimkan tim fasilitator untuk sesi onboarding dan interpretasi hasil. Hubungi tim kami untuk mendiskusikan kebutuhan spesifik program Anda.',
      },
      {
        q: 'Bagaimana data penerima manfaat dilindungi?',
        a: 'Data tersimpan di server aman dengan enkripsi penuh. Yayasan sebagai controller data memiliki kendali penuh atas akses dan retensi. Kami mematuhi UU PDP Indonesia dan menyediakan DPA untuk lembaga yang membutuhkan.',
      },
    ],
    seoTitle: 'Asesmen Karier untuk Yayasan & Lembaga Sosial | Solusi Sekil.id',
    seoDescription:
      'Platform asesmen karier bersubsidi untuk yayasan, NGO, dan program beasiswa. Harga institusional, dukungan M&E, dan data profil penerima manfaat yang terstandar.',
    showATCDashboard: true,
  },
];

export function getSegmentBySlug(slug: string): SolutionSegment | undefined {
  return SOLUTION_SEGMENTS.find((s) => s.slug === slug);
}

export interface Bundle {
  id: string;
  name: string;
  tagline: string;
  productSlugs: string[];
  bundlePrice: number;
  comingSoon?: boolean;
}

export const BUNDLES: Bundle[] = [
  {
    id: 'career-starter',
    name: 'Career Starter',
    tagline: 'Eksplorasi awal minat karier dan pilihan jurusan kuliah',
    productSlugs: ['career-interest', 'path-finder-ai'],
    bundlePrice: 250000,
  },
  {
    id: 'corporate-leadership',
    name: 'Corporate Leadership',
    tagline: 'Kepemimpinan dan kecerdasan emosional untuk manajer dan HR',
    productSlugs: ['leadership-styles-test', 'emotional-intelligence-test', 'psyai'],
    bundlePrice: 470000,
  },
  {
    id: 'comprehensive-personality',
    name: 'Comprehensive Personality',
    tagline: 'Profil kepribadian lengkap lintas tiga dimensi asesmen: minat, kepribadian, dan kebutuhan kerja',
    productSlugs: ['psyai', 'career-interest', 'emotional-intelligence-test'],
    bundlePrice: 450000,
  },
  {
    id: 'self-awareness',
    name: 'Self Awareness',
    tagline: 'Kenali diri lebih dalam dengan 4 instrumen terintegrasi',
    productSlugs: [],
    bundlePrice: 0,
    comingSoon: true,
  },
];
