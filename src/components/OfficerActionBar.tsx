import { useState } from 'react';
import { useAudit } from '../hooks/useAudit';
import { useOverride } from '../hooks/useOverride';
import { OverrideModal } from './OverrideModal';
import { DEFAULT_OFFICER } from '../api/config';
import type { OfficerAction } from '../types';

interface OfficerActionBarProps {
  bidderId: string;
  decision: OfficerAction | null;
  onActionLogged: (action: OfficerAction) => void;
}

type ModalMode = 'APPROVE' | 'REJECT' | 'OVERRIDE' | null;

/**
 * Procurement Officer decision controls (req #5 and #8).
 *
 * req #5 — Every button click (Approve, Reject, Override) calls POST /audit.
 *          The UI does NOT make the Qualified/Disqualified decision; it sends
 *          the officer's action + mandatory comment, and the server updates the
 *          final status and logs it. The UI just reflects what the server returns.
 *
 * req #8 — "Override AI Recommendation" is ALWAYS enabled. We never grey it out
 *          even when the AI recommendation is PASS. A mandatory reason is
 *          collected and sent to PATCH /bidders/{id}/override.
 */
export function OfficerActionBar({ bidderId, decision, onActionLogged }: OfficerActionBarProps) {
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const { submitAudit, isSubmitting: auditSubmitting, error: auditError, clearError: clearAuditError } =
    useAudit();
  const {
    submitOverride,
    isSubmitting: overrideSubmitting,
    error: overrideError,
    clearError: clearOverrideError,
  } = useOverride();

  const modalTitle =
    modalMode === 'APPROVE'
      ? 'Approve Bidder'
      : modalMode === 'REJECT'
        ? 'Reject Bidder'
        : modalMode === 'OVERRIDE'
          ? 'Override AI Recommendation'
          : '';

  const isSubmitting = auditSubmitting || overrideSubmitting;

  const handleAuditDecision = async (comment: string) => {
    if (!modalMode || modalMode === 'OVERRIDE') return;
    const action: OfficerAction = modalMode;
    const ok = await submitAudit({ bidder_id: bidderId, action, comment, actor: DEFAULT_OFFICER });
    if (ok) {
      onActionLogged(action);
      setModalMode(null);
    }
  };

  const handleOverride = async (reason: string) => {
    const overrideOk = await submitOverride(bidderId, reason);
    if (overrideOk) {
      // req #5: the override click must also be written to the audit trail.
      const auditOk = await submitAudit({
        bidder_id: bidderId,
        action: 'OVERRIDE',
        comment: reason,
        actor: DEFAULT_OFFICER,
      });
      if (auditOk) {
        onActionLogged('OVERRIDE');
        setModalMode(null);
      }
    }
  };

  const activeError = modalMode === 'OVERRIDE' ? overrideError : auditError;

  const openModal = (mode: Exclude<ModalMode, null>) => {
    clearAuditError();
    clearOverrideError();
    setModalMode(mode);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Officer Decision</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            The AI recommendation is advisory. You make the final call.
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            decision
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          Decision: {decision ?? 'Pending'}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => openModal('APPROVE')}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
          Approve
        </button>

        <button
          type="button"
          onClick={() => openModal('REJECT')}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Reject
        </button>

        <button
          type="button"
          onClick={() => openModal('OVERRIDE')}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand bg-white px-4 py-2 text-sm font-semibold text-brand shadow-sm transition-colors hover:bg-brand/5 disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm2 5a3 3 0 116 0 3 3 0 01-6 0zm6 7H7a4 4 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          Override AI Recommendation
        </button>
      </div>

      <OverrideModal
        open={modalMode !== null}
        title={modalTitle || ''}
        onClose={() => setModalMode(null)}
        onConfirm={modalMode === 'OVERRIDE' ? handleOverride : handleAuditDecision}
        isSubmitting={isSubmitting}
        error={activeError}
      />
    </div>
  );
}
