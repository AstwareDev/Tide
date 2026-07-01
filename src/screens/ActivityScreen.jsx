import { useActivity } from "../context/ActivityContext";
import { Activity, Tag, Trash2, Archive, SkipForward, AlertCircle } from "lucide-react";

const ACTION_CONFIG = {
  label:   { icon: Tag,         color: "text-blue-400",   bg: "bg-blue-500/10",   label: "Labeled" },
  delete:  { icon: Trash2,      color: "text-red-400",    bg: "bg-red-500/10",    label: "Deleted" },
  archive: { icon: Archive,     color: "text-amber-400",  bg: "bg-amber-500/10",  label: "Archived" },
  skip:    { icon: SkipForward, color: "text-gray-400",   bg: "bg-gray-500/10",   label: "Skipped" },
  error:   { icon: AlertCircle, color: "text-orange-400", bg: "bg-orange-500/10", label: "Error" },
};

function formatTime(ms) {
  const d = new Date(ms);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(ms) {
  const d = new Date(ms);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function ActivityScreen() {
  const { entries } = useActivity();

  if (entries.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-600">
        <Activity size={36} strokeWidth={1.25} className="mb-3" />
        <p className="text-sm font-medium">No activity yet</p>
        <p className="text-xs mt-1">Run your agents to see what they do here.</p>
      </div>
    );
  }

  // Group by date
  const groups = entries.reduce((acc, entry) => {
    const key = formatDate(entry.timestamp);
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {Object.entries(groups).map(([date, items]) => (
          <div key={date}>
            <div className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-3">{date}</div>
            <div className="space-y-1">
              {items.map((entry) => {
                const cfg = ACTION_CONFIG[entry.action] || ACTION_CONFIG.skip;
                const Icon = cfg.icon;
                return (
                  <div key={entry.id} className="flex items-start gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                    <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon size={13} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5 mb-0.5">
                        <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                        {entry.labelApplied && (
                          <span className="text-xs text-gray-500">→ {entry.labelApplied}</span>
                        )}
                        <span className="text-xs text-gray-600">·</span>
                        <span className="text-xs text-gray-500 truncate">{entry.agentName}</span>
                      </div>
                      <p className="text-sm text-gray-300 truncate">{entry.emailSubject}</p>
                      <p className="text-xs text-gray-600 truncate">{entry.emailFrom}</p>
                      {entry.reason && (
                        <p className="text-xs text-gray-600 mt-1 italic truncate">{entry.reason}</p>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-600 shrink-0 mt-0.5">{formatTime(entry.timestamp)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
