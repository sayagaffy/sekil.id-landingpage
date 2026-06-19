'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { demoSchema, type DemoFormData } from '@/lib/validation/demo-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TurnstileWidget } from './TurnstileWidget';
import { events } from '@/lib/analytics/events';

const INSTITUTION_TYPES = [
  { value: 'SMA', label: 'SMA / Madrasah Aliyah' },
  { value: 'SMK', label: 'SMK' },
  { value: 'PT_NEGERI', label: 'Perguruan Tinggi Negeri' },
  { value: 'PT_SWASTA', label: 'Perguruan Tinggi Swasta' },
  { value: 'PERUSAHAAN', label: 'Perusahaan / Korporasi' },
  { value: 'YAYASAN', label: 'Yayasan / LSM' },
  { value: 'LAINNYA', label: 'Lainnya' },
] as const;

const SEAT_OPTIONS = [
  { value: '<100', label: 'Kurang dari 100 peserta' },
  { value: '100-500', label: '100 – 500 peserta' },
  { value: '500-2000', label: '500 – 2.000 peserta' },
  { value: '2000-5000', label: '2.000 – 5.000 peserta' },
  { value: '>5000', label: 'Lebih dari 5.000 peserta' },
] as const;

const PRODUCTS = [
  { value: 'Career Interest', label: 'Career Interest' },
  { value: 'PsyAI', label: 'PsyAI' },
  { value: 'Path Finder AI', label: 'Path Finder AI' },
  { value: 'Leadership Styles Test', label: 'Leadership Styles Test' },
  { value: 'Emotional Intelligence Test', label: 'Emotional Intelligence Test' },
  { value: 'Self DiscoveryAI', label: 'Self DiscoveryAI' },
  { value: 'Goal AlignAI', label: 'Goal AlignAI' },
  { value: 'Goal Orientation Coaching', label: 'Goal Orientation Coaching' },
  { value: 'Professional Authenticity Test', label: 'Professional Authenticity Test' },
  { value: 'Job Burnout Test', label: 'Job Burnout Test' },
  { value: 'Personal Authenticity Test', label: 'Personal Authenticity Test' },
];

export function DemoForm() {
  const router = useRouter();
  const [turnstileToken, setTurnstileToken] = useState('');
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DemoFormData>({
    resolver: zodResolver(demoSchema),
    defaultValues: { interestedProducts: [], turnstileToken: '' },
  });

  const selectedProducts = watch('interestedProducts') ?? [];

  useEffect(() => {
    events.demoFormStarted();

    const params = new URLSearchParams(window.location.search);
    const utm_source = params.get('utm_source') ?? undefined;
    const utm_medium = params.get('utm_medium') ?? undefined;
    const utm_campaign = params.get('utm_campaign') ?? undefined;

    if (utm_source) setValue('utm_source', utm_source);
    if (utm_medium) setValue('utm_medium', utm_medium);
    if (utm_campaign) setValue('utm_campaign', utm_campaign);
    setValue('referrer', document.referrer || undefined);
  }, [setValue]);

  useEffect(() => {
    setValue('turnstileToken', turnstileToken);
  }, [turnstileToken, setValue]);

  function toggleProduct(product: string) {
    const current = selectedProducts;
    const updated = current.includes(product)
      ? current.filter((p: string) => p !== product)
      : [...current, product];
    setValue('interestedProducts', updated);
  }

  async function onSubmit(data: DemoFormData) {
    setSubmitting(true);
    setServerError('');
    try {
      const res = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        events.demoFormSubmitted(data.institutionType, data.estimatedSeats);
        router.push('/demo/terimakasih');
      } else {
        const body = (await res.json()) as { error?: string };
        setServerError(body.error ?? 'Terjadi kesalahan. Silakan coba lagi.');
      }
    } catch {
      setServerError('Gagal terhubung ke server. Periksa koneksi internet Anda.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Full Name */}
      <div className="space-y-1.5">
        <Label htmlFor="fullName">Nama Lengkap *</Label>
        <Input id="fullName" placeholder="Contoh: Budi Santoso" {...register('fullName')} />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email Kantor *</Label>
        <Input
          id="email"
          type="email"
          placeholder="budi@universitas.ac.id"
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      {/* WhatsApp */}
      <div className="space-y-1.5">
        <Label htmlFor="whatsapp">Nomor WhatsApp *</Label>
        <Input id="whatsapp" placeholder="+628123456789" {...register('whatsapp')} />
        {errors.whatsapp && (
          <p className="text-sm text-destructive">{errors.whatsapp.message}</p>
        )}
      </div>

      {/* Institution Name */}
      <div className="space-y-1.5">
        <Label htmlFor="institutionName">Nama Institusi *</Label>
        <Input
          id="institutionName"
          placeholder="Universitas / Sekolah / Perusahaan"
          {...register('institutionName')}
        />
        {errors.institutionName && (
          <p className="text-sm text-destructive">{errors.institutionName.message}</p>
        )}
      </div>

      {/* Institution Type */}
      <div className="space-y-1.5">
        <Label htmlFor="institutionType">Tipe Institusi *</Label>
        <Select onValueChange={(val) => setValue('institutionType', val as DemoFormData['institutionType'])}>
          <SelectTrigger id="institutionType">
            <SelectValue placeholder="Pilih tipe institusi..." />
          </SelectTrigger>
          <SelectContent>
            {INSTITUTION_TYPES.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.institutionType && (
          <p className="text-sm text-destructive">{errors.institutionType.message}</p>
        )}
      </div>

      {/* Estimated Seats */}
      <div className="space-y-1.5">
        <Label htmlFor="estimatedSeats">Estimasi Jumlah Peserta *</Label>
        <Select onValueChange={(val) => setValue('estimatedSeats', val as DemoFormData['estimatedSeats'])}>
          <SelectTrigger id="estimatedSeats">
            <SelectValue placeholder="Pilih kisaran peserta..." />
          </SelectTrigger>
          <SelectContent>
            {SEAT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.estimatedSeats && (
          <p className="text-sm text-destructive">{errors.estimatedSeats.message}</p>
        )}
      </div>

      {/* Interested Products */}
      <div className="space-y-2">
        <Label>Produk yang Diminati</Label>
        <div className="grid grid-cols-2 gap-2">
          {PRODUCTS.map((p) => (
            <div key={p.value} className="flex items-center gap-2">
              <Checkbox
                id={`product-${p.value}`}
                checked={selectedProducts.includes(p.value)}
                onCheckedChange={() => toggleProduct(p.value)}
              />
              <Label htmlFor={`product-${p.value}`} className="font-normal cursor-pointer">
                {p.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="message">
          Ceritakan kebutuhan Anda{' '}
          <span className="text-muted-foreground text-xs">(opsional)</span>
        </Label>
        <Textarea
          id="message"
          placeholder="Contoh: Kami ingin melakukan asesmen minat-bakat untuk 500 mahasiswa baru..."
          rows={4}
          maxLength={500}
          {...register('message')}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      {/* Turnstile */}
      <div className="space-y-1.5">
        <TurnstileWidget
          onSuccess={setTurnstileToken}
          onError={() => setTurnstileToken('')}
        />
        {errors.turnstileToken && (
          <p className="text-sm text-destructive">Selesaikan verifikasi captcha terlebih dahulu.</p>
        )}
      </div>

      {serverError && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <Button
        type="submit"
        variant="brand"
        size="lg"
        className="w-full"
        disabled={submitting}
      >
        {submitting ? 'Mengirim...' : 'Jadwalkan Demo Gratis →'}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Dengan mengirim form ini, Anda menyetujui{' '}
        <a href="/kebijakan-privasi" className="underline hover:text-foreground">
          Kebijakan Privasi
        </a>{' '}
        kami. Tidak ada spam.
      </p>
    </form>
  );
}
