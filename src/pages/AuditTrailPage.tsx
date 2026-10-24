// MOCK — replace with real GET /api/v1/audit when endpoint is available
const AUDIT_EVENTS = [
  { id: 1, time: '10:42 AM', user: 'procurement.officer@cpcl.gov.in', action: 'Document uploaded', entity: 'BID-001', detail: 'GST Certificate uploaded', status: 'success' },
  { id: 2, time: '10:44 AM', user: 'AI Engine', action: 'Document extraction completed', entity: 'BID-001', detail: 'Extracted 4 fields from GST Certificate', status: 'success' },
  { id: 3, time: '10:45 AM', user: 'AI Engine', action: 'GST portal verification', entity: 'BID-001', detail: 'GSTIN active and matching — PASS', status: 'success' },
  { id: 4, time: '10:46 AM', user: 'AI Engine', action: 'Compliance score generated', entity: 'BID-001', detail: 'Score: 82/100 · Risk: Low', status: 'success' },
  { id: 5, time: '10:47 AM', user: 'AI Engine', action: 'ITR verification failed', entity: 'BID-001', detail: 'ITR for AY 2025-26 not found — FAIL', status: 'warning' },
  { id: 6, time: '10:48 AM', user: 'procurement.officer@cpcl.gov.in', action: 'AI recommendation reviewed', entity: 'BID-001', detail: 'Officer reviewed advisory output', status: 'info' },
  { id: 7, time: '10:50 AM', user: 'procurement.officer@cpcl.gov.in', action: 'Officer override recorded', entity: 'BID-001', detail: 'Override reason: ITR deadline extended by CBDT circular', status: 'override' },
  { id: 8, time: '11:08 AM', user: 'procurement.officer@cpcl.gov.in', action: 'Document uploaded', entity: 'BID-002', detail: 'ITR acknowledgement uploaded', status: 'success' },
  { id: 9, time: '11:12 AM', user: 'AI Engine', action: 'Compliance score generated', entity: 'BID-002', detail: 'Score: 74/100 · Risk: Medium', status: 'success' },
  { id: 10, time: '11:26 AM', user: 'procurement.officer@cpcl.gov.in', action: 'Bidder submitted for verification', entity: 'BID-003', detail: 'Manual review flagged for blacklisting check', status: 'warning' },
];

const STATUS_ICON: Record<string, { cls: string; icon: string }> = {
  success: { cls: 'bg-emerald-100 text-emerald-600', icon: '✓' },
  warning: { cls: 'bg-amber-100 text-amber-600', icon: '!' },
  info: { cls: 'bg-blue-100 text-blue-600', icon: 'i' },
  override: { cls: 'bg-purple-100 text-purple-600', icon: '↺' },
};

export function AuditTrailPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Audit Trail</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Complete chronological log of all system and officer actions. {/* MOCK — replace with real GET /api/v1/audit */}
        </p>
      </div>

      <div className="card overflow-hidden">
        {/* Timeline */}
        <div className="divide-y divide-slate-50">
          {AUDIT_EVENTS.map((event, idx) => {
            const s = STATUS_ICON[event.status] ?? STATUS_ICON.info;
            return (
              <div key={event.id} className="flex gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                {/* Timeline line + dot */}
                <div className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${s.cls}`}>
                    {s.icon}
                  </div>
                  {idx < AUDIT_EVENTS.length - 1 && (
                    <div className="mt-1 w-px flex-1 bg-slate-100" style={{ minHeight: '16px' }} />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 pb-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{event.action}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{event.detail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-500">{event.time}</p>
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        {event.entity}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 truncate">{event.user}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-100 px-6 py-3 text-xs text-slate-400">
          Showing {AUDIT_EVENTS.length} audit events · Today · 09 Sep 2026
        </div>
      </div>
    </div>
  );
}
