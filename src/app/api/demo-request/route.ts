import { NextRequest, NextResponse } from 'next/server';
import { demoSchema } from '@/lib/validation/demo-schema';
import { verifyTurnstile } from '@/lib/turnstile/verify';
import { prisma } from '@/lib/db';
import { getResend, EMAIL_FROM, SALES_EMAIL } from '@/lib/email/client';
import { demoRequestInternalEmail } from '@/lib/email/templates/demo-request-internal';
import { demoRequestConfirmationEmail } from '@/lib/email/templates/demo-request-confirmation';

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = demoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const turnstileOk = await verifyTurnstile(data.turnstileToken);
    if (!turnstileOk) {
      return NextResponse.json({ error: 'Captcha verification failed' }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        whatsapp: data.whatsapp,
        institutionName: data.institutionName,
        institutionType: data.institutionType,
        estimatedSeats: data.estimatedSeats,
        interestedProducts: data.interestedProducts,
        message: data.message ?? null,
        source: data.utm_source ?? null,
        medium: data.utm_medium ?? null,
        campaign: data.utm_campaign ?? null,
        referrer: data.referrer ?? null,
      },
    });

    await Promise.all([
      getResend().emails.send({
        from: EMAIL_FROM,
        to: [SALES_EMAIL],
        subject: `[Demo Request] ${data.institutionName} — ${data.fullName}`,
        html: demoRequestInternalEmail({
          fullName: lead.fullName,
          email: lead.email,
          whatsapp: lead.whatsapp,
          institutionName: lead.institutionName,
          institutionType: lead.institutionType,
          estimatedSeats: lead.estimatedSeats,
          interestedProducts: lead.interestedProducts,
          message: lead.message,
          source: lead.source,
          medium: lead.medium,
          campaign: lead.campaign,
          referrer: lead.referrer,
          id: lead.id,
        }),
      }),
      getResend().emails.send({
        from: EMAIL_FROM,
        to: [lead.email],
        reply_to: process.env.REPLY_TO_EMAIL,
        subject: 'Permintaan Demo Sekil.id Kami Terima ✓',
        html: demoRequestConfirmationEmail({
          fullName: lead.fullName,
          institutionName: lead.institutionName,
        }),
      }),
    ]);

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error('demo-request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
