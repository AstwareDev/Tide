export function SettingRow({ icon: Icon, label, description, children }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-white/[0.06] last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
          <Icon size={15} className="text-gray-400" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm text-gray-200 font-medium">{label}</p>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
