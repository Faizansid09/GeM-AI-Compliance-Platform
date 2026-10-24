import { useState } from 'react';
import { overrideBidder } from '../api/endpoints';
import { describeAxiosError } from '../api/client';
import type { OverrideResponse } from '../types';

/**
 * PATCH /bidders/{id}/override wrapper (req #8).
 *
 * The "Override AI Recommendation" button is ALWAYS available — we never
 * disable it even when the AI says PASS. The officer must supply a mandatory
 * reason before the override is submitted.
 */
export function useOverride() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OverrideResponse | null>(null);

  async function submit(bidderId: string, reason: string): Promise<boolean> {
    if (!reason.trim()) {
      setError('A reason is required to override the AI recommendation.');
      return false;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const data = await overrideBidder(bidderId, { reason: reason.trim() });
      setResult(data);
      return true;
    } catch (err) {
      setError(describeAxiosError(err));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    submitOverride: submit,
    isSubmitting,
    error,
    result,
    clearError: () => {
      setError(null);
      setResult(null);
    },
  };
}
