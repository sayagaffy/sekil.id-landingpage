import { z } from 'zod';

export const demoSchema = z.object({
  fullName: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().email('Format email tidak valid'),
  whatsapp: z.string().regex(/^\+?[0-9]{10,15}$/, 'Format nomor WhatsApp tidak valid'),
  institutionName: z.string().min(2).max(150),
  institutionType: z.enum([
    'SMA',
    'SMK',
    'PT_NEGERI',
    'PT_SWASTA',
    'PERUSAHAAN',
    'YAYASAN',
    'LAINNYA',
  ]),
  estimatedSeats: z.enum(['<100', '100-500', '500-2000', '2000-5000', '>5000']),
  interestedProducts: z.array(z.string()).default([]),
  message: z.string().max(500).optional(),
  turnstileToken: z.string().min(1, 'Captcha required'),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  referrer: z.string().optional(),
});

export type DemoFormData = z.infer<typeof demoSchema>;
