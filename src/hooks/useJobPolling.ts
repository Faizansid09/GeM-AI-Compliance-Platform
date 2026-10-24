import { useQuery } from '@tanstack/react-query';
import { fetchJobStatus } from '../api/endpoints';
import type { JobStatus } from '../types';

const POLL_INTERVAL_MS = 5000;

/**
 * Async upload / verification polling (req #2).
 *
 * The upload endpoint does NOT return final results instantly. It returns a
 * `job_id`. While the job is "Processing" we show a small status badge and call
 * GET /status/{job_id} every 5 seconds until the server reports "Completed"
 * (or "Failed"). We never spin a full-page loader for the duration.
 *
 * React Query's `refetchInterval` stops automatically once status is a terminal
 * value, so there is no runaway polling.
 *
 * The consumer detects the terminal state with `isJobFinished` / `status` and
 * reacts in a `useEffect` — we never run side effects inside the query select.
 */
export function useJobPolling(jobId: string | null) {
  return useQuery<JobStatus>({
    queryKey: ['job-status', jobId],
    queryFn: () => fetchJobStatus(jobId as string),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'Completed' || status === 'Failed') {
        return false;
      }
      return POLL_INTERVAL_MS;
    },
  });
}
