interface LeadData {
  fullName: string;
  institutionName: string;
}

export function demoRequestConfirmationEmail(lead: LeadData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0F172A;">
      <div style="background: #0E2A56; padding: 32px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: #FFD93D; margin: 0; font-size: 28px;">Sekil.id</h1>
        <p style="color: #D6E2F5; margin: 8px 0 0;">Platform Asesmen Psikologi & Pemetaan Karier</p>
      </div>
      <div style="padding: 32px; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #0E2A56;">Terima kasih, ${lead.fullName}!</h2>
        <p>Kami sudah menerima permintaan demo Anda untuk <strong>${lead.institutionName}</strong>.</p>
        <p>Tim Sekil.id (didukung B One Corp) akan menghubungi Anda via <strong>WhatsApp atau email dalam 24 jam kerja</strong> untuk diskusi kebutuhan dan menjadwalkan walkthrough produk.</p>
        <h3 style="color: #0E2A56; margin-top: 24px;">Sambil menunggu, eksplorasi:</h3>
        <ul style="padding-left: 20px; line-height: 1.8;">
          <li><a href="https://sekil.id/produk" style="color: #0E2A56;">Katalog produk asesmen kami</a></li>
          <li><a href="https://sekil.id/metodologi" style="color: #0E2A56;">Metodologi & validasi akademik UNJANI</a></li>
          <li><a href="https://sekil.id/blog" style="color: #0E2A56;">Blog & insight karier</a></li>
        </ul>
        <p style="margin-top: 32px;">Salam,<br/><strong>Tim Sekil.id</strong></p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #E2E8F0;" />
        <p style="color: #94A3B8; font-size: 12px; text-align: center;">
          Email ini dikirim otomatis. Untuk respon cepat, balas email ini langsung.<br/>
          © ${new Date().getFullYear()} PT Dart Prihaditama Studio · Bandung, Indonesia
        </p>
      </div>
    </div>
  `;
}
