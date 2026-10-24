import type { ComplianceStatus } from '../types';
import { StatusBadge } from './StatusBadge';

/**
 * Renders every check in `compliance_checks` by mapping over the array — no
 * check category, label, score or status is hardcoded (req #1). Add or remove
 * checks in the backend JSON and the list updates automatically.
 */
export function ComplianceCheckList({ data }: { data: ComplianceStatus }) {
  const { compliance_checks } = data;

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-900">Compliance Checks</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Each check is evaluated against the tender rules and the source portal.
        </p>
      </div>

      <ul className="divide-y divide-slate-100">
        {compliance_checks.map((check) => (
          <li key={check.category} className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900">{check.category}</p>
              <p className="mt-0.5 truncate text-xs text-slate-500">{check.details}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="rounded-md bg-slate-50 px-2 py-1 text-xs font-semibold tabular-nums text-slate-600">
                {check.score} pts
              </span>
              <StatusBadge status={check.status} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
