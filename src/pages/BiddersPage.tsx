import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_BIDDERS, MOCK_COMPLIANCE_STATUS_BY_BIDDER } from '../api/mockData';
import { RiskBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';

/**
 * Bidders Page
 *
 * Displays all bidders from MOCK_BIDDERS (replace with real GET /api/v1/tenders/{id}/bidders).
 * Includes search, filter by risk level, and sort by compliance score.
 */
export function BiddersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'submitted'>('submitted');

  const rows = MOCK_BIDDERS.map((b) => {
    const compliance = MOCK_COMPLIANCE_STATUS_BY_BIDDER[b.id];
    return {
      ...b,
      score: compliance?.overall_compliance_score ?? 0,
      risk: (compliance?.risk_level ?? 'Medium') as 'Low' | 'Medium' | 'High',
      bidId: compliance?.bidder_id ?? b.id,
    };
  })
    .filter((r) => {
      const q = search.toLowerCase();
      const matchSearch = !q || r.name.toLowerCase().includes(q) || r.bidId.toLowerCase().includes(q) || r.pan.toLowerCase().includes(q);
      const matchRisk = riskFilter === 'All' || r.risk === riskFilter;
      return matchSearch && matchRisk;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const statusColor = (risk: string) =>
    risk === 'Low' ? 'text-emerald-700' : risk === 'High' ? 'text-red-700' : 'text-amber-700';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Bidders</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          All registered bidders for active tenders. {/* MOCK — replace with real GET /api/v1/tenders/{id}/bidders */}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search by name, Bid ID or PAN…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value as typeof riskFilter)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          <option value="All">All Risk Levels</option>
          <option value="Low">Low Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="High">High Risk</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        >
          <option value="submitted">Sort by Submission Date</option>
          <option value="score">Sort by Compliance Score</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <EmptyState title="No bidders found" description="Try adjusting your search or filter." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['Bid ID', 'Company Name', 'PAN', 'GSTIN', 'Score', 'Risk Level', 'Submitted', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => navigate(`/bidders/${r.id}`)}
                  >
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-700">{r.bidId}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{r.name}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{r.pan}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{r.gstin}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full ${r.score >= 80 ? 'bg-emerald-500' : r.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${r.score}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold ${statusColor(r.risk)}`}>{r.score}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <RiskBadge risk={r.risk} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{r.submittedAt}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); navigate(`/bidders/${r.id}`); }}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:border-brand/50 hover:text-brand transition-colors"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); navigate('/bid-verification'); }}
                          className="rounded-lg border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-semibold text-brand hover:bg-brand/10 transition-colors"
                        >
                          Verify
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
            Showing {rows.length} of {MOCK_BIDDERS.length} bidders
          </div>
        </div>
      )}
    </div>
  );
}
