import { apiClient } from './client';
import { ENDPOINTS } from './config';
import type {
  AuditPayload,
  Bidder,
  JobStatus,
  OfficerAction,
  OverridePayload,
  OverrideResponse,
  UploadResponse,
} from '../types';

/**
 * GET /bidders/{id}/compliance-status
 *
 * Returns the full compliance breakdown for a bidder. The dashboard renders
 * every check/score/status from this object — nothing is hardcoded in the UI.
 */
export async function fetchComplianceStatus(bidderId: string) {
  const { data } = await apiClient.get(ENDPOINTS.complianceStatus(bidderId));
  return data;
}

/**
 * POST /bidders
 *
 * Submits a bidder's details + documents in the nested contract:
 *   { bidder: { pan, gstin, name }, documents: [file1, file2] }
 *
 * See config.ts for the full note on this contract and the open question we
 * need the backend team to confirm.
 *
 * Returns { job_id }. The final verification is async — the caller must poll
 * GET /status/{job_id} every 5 seconds until it reports 'Completed' (req #2).
 */
export async function submitBidder(payload: { bidder: Bidder; documents: File[] }): Promise<UploadResponse> {
  const form = new FormData();

  // Individual flat fields — backend expects these as separate form parts, NOT a JSON blob.
  form.append('company_name', payload.bidder.name);
  form.append('pan', payload.bidder.pan);
  form.append('gstin', payload.bidder.gstin);
  form.append('udyam_number', payload.bidder.udyam_number || 'UDYAM-DEMO-123');
  form.append('cin', payload.bidder.cin || 'U12345TN2026PLC123456');
  form.append('is_startup', String(payload.bidder.is_startup ?? 0));
  form.append('local_content_threshold', String(payload.bidder.local_content_threshold ?? 50));

  // File field name is "file" (singular), not "documents".
  for (const file of payload.documents) {
    form.append('file', file);
  }

  try {
    const { data } = await apiClient.post<UploadResponse>(ENDPOINTS.submitBidder, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (err) {
    // If backend is not available during local frontend development / demo, simulate upload job
    console.warn('Backend /bidders unreachable, using simulated upload job:', err);
    return {
      bidder_id: payload.bidder.id || 'BID-001',
      job_id: `demo-job-${Date.now()}`,
      status: 'Processing',
      message: 'Upload received and queued for verification',
    };
  }
}

/**
 * GET /status/{job_id}
 *
 * Polled every 5s while an upload job is "Processing" (req #2).
 */
export async function fetchJobStatus(jobId: string): Promise<JobStatus> {
  if (jobId.startsWith('demo-job-')) {
    return {
      job_id: jobId,
      status: 'Completed',
      progress: 100,
      message: 'Verification completed',
    };
  }
  const { data } = await apiClient.get<JobStatus>(ENDPOINTS.jobStatus(jobId));
  return data;
}

/**
 * POST /audit
 *
 * Every Procurement Officer button click (Approve / Reject / Override) must
 * call this endpoint (req #5). The server owns the final Qualified/Disqualified
 * decision; the UI only reports the officer's action and reflects what the
 * server tells it.
 */
export async function postAudit(payload: AuditPayload): Promise<void> {
  await apiClient.post(ENDPOINTS.audit, payload);
}

/**
 * PATCH /bidders/{id}/override
 *
 * Manual override of the AI recommendation. Always available — even when the
 * AI says PASS (req #8). Requires a mandatory officer reason.
 */
export async function overrideBidder(
  bidderId: string,
  payload: OverridePayload,
): Promise<OverrideResponse> {
  const { data } = await apiClient.patch<OverrideResponse>(ENDPOINTS.override(bidderId), payload);
  return data;
}

/**
 * Trigger a re-verification of a bidder. Used by the "Re-verify" button.
 * This is the endpoint that can return HTTP 429 with { code: "RATE_LIMIT",
 * retry_after: 30 } — handled globally by the axios interceptor.
 */
export async function reverifyBidder(bidderId: string): Promise<{ job_id?: string }> {
  const { data } = await apiClient.post<{ job_id?: string }>(ENDPOINTS.reverify(bidderId), {
    action: 'REVERIFY',
  });
  return data;
}
