import type { CheckStatus, RiskLevel } from '../types';

/**
 * Renders a status value directly from the backend JSON. The label shown is the
 * exact status string returned (req #1) — nothing is imagined or hardcoded here.
 * The colour mapping is purely presentational, keyed off the status value.
 */

const CHECK_STATUS_STYLES: Record<string, string> = {
  PASS: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  FAIL: 'bg-red-50 text-red-700 ring-red-600/20',
  MANUAL_REVIEW: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  NA: 'bg-slate-100 text-slate-600 ring-slate-500/20',
};

/**
 * Fallback for any status value the backend introduces later. Because the UI is
 * data-driven, a new status string still renders — just in a neutral style.
 */
const FALLBACK_STYLE = 'bg-slate-100 text-slate-700 ring-slate-500/20';

export function StatusBadge({ status }: { status: CheckStatus }) {
  const style = CHECK_STATUS_STYLES[status] ?? FALLBACK_STYLE;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style}`}
    >
      {status}
    </span>
  );
}

const RISK_STYLES: Record<string, string> = {
  Low: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Medium: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  High: 'bg-red-50 text-red-700 ring-red-600/20',
};

const RISK_FALLBACK = 'bg-slate-100 text-slate-700 ring-slate-500/20';

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const style = RISK_STYLES[risk] ?? RISK_FALLBACK;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style}`}
    >
      {risk}
    </span>
  );
}
