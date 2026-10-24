import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { submitBidder } from '../api/endpoints';
import { describeAxiosError } from '../api/client';
import { useJobPolling } from '../hooks/useJobPolling';
import { NotificationBar } from './common/NotificationBar';
import {
  ALLOWED_EXTENSIONS_TEXT,
  MAX_FILE_SIZE_MB,
  formatBytes,
  isValidGstin,
  isValidPan,
  validateFiles,
} from '../utils/fileValidation';
import type { JobStatus } from '../types';

interface UploadZoneProps {
  onUploadComplete: (jobId: string, result: JobStatus) => void;
}

interface SelectedFile {
  file: File;
  id: string;
}

let fileIdCounter = 0;
const nextFileId = () => `file-${++fileIdCounter}`;

/**
 * Drag-and-drop document upload zone (req #2 and #4).
 *
 * File limits (req #4): only PDF, JPEG and PNG under 10MB are accepted. Anything
 * else is blocked HERE, before it reaches the server, to save bandwidth.
 *
 * Async flow (req #2): the upload endpoint returns only a `job_id` — not a final
 * verdict. While the job is processing we show a small "Processing..." badge and
 * poll GET /status/{job_id} every 5s (useJobPolling). No full-page loader.
 *
 * Data contract (req #3): the request body is the nested
 *   { bidder: { pan, gstin, name }, documents: [file1, file2] }
 * (see config.ts for the multipart note + the open confirmation question).
 */
interface ActiveNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: React.ReactNode;
  badge?: string;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [bidderFieldError, setBidderFieldError] = useState('');
  const [panError, setPanError] = useState('');
  const [gstinError, setGstinError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [pan, setPan] = useState('');
  const [gstin, setGstin] = useState('');
  const [name, setName] = useState('');
  const [udyamNumber, setUdyamNumber] = useState('');
  const [cin, setCin] = useState('');
  const [isStartup, setIsStartup] = useState(false);
  const [localContentThreshold, setLocalContentThreshold] = useState(50);
  const [jobId, setJobId] = useState<string | null>(null);
  const [notification, setNotification] = useState<ActiveNotification | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const completedRef = useRef(false);
  const jobQuery = useJobPolling(jobId);

  useEffect(() => {
    if (jobQuery.data?.status === 'Completed' && !completedRef.current) {
      completedRef.current = true;
      onUploadComplete(jobId as string, jobQuery.data);
      setNotification({
        id: String(Date.now()),
        type: 'success',
        title: 'Upload successful',
        message: `Compliance verification finished for ${name || 'bidder'}. Verification score and checks have been updated.`,
        badge: 'Verified',
      });
      toast.success('Upload successful: Compliance verification complete!');
      window.dispatchEvent(
        new CustomEvent('app:notification', {
          detail: {
            text: `Verification completed for ${name || 'bidder'} (Job ${jobId})`,
            time: 'Just now',
          },
        }),
      );
    }
    if (jobQuery.data?.status === 'Failed' && !completedRef.current) {
      setNotification({
        id: String(Date.now()),
        type: 'error',
        title: 'Verification failed',
        message: jobQuery.data?.message ?? 'Verification job encountered an error.',
        badge: 'Failed',
      });
      toast.error('Verification failed. Check server logs.');
    }
  }, [jobQuery.data, jobId, onUploadComplete, name]);

  const uploadMutation = useMutation({
    mutationFn: () =>
      submitBidder({
        bidder: {
          id: '',
          name,
          pan,
          gstin,
          udyam_number: udyamNumber || undefined,
          cin: cin || undefined,
          is_startup: isStartup ? 1 : 0,
          local_content_threshold: localContentThreshold,
        },
        documents: files.map((f) => f.file),
      }),
    onSuccess: (data) => {
      completedRef.current = false;
      setJobId(data.job_id);
      setNotification({
        id: String(Date.now()),
        type: 'success',
        title: 'Upload successful',
        message: `${files.length} document(s) uploaded successfully. Verification job ${data.job_id} initiated.`,
        badge: 'Submitted',
      });
      toast.success('Upload successful! Documents queued for verification.');
      window.dispatchEvent(
        new CustomEvent('app:notification', {
          detail: {
            text: `Upload successful: ${files.length} documents uploaded for ${name || 'bidder'}`,
            time: 'Just now',
          },
        }),
      );
    },
    onError: (error) => {
      setNotification({
        id: String(Date.now()),
        type: 'error',
        title: 'Upload failed',
        message: describeAxiosError(error),
        badge: 'Error',
      });
      toast.error('Upload failed. Please check bidder details.');
    },
  });

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const list = Array.from(incoming);
    const { accepted, errors } = validateFiles(list);
    setValidationErrors(errors);
    if (accepted.length > 0) {
      const fileNames = accepted.map((f) => f.name).join(', ');
      setNotification({
        id: String(Date.now()),
        type: 'success',
        title: 'Upload successful',
        message: `${accepted.length} file(s) attached: ${fileNames}. Ready for verification.`,
        badge: 'Files Ready',
      });
      toast.success(`Upload successful: ${accepted.length} document(s) added`);
      window.dispatchEvent(
        new CustomEvent('app:notification', {
          detail: {
            text: `Upload successful: ${accepted.length} document(s) attached in upload zone`,
            time: 'Just now',
          },
        }),
      );
    }
    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.file.name));
      const fresh = accepted.filter((f) => !existingNames.has(f.name));
      return [...prev, ...fresh.map((file) => ({ file, id: nextFileId() }))];
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setValidationErrors([]);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragActive(false);
      if (event.dataTransfer.files?.length) addFiles(event.dataTransfer.files);
    },
    [addFiles],
  );

  const handleSubmit = useCallback(() => {
    setBidderFieldError('');
    setPanError('');
    setGstinError('');
    setValidationErrors([]);
    if (!name.trim() || !pan.trim() || !gstin.trim()) {
      setBidderFieldError('Bidder name, PAN and GSTIN are all required.');
      return;
    }
    const validPan = isValidPan(pan);
    const validGstin = isValidGstin(gstin);
    if (!validPan) setPanError('Enter a valid PAN in the format ABCDE1234F.');
    if (!validGstin) setGstinError('Enter a valid 15-character GSTIN.');
    if (!validPan || !validGstin) return;
    if (files.length === 0) {
      setValidationErrors(['Please attach at least one supported document.']);
      return;
    }
    uploadMutation.mutate();
  }, [name, pan, gstin, files, uploadMutation]);

  const isProcessing = jobId !== null && jobQuery.data?.status === 'Processing';
  const isCompleted = jobId !== null && jobQuery.data?.status === 'Completed';
  const isFailed = jobId !== null && jobQuery.data?.status === 'Failed';

  return (
    <div className="card p-6">
      {/* Upload Notification Bar */}
      {notification && (
        <div className="mb-4">
          <NotificationBar
            type={notification.type}
            title={notification.title}
            message={notification.message}
            badge={notification.badge}
            autoCloseMs={6000}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <svg className="h-5 w-5 text-brand" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 2a3 3 0 00-3 3v4a3 3 0 006 0V5a3 3 0 00-3-3z" />
          <path
            fillRule="evenodd"
            d="M4 10a6 6 0 1112 0v1a5 5 0 01-10 0v-1z"
            clipRule="evenodd"
          />
        </svg>
        <h3 className="text-sm font-semibold text-slate-900">Upload Bidder Documents</h3>
      </div>

      {/* Required bidder fields */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Bidder / company name"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <input
          type="text"
          value={pan}
          onChange={(e) => {
            setPan(e.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase());
            setPanError('');
          }}
          placeholder="PAN"
          maxLength={10}
          pattern="[A-Z]{5}[0-9]{4}[A-Z]"
          aria-invalid={Boolean(panError)}
          className={`rounded-lg border px-3 py-2 text-sm uppercase outline-none focus:ring-2 focus:ring-brand/20 ${
            panError ? 'border-red-400' : 'border-slate-300 focus:border-brand'
          }`}
        />
        {panError && <p className="text-xs text-red-600 sm:col-start-2">{panError}</p>}
        <input
          type="text"
          value={gstin}
          onChange={(e) => {
            setGstin(e.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase());
            setGstinError('');
          }}
          placeholder="GSTIN"
          maxLength={15}
          pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]"
          aria-invalid={Boolean(gstinError)}
          className={`rounded-lg border px-3 py-2 text-sm uppercase outline-none focus:ring-2 focus:ring-brand/20 ${
            gstinError ? 'border-red-400' : 'border-slate-300 focus:border-brand'
          }`}
        />
        {gstinError && <p className="text-xs text-red-600 sm:col-start-3">{gstinError}</p>}
      </div>

      {/* Optional fields */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          type="text"
          value={udyamNumber}
          onChange={(e) => setUdyamNumber(e.target.value)}
          placeholder="Udyam Number (optional)"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <input
          type="text"
          value={cin}
          onChange={(e) => setCin(e.target.value)}
          placeholder="CIN (optional)"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <div className="flex items-center gap-4 rounded-lg border border-slate-300 px-3 py-2">
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isStartup}
              onChange={(e) => setIsStartup(e.target.checked)}
              className="rounded border-slate-300"
            />
            Startup India
          </label>
          <div className="flex items-center gap-2 ml-auto">
            <label htmlFor="lct" className="text-xs text-slate-500 whitespace-nowrap">Local content %:</label>
            <input
              id="lct"
              type="number"
              min={0}
              max={100}
              value={localContentThreshold}
              onChange={(e) => setLocalContentThreshold(Number(e.target.value))}
              className="w-14 rounded border border-slate-300 px-2 py-1 text-sm outline-none focus:border-brand"
            />
          </div>
        </div>
      </div>

      {/* Drag & drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
          dragActive
            ? 'border-brand bg-brand/5'
            : 'border-slate-300 bg-slate-50 hover:border-brand/60 hover:bg-brand/5'
        }`}
      >
        <svg className="mb-2 h-8 w-8 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 16V4m0 0L8 8m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-sm font-medium text-slate-700">
          Drag & drop files, or <span className="text-brand underline">browse</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Accepted: {ALLOWED_EXTENSIONS_TEXT}. Max {MAX_FILE_SIZE_MB}MB per file.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/jpeg,image/png"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {/* Validation / upload errors */}
      {validationErrors.length > 0 && (
        <ul className="mt-3 space-y-1 rounded-lg bg-red-50 px-4 py-3 text-xs text-red-700">
          {validationErrors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}
      {bidderFieldError && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-xs text-red-700">{bidderFieldError}</p>
      )}
      {uploadMutation.isError && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-xs text-red-700">
          {describeAxiosError(uploadMutation.error)}
        </p>
      )}
      {jobQuery.isError && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-xs text-red-700">
          {describeAxiosError(jobQuery.error)}
        </p>
      )}

      {/* Selected files */}
      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map(({ file, id }) => (
            <li
              key={id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <span className="truncate text-slate-700">{file.name}</span>
                <span className="shrink-0 text-xs text-slate-400">{formatBytes(file.size)}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(id)}
                className="ml-3 shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                aria-label={`Remove ${file.name}`}
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Submit + async status */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={uploadMutation.isPending || isProcessing}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploadMutation.isPending ? 'Submitting…' : 'Submit for Verification'}
        </button>

        {isProcessing && (
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            Processing...
          </span>
        )}
        {isCompleted && (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            Completed
          </span>
        )}
        {isFailed && (
          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/20">
            Failed — {jobQuery.data?.message ?? 'see server log'}
          </span>
        )}
      </div>
    </div>
  );
}
