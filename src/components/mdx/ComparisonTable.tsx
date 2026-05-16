interface ComparisonTableProps {
  headers: string[]
  rows: { cells: string[] }[]
}

export function ComparisonTable({ headers, rows }: ComparisonTableProps) {
  return (
    <div className="my-6 overflow-x-auto border-2 border-ink shadow-[4px_4px_0px_0px_#0a1230]">
      <p className="border-b-2 border-ink bg-ink px-4 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-paper">
        PERBANDINGAN
      </p>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="border-b-2 border-r border-ink bg-ink/10 px-4 py-2 text-left font-mono text-[11px] uppercase tracking-[0.12em] text-ink last:border-r-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="even:bg-paper/60">
              {row.cells.map((cell, ci) => (
                <td
                  key={ci}
                  className="border-b border-r border-ash-300 px-4 py-2 text-ash-700 last:border-r-0"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
