'use client';

import { Turnstile } from '@marsidev/react-turnstile';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
}

export function TurnstileWidget({ onSuccess, onError }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    return (
      <div className="rounded border border-dashed border-border p-3 text-xs text-muted-foreground">
        Turnstile: set NEXT_PUBLIC_TURNSTILE_SITE_KEY in .env.local
      </div>
    );
  }

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onSuccess}
      onError={onError}
      options={{ theme: 'light', size: 'normal' }}
    />
  );
}
