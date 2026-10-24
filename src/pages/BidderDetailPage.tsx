import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_BIDDERS, MOCK_COMPLIANCE_STATUS_BY_BIDDER } from '../api/mockData';
import { ComplianceScoreCard } from '../components/ComplianceScoreCard';
import { AIRecommendationPanel } from '../components/AIRecommendationPanel';
import { ComplianceCheckList } from '../components/ComplianceCheckList';
import { OfficerActionBar } from '../components/OfficerActionBar';
import { ErrorState } from '../components/common/ErrorState';
import type { OfficerAction } from '../types';
import { useState } from 'react';

export function BidderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lastAction, setLastAction] = useState<OfficerAction | null>(null);

  const bidder = MOCK_BIDDERS.find((b) => b.id === id);
  const compliance = id ? MOCK_COMPLIANCE_STATUS_BY_BIDDER[id] : undefined;

  if (!bidder || !compliance) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/bidders')}
          className="text-sm text-brand hover:text-brand-dark"
        >
          ← Back to Bidders
        </button>
        <ErrorState title="Bidder not found" message={`No bidder found with ID "${id}". Please check the URL.`} onRetry={() => navigate('/bidders')} />
      </div>
    );
  }

  const fields = [
    { label: 'Bid ID', val: compliance.bidder_id, mono: true },
    { label: 'Legal Name', val: bidder.name },
    { label: 'PAN', val: bidder.pan, mono: true },
    { label: 'GSTIN', val: bidder.gstin, mono: true },
    { label: 'Contact Person', val: bidder.contactPerson },
    { label: 'Email', val: bidder.email },
    { label: 'Phone', val: bidder.phone },
    { label: 'Tender Reference', val: bidder.tenderReference, mono: true },
    { label: 'Submitted At', val: bidder.submittedAt },
    { label: 'Registered Address', val: bidder.address, span: true },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button type="button" onClick={() => navigate('/bidders')} className="text-slate-500 hover:text-brand transition-colors">
          Bidders
        </button>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-900">{bidder.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{bidder.name}</h1>
          <p className="mt-0.5 text-sm text-slate-500 font-mono">{compliance.bidder_id}</p>
        </div>
        {lastAction && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            Action recorded: {lastAction}
          </span>
        )}
      </div>

      {/* Bidder info card */}
      <div className="card p-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Bidder Information</h2>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((f) => (
            <div key={f.label} className={f.span ? 'sm:col-span-2 lg:col-span-3' : ''}>
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{f.label}</dt>
              <dd className={`mt-1 ${f.mono ? 'font-mono text-sm' : ''} text-slate-800`}>{f.val ?? '—'}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Compliance grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ComplianceScoreCard data={compliance} />
          <AIRecommendationPanel data={compliance} />
          <ComplianceCheckList data={compliance} />
        </div>
        <div>
          <OfficerActionBar
            bidderId={id!}
            decision={lastAction}
            onActionLogged={setLastAction}
          />
        </div>
      </div>
    </div>
  );
}
