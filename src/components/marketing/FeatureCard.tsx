import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: 'default' | 'peach' | 'navy';
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  variant = 'default',
  className,
}: FeatureCardProps) {
  const isNavy = variant === 'navy';
  const isPeach = variant === 'peach';

  return (
    <div
      className={cn(
        'flex flex-col border-2 border-ink shadow-md transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lg',
        isNavy ? 'bg-navy-900' : isPeach ? 'bg-peach-300' : 'bg-white',
        className
      )}
    >
      {/* Card header strip */}
      <div
        className={cn(
          'border-b-2 border-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em]',
          isNavy ? 'bg-blue-500 text-white' : 'bg-ink text-white'
        )}
      >
        <Icon size={14} strokeWidth={2} className="inline mr-2 align-middle" aria-hidden="true" />
        {title}
      </div>
      {/* Card body */}
      <div className="flex-1 p-6">
        <p className={cn('text-sm leading-relaxed', isNavy ? 'text-sky-200' : 'text-ash-700')}>
          {description}
        </p>
      </div>
    </div>
  );
}
