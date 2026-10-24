import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useComplianceStatus } from '../hooks/useComplianceStatus';
import { useRateLimit } from '../hooks/useRateLimit';
import { useJobPolling } from '../hooks/useJobPolling';
import { reverifyBidder } from '../api/endpoints';
import { describeAxiosError } from '../api/client';
import { API_BASE_URL } from '../api/config';
import { MOCK_BIDDERS } from '../api/mockData';
import { BidderSelector } from '../components/BidderSelector';
import { ComplianceScoreCard } from '../components/ComplianceScoreCard';
import { AIRecommendationPanel } from '../components/AIRecommendationPanel';
import { ComplianceCheckList } from '../components/ComplianceCheckList';
import { UploadZone } from '../components/UploadZone';
import { OfficerActionBar } from '../components/OfficerActionBar';
import type { OfficerAction } from '../types';

/**
 * Bid Verification Page
 *
 * Contains the full existing compliance dashboard logic from the original App.tsx.
 * All backend integrations, polling, rate-limiting, and officer actions are preserved.
 */
export function BidVerificationPage() {
  const queryClient = useQueryClient();
  const [selectedBidderId, setSelectedBidderId] = useState('123');
  const [lastOfficerAction, setLastOfficerAction] = useState<OfficerAction | null>(null);
  const [reverifyJobId, setReverifyJobId] = useState<string | null>(null);
  const [reverifyError, setReverifyError] = useState<string | null>(null);
  const [reverifyPending, setReverifyPending] = useState(false);

  const { isRateLimited, secondsRemaining, code } = useRateLimit();
  const complianceQuery = useComplianceStatus(selectedBidderId);
  const reverifyJobQuery = useJobPolling(reverifyJobId);

  useEffect(() => {
    if (reverifyJobId && reverifyJobQuery.data?.status === 'Completed') {
      setReverifyPending(false);
      setReverifyJobId(null);
      queryClient.invalidateQueries({ queryKey: ['compliance-status', selectedBidderId] });
    }
    if (reverifyJobId && reverifyJobQuery.data?.status === 'Failed') {
      setReverifyPending(false);
      setReverifyError('Re-verification failed. See server log.');
      setReverifyJobId(null);
    }
  }, [reverifyJobId, reverifyJobQuery.data, selectedBidderId, queryClient]);

  const handleBidderChange = useCallback((id: string) => {
    setSelectedBidderId(id);
    setLastOfficerAction(null);
    setReverifyError(null);
  }, []);

  const handleReverify = useCallback(async () => {
    if (isRateLimited) return;
    setReverifyPending(true);
    setReverifyError(null);
    try {
      const data = await reverifyBidder(selectedBidderId);
      if (data?.job_id) {
        setReverifyJobId(data.job_id);
      } else {
        setReverifyPending(false);
        queryClient.invalidateQueries({ queryKey: ['compliance-status', selectedBidderId] });
      }
    } catch (err) {
      setReverifyPending(false);
      setReverifyError(describeAxiosError(err));
    }
  }, [isRateLimited, selectedBidderId, queryClient]);

  const handleUploadComplete = useCallback(
    (_jobId: string) => {
      queryClient.invalidateQueries({ queryKey: ['compliance-status', selectedBidderId] });
    },
    [selectedBidderId, queryClient],
  );

  const handleActionLogged = useCallback((action: OfficerAction) => {
    setLastOfficerAction(action);
  }, []);

  const data = complianceQuery.data;
  const selectedBidder = MOCK_BIDDERS.find((bidder) => bidder.id === selectedBidderId);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Bid Verification</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Review AI compliance results and take the final procurement decision.
        </p>
      </div>

      {/* Rate-limit banner */}
      {isRateLimited && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3">
          <svg className="h-5 w-5 shrink-0 text-amber-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625l6.28-10.875zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-medium text-amber-800">
            Verification temporarily delayed — government portal rate limit.
            {code === 'RATE_LIMIT' && (
              <span className="font-normal text-amber-700"> Retrying in {secondsRemaining}s</span>
            )}
          </p>
        </div>
      )}

      {/* Bidder selector + re-verify */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Select Tender Bidder</p>
          <BidderSelector selectedId={selectedBidderId} onSelect={handleBidderChange} />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-mono text-xs text-slate-400 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {API_BASE_URL}
          </div>
          <button
            type="button"
            onClick={handleReverify}
            disabled={isRateLimited || reverifyPending || complianceQuery.isFetching}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
              isRateLimited
                ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                : 'border-slate-300 bg-white text-slate-700 hover:border-brand hover:text-brand'
            }`}
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
            </svg>
            {isRateLimited
              ? `Re-verify (retry in ${secondsRemaining}s)`
              : reverifyPending
                ? 'Re-verifying…'
                : 'Re-verify'}
          </button>
        </div>
      </div>

      {reverifyPending && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
          Re-verification in progress…
        </div>
      )}
      {reverifyError && <p className="text-xs text-red-600">{reverifyError}</p>}
      {lastOfficerAction && (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          Action recorded: {lastOfficerAction}
        </span>
      )}

      {/* Loading / Error */}
      {complianceQuery.isLoading && (
        <div className="card p-10 text-center text-sm text-slate-500">Loading compliance data…</div>
      )}
      {complianceQuery.isError && (
        <div className="card border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Could not load compliance data. Ensure the backend service is running on localhost:8000.
        </div>
      )}

      {/* Compliance content */}
      {data && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Bidder</h3>
              <span className="text-sm font-semibold text-slate-900">{data.bidder_id}</span>
            </div>

            {selectedBidder && (
              <div className="card p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Bidder Information</h3>
                    <p className="mt-0.5 text-xs text-slate-500">Registration and tender submission details</p>
                  </div>
                  <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                    {selectedBidder.id}
                  </span>
                </div>
                <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
                  {[
                    { label: 'Legal name', val: selectedBidder.name },
                    { label: 'Contact person', val: selectedBidder.contactPerson },
                    { label: 'PAN', val: selectedBidder.pan, mono: true },
                    { label: 'GSTIN', val: selectedBidder.gstin, mono: true },
                    { label: 'Email', val: selectedBidder.email },
                    { label: 'Phone', val: selectedBidder.phone },
                    { label: 'Registered address', val: selectedBidder.address, span: true },
                    { label: 'Tender reference', val: selectedBidder.tenderReference, mono: true },
                    { label: 'Submitted', val: selectedBidder.submittedAt },
                  ].map((item) => (
                    <div key={item.label} className={item.span ? 'sm:col-span-2' : ''}>
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{item.label}</dt>
                      <dd className={`mt-1 ${item.mono ? 'font-mono' : ''} text-slate-700`}>{item.val ?? '—'}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <ComplianceScoreCard data={data} />
            <AIRecommendationPanel data={data} />
            <ComplianceCheckList data={data} />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <UploadZone onUploadComplete={handleUploadComplete} />
            <OfficerActionBar
              bidderId={selectedBidderId}
              decision={lastOfficerAction}
              onActionLogged={handleActionLogged}
            />
          </div>
        </div>
      )}
    </div>
  );
}
