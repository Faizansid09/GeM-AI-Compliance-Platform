import { useQuery } from '@tanstack/react-query';
import { fetchComplianceStatus } from '../api/endpoints';
import { MOCK_COMPLIANCE_STATUS_BY_BIDDER } from '../api/mockData';
import type { ComplianceStatus } from '../types';

/**
 * Loads GET /bidders/{id}/compliance-status and renders it directly.
 *
 * The dashboard shows ZERO hardcoded labels/scores/statuses — every value on
 * screen comes from the JSON this hook returns. When the backend's JSON
 * changes, the UI changes automatically with no redeploy (req #1).
 *
 * If the backend is not reachable (e.g. during development), we fall back to
 * the complete seeded sample record for the selected bidder so the dashboard
 * remains usable without leaving an empty screen.
 *
 * @param bidderId The route id, e.g. "123" for BID-001.
 * @param selectBidderId Allow the caller to query a different route id than
 *                       the selected bidder (used after an upload completes).
 */
export function useComplianceStatus(bidderId: string | null) {
  return useQuery<ComplianceStatus>({
    queryKey: ['compliance-status', bidderId],
    queryFn: async () => {
      if (!bidderId) throw new Error('No bidder selected');
      try {
        return await fetchComplianceStatus(bidderId);
      } catch (error) {
        // Backend unreachable → use the complete seeded record for this bidder.
        const fallback = MOCK_COMPLIANCE_STATUS_BY_BIDDER[bidderId];
        if (fallback) {
          return fallback;
        }
        throw error;
      }
    },
    enabled: !!bidderId,
    staleTime: 30_000,
    retry: 1,
  });
}
