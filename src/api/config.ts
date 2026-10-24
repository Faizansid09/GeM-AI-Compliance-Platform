/**
 * Single source of truth for backend connectivity.
 *
 * The backend is expected to run at http://localhost:8000/api/v1.
 * Every request goes through the axios client in ./client.ts, which
 * attaches the Authorization header and handles the 429 RATE_LIMIT
 * error protocol globally.
 */
export const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Hardcoded bearer token for now.
 * TODO: Replace with the real JWT once the auth service is live
 * (the user is standing up the JWT system next week).
 */
export const AUTH_TOKEN = 'dummy_token';

/**
 * Every request this app makes must carry this header:
 *   Authorization: Bearer <token>
 */
export const AUTH_HEADER = `Bearer ${AUTH_TOKEN}`;

/**
 * The officer acting on the dashboard. In production this comes from
 * the authenticated session; for the demo it is a stable seed value.
 */
export const DEFAULT_OFFICER = 'procurement.officer@cpcl.gov.in';

/**
 * Endpoint paths, relative to API_BASE_URL.
 *
 * NOTE ON THE UPLOAD CONTRACT (req #3):
 * The backend team asked us to confirm the request body shape.
 * We are sending the bidder's details as a nested object:
 *
 *   { bidder: { pan, gstin, name }, documents: [file1, file2] }
 *
 * Because `documents` is a File list, we serialise it as multipart/form-data:
 * the `bidder` JSON string is sent in a part named "bidder" and each file
 * in a part named "documents". This preserves the exact nested contract the
 * backend described while respecting how browsers upload files.
 *
 * TODO(backend-team): Please confirm this structure, or propose the final
 * shape you want. We will adjust this one function and nothing else.
 */
export const ENDPOINTS = {
  submitBidder: '/bidders',
  jobStatus: (jobId: string) => `/status/${jobId}`,
  complianceStatus: (bidderId: string) => `/bidders/${bidderId}/compliance-status`,
  audit: '/audit',
  override: (bidderId: string) => `/bidders/${bidderId}/override`,
  reverify: (bidderId: string) => `/bidders/${bidderId}/reverify`,
} as const;
