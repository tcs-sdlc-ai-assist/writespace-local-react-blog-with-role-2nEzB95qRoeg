interface StatCardProps {
  label: string;
  value: number;
  color: string;
  icon: string;
}

export function StatCard({ label, value, color, icon }: StatCardProps): JSX.Element {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-surface-200 bg-gradient-card p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in">
      <span
        className={`inline-flex items-center justify-center rounded-full ${color} p-3 text-2xl`}
      >
        {icon}
      </span>
      <div>
        <p className="text-2xl font-bold text-surface-900">{value}</p>
        <p className="text-sm font-medium text-surface-500">{label}</p>
      </div>
    </div>
  );
}