"use client";

import { useMemo, useState } from "react";
import { ChevronsLeft, ChevronsRight, Mail, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLabelColor } from "@/lib/label-colors";
import { useInboxFilter } from "@/components/inbox/inbox-filter-context";
import { useLocale } from "@/lib/i18n/locale-context";

export function LabelFilterSidebar() {
  const { t } = useLocale();
  const [collapsed, setCollapsed] = useState(false);
  const { userLabels, threads, selectedLabelIds, toggleLabel, showUnreadOnly, setShowUnreadOnly, clearFilters } =
    useInboxFilter();

  const unreadCount = useMemo(() => threads.filter((t) => t.unread).length, [threads]);

  const labelCounts = useMemo(() => {
    const counts = new Map();
    for (const label of userLabels) {
      counts.set(label.id, threads.filter((t) => t.labelIds?.includes(label.id)).length);
    }
    return counts;
  }, [userLabels, threads]);

  const hasActiveFilters = selectedLabelIds.size > 0 || showUnreadOnly;

  if (collapsed) {
    return (
      <div className="flex w-11 shrink-0 flex-col items-center gap-1 border-r border-border bg-card/40 py-3">
        <button
          onClick={() => setCollapsed(false)}
          className="mb-2 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title={t("inbox.expandLabels")}
        >
          <ChevronsRight size={15} />
        </button>
        <button
          onClick={() => setShowUnreadOnly((v) => !v)}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
            showUnreadOnly ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
          title={t("inbox.unread")}
        >
          <Mail size={14} />
        </button>
        <div className="mt-1 flex flex-col items-center gap-1.5">
          {userLabels.map((label) => {
            const color = getLabelColor(label);
            const active = selectedLabelIds.has(label.id);
            return (
              <button
                key={label.id}
                onClick={() => toggleLabel(label.id)}
                title={label.name}
                className={cn(
                  "h-2.5 w-2.5 rounded-full ring-offset-2 transition-transform hover:scale-125",
                  active && "ring-2 ring-primary"
                )}
                style={{ backgroundColor: color.dot }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-[196px] shrink-0 flex-col border-r border-border bg-card/40">
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t("inbox.filters")}</span>
        <button
          onClick={() => setCollapsed(true)}
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title={t("inbox.collapse")}
        >
          <ChevronsLeft size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        <button
          onClick={() => setShowUnreadOnly((v) => !v)}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] transition-colors",
            showUnreadOnly ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-accent"
          )}
        >
          <Mail size={14} className="shrink-0" />
          <span className="flex-1 text-left">{t("inbox.unread")}</span>
          {unreadCount > 0 && <span className="text-[11px] text-muted-foreground">{unreadCount}</span>}
        </button>

        <div className="mt-3 mb-1.5 flex items-center gap-1.5 px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <Tag size={11} />
          {t("inbox.labels")}
        </div>

        {userLabels.length === 0 ? (
          <p className="px-2 py-1 text-[12px] text-muted-foreground">{t("inbox.noLabelsYet")}</p>
        ) : (
          <div className="space-y-0.5">
            {userLabels.map((label) => {
              const color = getLabelColor(label);
              const active = selectedLabelIds.has(label.id);
              const count = labelCounts.get(label.id) || 0;
              return (
                <button
                  key={label.id}
                  onClick={() => toggleLabel(label.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] transition-colors",
                    active ? "font-medium" : "hover:bg-accent"
                  )}
                  style={active ? { backgroundColor: color.bg, color: color.text } : undefined}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color.dot }} />
                  <span className="flex-1 truncate text-left" style={!active ? { color: "var(--foreground)" } : undefined}>
                    {label.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="mx-2 mb-3 flex items-center justify-center gap-1.5 rounded-lg border border-border py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X size={12} /> {t("inbox.clearFilters")}
        </button>
      )}
    </div>
  );
}
