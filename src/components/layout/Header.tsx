'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { APP_URL } from '@/lib/env';

const NAV_LINKS = [
  { href: '/produk', label: 'Produk' },
  { href: '/solusi', label: 'Solusi' },
  { href: '/harga', label: 'Harga' },
  { href: '/metodologi', label: 'Metodologi' },
  { href: '/blog', label: 'Blog' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-ink bg-paper">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Sekil.id beranda">
          <Image
            src="/logo-color.png"
            alt="Sekil.id"
            width={120}
            height={32}
            priority
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigasi utama">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-sm font-medium text-ink transition-colors hover:text-blue-500"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <a href={`${APP_URL}/login`} rel="noopener">Masuk</a>
          </Button>
          <Button variant="brand" size="sm" asChild>
            <Link href="/demo">Mulai asesmen &rarr;</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Buka menu" className="border-0">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 border-l-2 border-ink bg-paper p-0">
            <div className="flex flex-col gap-0 pt-4">
              <div className="border-b-2 border-ink px-6 pb-4">
                <Image src="/logo-color.png" alt="Sekil.id" width={100} height={28} className="h-7 w-auto" />
              </div>
              <nav className="flex flex-col" aria-label="Navigasi mobile">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="border-b border-ash-200 px-6 py-3 font-display text-sm font-medium text-ink hover:bg-blue-50 hover:text-blue-500"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-3 border-t-2 border-ink p-6">
                <Button variant="outline" asChild>
                  <a
                    href={`${APP_URL}/login`}
                    rel="noopener"
                    onClick={() => setMobileOpen(false)}
                  >
                    Masuk
                  </a>
                </Button>
                <Button variant="brand" asChild>
                  <Link href="/demo" onClick={() => setMobileOpen(false)}>
                    Mulai asesmen &rarr;
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
