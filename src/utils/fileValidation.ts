/**
 * Client-side file validation (req #4).
 *
 * Only PDF, JPEG and PNG are allowed, and each file must be under 10MB.
 * We block anything else in the UI BEFORE it ever reaches the server, to
 * save bandwidth and avoid a wasted round-trip.
 */

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'] as const;

/** Human-readable extension filter shown to the user. */
export const ALLOWED_EXTENSIONS_TEXT = 'PDF, JPEG, PNG';

export const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export function isValidPan(value: string): boolean {
  return PAN_PATTERN.test(value.trim().toUpperCase());
}

export function isValidGstin(value: string): boolean {
  return GSTIN_PATTERN.test(value.trim().toUpperCase());
}

export interface FileValidationResult {
  ok: boolean;
  errors: string[];
}

/**
 * Validate a single file against the allowed types and size limit.
 * Returns all violations so the UI can list every problem at once.
 */
export function validateFile(file: File): FileValidationResult {
  const errors: string[] = [];

  const typeOk = ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number]);
  if (!typeOk) {
    errors.push(`"${file.name}" is not an allowed type. Supported: ${ALLOWED_EXTENSIONS_TEXT}.`);
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    errors.push(`"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB upload limit.`);
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Validate a list of files. Returns the files that passed and the combined
 * list of rejection reasons. The rejected files are never sent to the server.
 */
export function validateFiles(files: File[]) {
  const accepted: File[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const result = validateFile(file);
    if (result.ok) {
      accepted.push(file);
    } else {
      errors.push(...result.errors);
    }
  }

  return { accepted, errors };
}

/**
 * Format a byte count for display, e.g. 8.4 MB. Used by the upload zone
 * to show each file's size as the officer scans the list.
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
