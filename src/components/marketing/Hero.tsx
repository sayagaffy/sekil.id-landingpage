import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';

type HeroBackground = 'default' | 'dot-pattern' | 'gradient';

interface CTAButton {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

interface HeroProps {
  heading: string;
  subheading?: string;
  primaryCta?: CTAButton;
  secondaryCta?: CTAButton;
  image?: { src: string; alt: string; width: number; height: number };
  background?: HeroBackground;
  className?: string;
}

const BG_CLASSES: Record<HeroBackground, string> = {
  default: 'bg-background',
  'dot-pattern': 'bg-dot-pattern',
  gradient: 'bg-gradient-to-br from-primary-50 to-background',
};

export function Hero({
  heading,
  subheading,
  primaryCta,
  secondaryCta,
  image,
  background = 'dot-pattern',
  className,
}: HeroProps) {
  return (
    <section className={cn('relative overflow-hidden py-20 sm:py-28 lg:py-32', BG_CLASSES[background], className)}>
      <Container>
        <div className={cn('mx-auto max-w-3xl text-center', image ? 'lg:text-left lg:max-w-none lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center' : '')}>
          <div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {heading}
            </h1>
            {subheading && (
              <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
                {subheading}
              </p>
            )}
            {(primaryCta || secondaryCta) && (
              <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
                {primaryCta && (
                  <Button
                    size="lg"
                    asChild
                    className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-md"
                  >
                    <Link href={primaryCta.href}>{primaryCta.label}</Link>
                  </Button>
                )}
                {secondaryCta && (
                  <Button size="lg" variant="outline" asChild>
                    <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
          {image && (
            <div className="hidden lg:block">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="rounded-2xl shadow-xl"
                priority
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
