interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
}

export function LoadingState({ message = 'Loading…', fullPage = false }: LoadingStateProps) {
  const inner = (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">{inner}</div>
    );
  }

  return inner;
}
