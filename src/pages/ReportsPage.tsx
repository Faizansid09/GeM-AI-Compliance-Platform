// MOCK — replace with real export endpoints when available
const REPORTS = [
  { id: 'r1', title: 'Compliance Summary Report', desc: 'Full compliance breakdown for all verified bidders in this tender.', icon: '📊', category: 'Summary' },
  { id: 'r2', title: 'High Risk Bidders Report', desc: 'Bidders flagged with High risk level requiring officer attention.', icon: '⚠️', category: 'Risk' },
  { id: 'r3', title: 'Failed Compliance Checks', desc: 'All checks with FAIL status across all bidders.', icon: '❌', category: 'Compliance' },
  { id: 'r4', title: 'Manual Review Cases', desc: 'Checks requiring human officer review (MANUAL_REVIEW status).', icon: '🔍', category: 'Review' },
  { id: 'r5', title: 'Bid Verification Report', desc: 'Individual verification report for a specific bidder.', icon: '📋', category: 'Bidder' },
  { id: 'r6', title: 'Officer Decision Dossier', desc: 'Consolidated records of all officer approvals, rejections, and overrides.', icon: '📁', category: 'Decisions' },
];

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Reports</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Generate and export compliance reports for procurement records.
        </p>
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((r) => (
          <div key={r.id} className="card flex flex-col p-5">
            <div className="flex items-start justify-between">
              <span className="text-3xl">{r.icon}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {r.category}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-900">{r.title}</h3>
            <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-500">{r.desc}</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => alert('Report generation requires a backend export endpoint. Contact the backend team to implement GET /api/v1/reports.')}
              >
                Generate
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
                onClick={() => alert('PDF export requires a backend endpoint. Pending implementation.')}
                title="Export PDF"
              >
                PDF
              </button>
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
                onClick={() => alert('CSV export requires a backend endpoint. Pending implementation.')}
                title="Export CSV"
              >
                CSV
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-xs text-amber-700">
        <p className="font-semibold">Backend export endpoints pending</p>
        <p className="mt-1">
          PDF and CSV export require backend implementation of{' '}
          <code className="rounded bg-amber-100 px-1">/api/v1/reports/export</code>.
          The Generate/Export buttons will be functional once the backend team implements these endpoints.
        </p>
      </div>
    </div>
  );
}
