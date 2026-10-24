import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KpiCard } from '../components/common/KpiCard';
import { MOCK_BIDDERS, MOCK_COMPLIANCE_STATUS_BY_BIDDER } from '../api/mockData';
import { StatusBadge } from '../components/StatusBadge';
import { RiskBadge } from '../components/StatusBadge';

/**
 * Home Dashboard
 *
 * KPI cards use MOCK data — replace with real API when /api/v1/dashboard/stats is available.
 * Recent verifications table is built from mock bidder data.
 */

// MOCK — replace with real API endpoint /api/v1/dashboard/stats
const MOCK_KPI = {
  totalBids: 3,
  pendingVerification: 1,
  verifiedBids: 2,
  highRiskBidders: 1,
  manualReviews: 2,
  complianceRate: 78,
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const TODAY = new Date().toLocaleDateString('en-IN', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export function HomePage() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const displayName = profile?.displayName || user?.displayName || 'Officer';
  const firstName = displayName.split(' ')[0];

  const quickActions = [
    {
      label: 'Start New Verification',
      desc: 'Upload documents and begin compliance check',
      icon: '🚀',
      color: 'bg-brand/10 border-brand/20',
      to: '/bid-verification',
    },
    {
      label: 'View All Bidders',
      desc: 'Browse registered bidders and their status',
      icon: '👥',
      color: 'bg-blue-50 border-blue-100',
      to: '/bidders',
    },
    {
      label: 'Upload Documents',
      desc: 'Submit compliance documents for processing',
      icon: '📁',
      color: 'bg-violet-50 border-violet-100',
      to: '/bid-verification',
    },
    {
      label: 'Review High Risk',
      desc: 'Focus on bidders requiring urgent attention',
      icon: '⚠️',
      color: 'bg-red-50 border-red-100',
      to: '/bidders',
    },
    {
      label: 'Generate Report',
      desc: 'Export compliance summary for the tender',
      icon: '📊',
      color: 'bg-amber-50 border-amber-100',
      to: '/reports',
    },
  ];

  // Build recent verifications from mock data
  const recentVerifications = MOCK_BIDDERS.map((b) => {
    const compliance = MOCK_COMPLIANCE_STATUS_BY_BIDDER[b.id];
    return {
      bidId: compliance?.bidder_id ?? b.id,
      name: b.name,
      submittedAt: b.submittedAt,
      score: compliance?.overall_compliance_score ?? 0,
      risk: compliance?.risk_level ?? 'Medium',
      status: 'Verified',
      checks: compliance?.compliance_checks ?? [],
      routeId: b.id,
    };
  });

  return (
    <div className="space-y-8">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome to the AI-Powered GeM Bid Compliance Verification Platform.
          </p>
          <p className="mt-0.5 text-xs text-slate-400">{TODAY}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/bid-verification')}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-dark transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Verification
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Overview {/* MOCK — replace with real API */}
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          <KpiCard
            title="Total Bids"
            value={MOCK_KPI.totalBids}
            icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>}
            colorClass="bg-slate-100 text-slate-600"
          />
          <KpiCard
            title="Pending"
            value={MOCK_KPI.pendingVerification}
            icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            colorClass="bg-blue-50 text-blue-600"
          />
          <KpiCard
            title="Verified"
            value={MOCK_KPI.verifiedBids}
            icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            colorClass="bg-emerald-50 text-emerald-600"
          />
          <KpiCard
            title="High Risk"
            value={MOCK_KPI.highRiskBidders}
            icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
            colorClass="bg-red-50 text-red-600"
          />
          <KpiCard
            title="Manual Review"
            value={MOCK_KPI.manualReviews}
            icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
            colorClass="bg-amber-50 text-amber-600"
          />
          <KpiCard
            title="Compliance"
            value={`${MOCK_KPI.complianceRate}%`}
            icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>}
            colorClass="bg-brand/10 text-brand"
          />
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {quickActions.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => navigate(a.to)}
              className={`rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${a.color}`}
            >
              <span className="text-2xl">{a.icon}</span>
              <p className="mt-3 text-sm font-semibold text-slate-900">{a.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Recent Verifications Table ── */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Recent Bid Verifications</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Latest compliance verification results from live backend data.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/bidders')}
            className="text-xs font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            View all →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Bid ID', 'Bidder Name', 'Submission Date', 'Score', 'Risk Level', 'Status', 'Action'].map((h) => (
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
              {recentVerifications.map((r) => (
                <tr key={r.bidId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-700">{r.bidId}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-900">{r.name}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{r.submittedAt}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${r.score}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{r.score}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <RiskBadge risk={r.risk as 'Low' | 'Medium' | 'High'} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status="PASS" />
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => navigate(`/bidders/${r.routeId}`)}
                      className="text-xs font-semibold text-brand hover:text-brand-dark transition-colors"
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
