'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';

export function CookieConsent() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('sekil-cookie-consent');
    if (!consent) setShown(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('sekil-cookie-consent', 'accepted');
    localStorage.setItem('sekil-cookie-consent-date', new Date().toISOString());
    setShown(false);
    window.dispatchEvent(new Event('consent-accepted'));
  };

  const handleReject = () => {
    localStorage.setItem('sekil-cookie-consent', 'rejected');
    setShown(false);
  };

  if (!shown) return null;

  return (
    <div
      role="dialog"
      aria-label="Persetujuan cookie"
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-4 shadow-lg backdrop-blur-sm md:p-6"
    >
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            Kami menggunakan cookies untuk analytics dan meningkatkan pengalaman Anda.{' '}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
              Pelajari lebih lanjut
            </Link>
            .
          </p>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" onClick={handleReject}>
              Tolak
            </Button>
            <Button size="sm" onClick={handleAccept}>
              Terima
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
