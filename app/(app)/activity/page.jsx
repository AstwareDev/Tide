"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityEntry } from "@/components/activity/activity-entry";
import { ActivityUndoBar } from "@/components/activity/activity-undo-bar";
import { ActivityFilterTabs } from "@/components/activity/activity-filter-tabs";
import { api } from "@/lib/api-client";
import { useLocale } from "@/lib/i18n/locale-context";

export default function ActivityPage() {
  const { t, locale } = useLocale();

  function formatDate(ms) {
    const d = new Date(ms);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return t("activity.today");
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return t("activity.yesterday");
    return d.toLocaleDateString(locale, { month: "short", day: "numeric" });
  }

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.activity.list(200);
      setEntries(data.entries || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const agentNames = useMemo(() => [...new Set(entries.map((e) => e.agentName))], [entries]);
  const lastUndoable = entries.find((e) => e.undoable && !e.undone);

  const filtered = entries.filter((e) => {
    if (filter === "all") return true;
    if (filter === "error") return e.action === "error";
    return e.agentName === filter;
  });

  const handleUndo = async (entry) => {
    try {
      await api.activity.undo(entry.id);
      toast.success("Undone");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const groups = filtered.reduce((acc, entry) => {
    const key = formatDate(entry.timestamp);
    (acc[key] ||= []).push(entry);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="h-full overflow-y-auto p-6 max-w-2xl mx-auto space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
        <Activity size={36} strokeWidth={1.25} className="mb-3" />
        <p className="text-sm font-medium">{t("activity.emptyTitle")}</p>
        <p className="text-xs mt-1">{t("activity.emptySubtitle")}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <ActivityUndoBar entry={lastUndoable} onUndo={handleUndo} />
        <ActivityFilterTabs value={filter} onChange={setFilter} agentNames={agentNames} />

        {Object.entries(groups).map(([date, items]) => (
          <div key={date}>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">{date}</div>
            <div className="space-y-1">
              {items.map((entry) => (
                <ActivityEntry key={entry.id} entry={entry} onUndo={handleUndo} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
