interface SalaryChartProps {
  min: number;
  max: number;
  currency: string;
}

function formatRupiahMillions(amount: number): string {
  const millions = amount / 1000000;
  if (millions >= 1) return `${millions % 1 === 0 ? millions : millions.toFixed(1)} jt`;
  const thousands = amount / 1000;
  return `${thousands}rb`;
}

export function SalaryChart({ min, max }: SalaryChartProps) {
  const midpoint = (min + max) / 2;
  const market = midpoint * 1.15;
  const entries = [
    { label: 'Junior', value: min, pct: 40 },
    { label: 'Mid', value: midpoint, pct: 65 },
    { label: 'Senior', value: max, pct: 100 },
    { label: 'Market Max', value: market, pct: Math.min(100, (market / max) * 100) },
  ];

  return (
    <div className="border-2 border-ink p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-700">
        Estimasi Rentang Gaji (IDR / bulan)
      </p>
      <div className="mt-4 space-y-3">
        {entries.slice(0, 3).map(({ label, value, pct }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-12 font-mono text-[10px] text-ash-700">{label}</span>
            <div className="flex-1">
              <div className="h-6 bg-ash-300/30">
                <div
                  className="h-6 bg-blue-500"
                  style={{ width: `${pct}%` }}
                  role="presentation"
                />
              </div>
            </div>
            <span className="w-14 text-right font-mono text-[11px] font-medium text-ink">
              {formatRupiahMillions(value)}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[9px] text-ash-700">
        * Estimasi berdasarkan data LinkedIn Indonesia 2025. Gaji aktual bervariasi tergantung
        perusahaan, lokasi, dan pengalaman.
      </p>
    </div>
  );
}
