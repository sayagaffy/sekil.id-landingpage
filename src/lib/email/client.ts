import { Resend } from 'resend';

let _client: Resend | null = null;

export function getResend(): Resend {
  if (!_client) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY not configured');
    _client = new Resend(key);
  }
  return _client;
}

export const EMAIL_FROM = process.env.RESEND_FROM || 'Sekil.id <hello@sekil.id>';
export const SALES_EMAIL = process.env.SALES_NOTIFICATION_EMAIL || 'sales@sekil.id';
