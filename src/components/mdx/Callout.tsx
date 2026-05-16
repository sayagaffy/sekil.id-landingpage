import { cn } from '@/lib/utils';

interface CalloutProps {
  type?: 'info' | 'warning' | 'tip';
  children: React.ReactNode;
}

const STYLES = {
  info: 'border-blue-500 bg-blue-500/10',
  warning: 'border-peach-300 bg-peach-300/20',
  tip: 'border-ink bg-paper',
};

const LABELS = {
  info: 'INFO',
  warning: 'PERHATIAN',
  tip: 'TIP',
};

export function Callout({ type = 'info', children }: CalloutProps) {
  return (
    <div className={cn('my-6 border-l-4 border-2 p-4', STYLES[type])}>
      <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
        {LABELS[type]}
      </p>
      <div className="text-sm leading-relaxed text-ash-700">{children}</div>
    </div>
  );
}
