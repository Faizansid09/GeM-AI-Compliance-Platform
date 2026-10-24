import axios from 'axios';
import { API_BASE_URL, AUTH_HEADER } from './config';

/**
 * Global axios instance for the whole dashboard.
 *
 * Base URL  -> http://localhost:8000/api/v1
 * Auth      -> `Authorization: Bearer dummy_token` on EVERY request (req #7)
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Request interceptor (req #7): every single API request carries
 *   Authorization: Bearer <token>
 * even if the caller forgets to set it. Tokens are hardcoded to
 * `dummy_token` for now; swap AUTH_TOKEN in config.ts when the real
 * JWT service is ready.
 */
apiClient.interceptors.request.use(
  (config) => {
    config.headers.Authorization = AUTH_HEADER;
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Global rate-limit event used by the UI (req #6).
 *
 * The backend signals a government-portal rate limit with:
 *   HTTP 429
 *   { "code": "RATE_LIMIT", "retry_after": 30 }
 *
 * We must NOT crash the dashboard. Instead we dispatch a window event
 * carrying `retry_after` so the dashboard can:
 *   - show a friendly "Verification temporarily delayed" message
 *   - grey out the "Re-verify" button for `retry_after` seconds
 *
 * No component needs to know about axios; they subscribe to the event.
 */
export const RATE_LIMIT_EVENT = 'api:rate-limit';

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 429) {
        const data = error.response?.data as { code?: string; retry_after?: number } | undefined;
        const retryAfter =
          typeof data?.retry_after === 'number' && data.retry_after > 0 ? data.retry_after : 30;
        window.dispatchEvent(
          new CustomEvent(RATE_LIMIT_EVENT, {
            detail: { code: data?.code ?? 'RATE_LIMIT', retryAfter },
          }),
        );
      }
    }
    return Promise.reject(error);
  },
);

/**
 * Normalise any axios error into a readable message for the UI.
 * Used when showing inline errors on forms / buttons.
 */
export function describeAxiosError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown> | undefined;
    if (data) {
      if (typeof data.message === 'string') return data.message;
      if (typeof data.detail === 'string') return data.detail;
    }
    if (error.response) {
      return `Request failed with status ${error.response.status}`;
    }
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Is the backend running on localhost:8000?';
    }
    if (error.message) return error.message;
  }
  return 'Something went wrong. Please try again.';
}
