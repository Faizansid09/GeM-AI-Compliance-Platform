interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  colorClass?: string;
  trend?: { value: string; up: boolean };
}

export function KpiCard({ title, value, subtitle, icon, colorClass = 'bg-brand/10 text-brand', trend }: KpiCardProps) {
  return (
    <div className="card flex items-start gap-4 p-5 transition-shadow hover:shadow-md">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{value}</p>
        {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
        {trend && (
          <span
            className={`mt-1.5 inline-flex items-center gap-1 text-xs font-medium ${
              trend.up ? 'text-emerald-600' : 'text-red-500'
            }`}
          >
            {trend.up ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
