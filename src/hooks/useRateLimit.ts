import { useCallback, useEffect, useRef, useState } from 'react';
import { RATE_LIMIT_EVENT } from '../api/client';

interface RateLimitDetail {
  code: string;
  retryAfter: number;
}

/**
 * Subscribes to the global rate-limit event dispatched by the axios interceptor
 * whenever the backend returns HTTP 429 with the custom payload
 *   { "code": "RATE_LIMIT", "retry_after": 30 }
 *
 * The UI uses this to:
 *   - show a friendly "Verification temporarily delayed" notice (req #6)
 *   - grey out the "Re-verify" button for `retry_after` seconds
 *
 * Without this, a 429 would surface as a raw network error and could look like
 * a crash. With it, the dashboard stays responsive and recovers automatically.
 *
 * @param maxRetryAfter Optional cap so a huge retry_after from the server cannot
 *                       lock the UI for an unreasonably long time (default 300s).
 */
export function useRateLimit(maxRetryAfter = 300) {
  const [retryAfter, setRetryAfter] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [code, setCode] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const startLockout = useCallback((detail: RateLimitDetail) => {
    const capped = Math.min(Math.max(detail.retryAfter, 1), maxRetryAfter);
    setCode(detail.code);
    setRetryAfter(capped);
    setSecondsRemaining(capped);

    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setRetryAfter(0);
          setCode(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [maxRetryAfter]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<RateLimitDetail>).detail;
      if (detail && typeof detail.retryAfter === 'number') {
        startLockout(detail);
      }
    };

    window.addEventListener(RATE_LIMIT_EVENT, handler as EventListener);
    return () => {
      window.removeEventListener(RATE_LIMIT_EVENT, handler as EventListener);
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [startLockout]);

  return {
    isRateLimited: secondsRemaining > 0,
    retryAfter,
    secondsRemaining,
    code,
  };
}
