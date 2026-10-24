import React, { useEffect, useState, useRef } from 'react';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationBarProps {
  type?: NotificationType;
  title?: string;
  message?: React.ReactNode;
  badge?: string;
  autoCloseMs?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const TYPE_CONFIG = {
  success: {
    container: 'border-emerald-200/90 bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 text-emerald-950 shadow-emerald-500/10',
    iconBg: 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30',
    badge: 'bg-emerald-100/80 text-emerald-800 border-emerald-300/60',
    titleColor: 'text-emerald-950',
    descColor: 'text-emerald-800',
    progressBg: 'bg-emerald-500',
    closeBtn: 'text-emerald-600 hover:bg-emerald-100/70 hover:text-emerald-900',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  info: {
    container: 'border-blue-200/90 bg-gradient-to-r from-blue-50 via-indigo-50/70 to-blue-50 text-blue-950 shadow-blue-500/10',
    iconBg: 'bg-blue-600 text-white shadow-sm shadow-blue-600/30',
    badge: 'bg-blue-100/80 text-blue-800 border-blue-300/60',
    titleColor: 'text-blue-950',
    descColor: 'text-blue-800',
    progressBg: 'bg-blue-500',
    closeBtn: 'text-blue-600 hover:bg-blue-100/70 hover:text-blue-900',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  warning: {
    container: 'border-amber-200/90 bg-gradient-to-r from-amber-50 via-orange-50/70 to-amber-50 text-amber-950 shadow-amber-500/10',
    iconBg: 'bg-amber-600 text-white shadow-sm shadow-amber-600/30',
    badge: 'bg-amber-100/80 text-amber-800 border-amber-300/60',
    titleColor: 'text-amber-950',
    descColor: 'text-amber-800',
    progressBg: 'bg-amber-500',
    closeBtn: 'text-amber-600 hover:bg-amber-100/70 hover:text-amber-900',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625l6.28-10.875zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  error: {
    container: 'border-red-200/90 bg-gradient-to-r from-red-50 via-rose-50/70 to-red-50 text-red-950 shadow-red-500/10',
    iconBg: 'bg-red-600 text-white shadow-sm shadow-red-600/30',
    badge: 'bg-red-100/80 text-red-800 border-red-300/60',
    titleColor: 'text-red-950',
    descColor: 'text-red-800',
    progressBg: 'bg-red-500',
    closeBtn: 'text-red-600 hover:bg-red-100/70 hover:text-red-900',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

export function NotificationBar({
  type = 'success',
  title = 'Upload successful',
  message,
  badge,
  autoCloseMs = 6000,
  onClose,
  action,
  className = '',
}: NotificationBarProps) {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef(Date.now());
  const remainingTimeRef = useRef(autoCloseMs);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cfg = TYPE_CONFIG[type];

  useEffect(() => {
    if (!autoCloseMs || autoCloseMs <= 0 || !onClose) return;

    const interval = 50; // update progress every 50ms

    const progressInterval = setInterval(() => {
      if (!isPaused) {
        remainingTimeRef.current -= interval;
        const pct = Math.max(0, (remainingTimeRef.current / autoCloseMs) * 100);
        setProgress(pct);

        if (remainingTimeRef.current <= 0) {
          clearInterval(progressInterval);
          onClose();
        }
      }
    }, interval);

    return () => {
      clearInterval(progressInterval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [autoCloseMs, isPaused, onClose]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <aside
      role="status"
      aria-live="polite"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl border p-3.5 shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${cfg.container} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${cfg.iconBg}`}>
            {cfg.icon}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className={`text-sm font-semibold tracking-tight ${cfg.titleColor}`}>
                {title}
              </h4>
              {badge && (
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cfg.badge}`}
                >
                  {badge}
                </span>
              )}
            </div>
            {message && (
              <div className={`mt-0.5 text-xs leading-relaxed ${cfg.descColor}`}>
                {message}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="rounded-lg bg-white/80 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-xs border border-slate-200/80 hover:bg-white transition-colors"
            >
              {action.label}
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={`rounded-lg p-1 transition-colors ${cfg.closeBtn}`}
              aria-label="Dismiss notification"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Auto-dismiss progress countdown line */}
      {autoCloseMs > 0 && onClose && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/5">
          <div
            className={`h-full transition-all duration-75 ease-linear ${cfg.progressBg}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </aside>
  );
}
