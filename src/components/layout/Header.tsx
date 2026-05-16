'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/produk', label: 'Produk' },
  { href: '/solusi', label: 'Solusi' },
  { href: '/harga', label: 'Harga' },
  { href: '/metodologi', label: 'Metodologi' },
  { href: '/blog', label: 'Blog' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-shadow duration-200',
        scrolled ? 'bg-background/95 shadow-sm backdrop-blur-sm' : 'bg-background'
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
            Sekil.id
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Navigasi utama">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/demo">Coba Tes Gratis</Link>
            </Button>
            <Button size="sm" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/demo">Demo Gratis</Link>
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Buka menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 pt-6">
                <Link
                  href="/"
                  className="font-display text-xl font-bold text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Sekil.id
                </Link>
                <nav className="flex flex-col gap-1" aria-label="Navigasi mobile">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-2 border-t pt-4">
                  <Button variant="outline" asChild>
                    <Link href="/demo" onClick={() => setMobileOpen(false)}>
                      Coba Tes Gratis
                    </Link>
                  </Button>
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/demo" onClick={() => setMobileOpen(false)}>
                      Demo Gratis
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
