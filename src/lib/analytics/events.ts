declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
  }
}

export function trackEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', eventName, params);
}

export const events = {
  demoFormStarted: () => trackEvent('demo_form_started'),
  demoFormSubmitted: (institutionType: string, seatEstimate: string) =>
    trackEvent('demo_form_submitted', {
      institution_type: institutionType,
      seat_estimate: seatEstimate,
    }),
  waitlistSubmitted: (segment: string) => trackEvent('waitlist_submitted', { segment }),
  ctaClicked: (location: string, ctaText: string) =>
    trackEvent('cta_clicked', { location, cta_text: ctaText }),
  pricingCalculatorUsed: (price: number) =>
    trackEvent('pricing_calculator_used', { calculated_price: price }),
  productCardClicked: (slug: string) =>
    trackEvent('product_card_clicked', { product_slug: slug }),
};
