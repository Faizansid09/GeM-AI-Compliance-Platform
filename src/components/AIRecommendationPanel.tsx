import type { ComplianceStatus } from '../types';

/**
 * Renders the AI recommendation verbatim from the backend JSON (req #1).
 * The text is always advisory — it never auto-decides. The officer decision
 * remains pending until a human clicks Approve / Reject / Override.
 */
export function AIRecommendationPanel({ data }: { data: ComplianceStatus }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2">
        <svg className="h-5 w-5 text-brand" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M10 2a8 8 0 100 16 8 8 0 000-16zM7 9.5a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
        <h3 className="text-sm font-semibold text-slate-900">AI Recommendation</h3>
        <span className="ml-auto inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
          Advisory
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">{data.ai_recommendation}</p>
      <p className="mt-3 text-xs text-slate-500">
        This is decision-support only. The final decision rests with the Procurement Officer.
      </p>
    </div>
  );
}
