import { cn } from '@/lib/utils';

interface CalloutProps {
  type?: 'info' | 'warning' | 'tip' | 'important';
  title?: string;
  /** body prop used when rendered via Keystatic MDX blocks (structured) */
  body?: string;
  children?: React.ReactNode;
}

const STYLES = {
  info: 'border-blue-500 bg-blue-500/10',
  warning: 'border-peach-300 bg-peach-300/20',
  tip: 'border-ink bg-paper',
  important: 'border-ink bg-ink text-paper',
};

const LABELS = {
  info: 'INFO',
  warning: 'PERHATIAN',
  tip: 'TIP',
  important: 'PENTING',
};

export function Callout({ type = 'info', title, body, children }: CalloutProps) {
  const labelColor = type === 'important' ? 'text-paper' : 'text-ink';
  const bodyColor = type === 'important' ? 'text-paper/80' : 'text-ash-700';
  return (
    <div className={cn('my-6 border-2 border-l-4 p-4 shadow-[4px_4px_0px_0px_#0a1230]', STYLES[type])}>
      <p className={cn('mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em]', labelColor)}>
        {title || LABELS[type]}
      </p>
      <div className={cn('text-sm leading-relaxed', bodyColor)}>
        {body ?? children}
      </div>
    </div>
  );
}
