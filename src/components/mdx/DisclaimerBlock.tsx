const DEFAULT_TEXT: Record<string, string> = {
  psikologi:
    'Informasi dalam artikel ini bersifat edukatif dan deskriptif — bukan diagnosis klinis. Hasil ini bukan pengganti konsultasi profesional dengan psikolog atau psikiater berlisensi. Jika Anda memerlukan bantuan, silakan hubungi profesional kesehatan mental yang qualified.',
  karier:
    'Panduan karier ini bersifat indikatif berdasarkan data agregat — bukan saran karier individual. Keputusan karier sebaiknya dibuat bersama konselor karier atau mentor profesional yang memahami konteks Anda secara menyeluruh.',
  pendidikan:
    'Informasi jurusan ini bersifat umum dan deskriptif. Persyaratan dan kurikulum dapat berbeda antar universitas. Selalu verifikasi informasi terkini langsung ke lembaga pendidikan yang bersangkutan.',
  general:
    'Konten ini bersifat informatif dan tidak dimaksudkan sebagai saran profesional. Konsultasikan dengan ahli yang relevan sebelum membuat keputusan penting.',
}

interface DisclaimerBlockProps {
  type?: 'psikologi' | 'karier' | 'pendidikan' | 'general'
  customText?: string
}

export function DisclaimerBlock({ type = 'psikologi', customText }: DisclaimerBlockProps) {
  const text = customText || DEFAULT_TEXT[type] || DEFAULT_TEXT.general
  return (
    <aside
      className="my-8 border-2 border-ink bg-peach-300/20 p-5 shadow-[4px_4px_0px_0px_#0a1230]"
      role="note"
      aria-label="Disclaimer"
    >
      <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
        ⚠ DISCLAIMER
      </p>
      <p className="text-sm leading-relaxed text-ash-700">{text}</p>
    </aside>
  )
}
