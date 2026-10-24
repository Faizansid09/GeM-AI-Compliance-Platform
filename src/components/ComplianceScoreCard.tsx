import type { ComplianceStatus } from '../types';
import { RiskBadge } from './StatusBadge';

/**
 * Shows the overall compliance score and risk level, both read directly from
 * the backend JSON (req #1). If the server changes either value, the card
 * updates automatically.
 */
export function ComplianceScoreCard({ data }: { data: ComplianceStatus }) {
  const { overall_compliance_score, risk_level } = data;

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Overall Compliance Score</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-5xl font-bold tabular-nums text-slate-900">
              {overall_compliance_score}
            </span>
            <span className="text-lg font-medium text-slate-400">/ 100</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Risk Level
          </span>
          <RiskBadge risk={risk_level} />
        </div>
      </div>

      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${Math.max(0, Math.min(100, overall_compliance_score))}%` }}
        />
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Score source: weighted compliance rule engine, transparent and traceable per check.
      </p>
    </div>
  );
}
