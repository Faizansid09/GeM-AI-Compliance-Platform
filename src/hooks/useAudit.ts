import { useState } from 'react';
import { postAudit } from '../api/endpoints';
import { describeAxiosError } from '../api/client';
import type { AuditPayload } from '../types';

/**
 * POST /audit wrapper (req #5).
 *
 * Every Procurement Officer action (Approve / Reject / Override) must be
 * reported to the audit endpoint. The UI does NOT decide whether the bidder is
 * Qualified/Disqualified — it sends the officer's action and lets the server
 * update the final status and log it.
 */
export function useAudit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(payload: AuditPayload): Promise<boolean> {
    setIsSubmitting(true);
    setError(null);
    try {
      await postAudit(payload);
      return true;
    } catch (err) {
      setError(describeAxiosError(err));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submitAudit: submit, isSubmitting, error, clearError: () => setError(null) };
}
