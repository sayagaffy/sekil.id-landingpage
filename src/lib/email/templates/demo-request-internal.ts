interface LeadData {
  fullName: string;
  email: string;
  whatsapp: string;
  institutionName: string;
  institutionType: string;
  estimatedSeats: string;
  interestedProducts: string[];
  message?: string | null;
  source?: string | null;
  medium?: string | null;
  campaign?: string | null;
  referrer?: string | null;
  id: string;
}

export function demoRequestInternalEmail(lead: LeadData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0F172A;">
      <h2 style="color: #0E2A56; border-bottom: 2px solid #FFD93D; padding-bottom: 8px;">
        Demo Request Baru — Sekil.id
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; font-weight: bold; width: 40%;">Nama:</td><td style="padding: 8px;">${lead.fullName}</td></tr>
        <tr style="background: #F8F9FA;"><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">WhatsApp:</td><td style="padding: 8px;">${lead.whatsapp}</td></tr>
        <tr style="background: #F8F9FA;"><td style="padding: 8px; font-weight: bold;">Institusi:</td><td style="padding: 8px;">${lead.institutionName}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Tipe Institusi:</td><td style="padding: 8px;">${lead.institutionType}</td></tr>
        <tr style="background: #F8F9FA;"><td style="padding: 8px; font-weight: bold;">Estimasi Peserta:</td><td style="padding: 8px;">${lead.estimatedSeats}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Produk Minat:</td><td style="padding: 8px;">${lead.interestedProducts.join(', ') || '—'}</td></tr>
      </table>
      <h3 style="color: #0E2A56;">Pesan:</h3>
      <blockquote style="border-left: 3px solid #FFD93D; margin: 0; padding: 12px 16px; background: #F8F9FA; color: #475569;">
        ${lead.message || '(tidak ada pesan)'}
      </blockquote>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #E2E8F0;" />
      <p style="color: #64748B; font-size: 12px;">
        UTM: ${lead.source || '—'} / ${lead.medium || '—'} / ${lead.campaign || '—'}<br/>
        Referrer: ${lead.referrer || '—'}<br/>
        Lead ID: <code>${lead.id}</code>
      </p>
      <p style="background: #FFD93D; padding: 12px; border-radius: 6px; font-weight: bold; color: #0E2A56;">
        Hubungi via WhatsApp dalam 24 jam kerja.
      </p>
    </div>
  `;
}
