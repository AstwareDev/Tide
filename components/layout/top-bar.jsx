"use client";

import { usePathname } from "next/navigation";
import { Play, Loader2, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-context";

export function TopBar({ running, onRunNow }) {
  const pathname = usePathname();
  const { t } = useLocale();

  const PAGES = {
    "/inbox": { title: t("nav.inbox"), subtitle: t("topbar.inboxSubtitle") },
    "/agents": { title: t("nav.agents"), subtitle: t("topbar.agentsSubtitle") },
    "/activity": { title: t("nav.activity"), subtitle: t("topbar.activitySubtitle") },
    "/settings": { title: t("nav.settings"), subtitle: t("topbar.settingsSubtitle") },
  };
  const page = Object.entries(PAGES).find(([prefix]) => pathname?.startsWith(prefix))?.[1] || { title: "Tide" };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-baseline gap-3 min-w-0">
        <h1 className="text-[15px] font-semibold tracking-tight text-foreground">{page.title}</h1>
        {page.subtitle && (
          <span className="hidden truncate text-xs text-muted-foreground sm:inline">{page.subtitle}</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-1.5 rounded-md border border-border bg-muted px-2 py-1 text-[11px] text-muted-foreground md:flex">
          <Command size={11} />
          <span>{t("topbar.searchHint")}</span>
        </div>
        <Button onClick={onRunNow} disabled={running} size="sm" className="gap-2">
          {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={13} fill="currentColor" />}
          {running ? t("topbar.running") : t("topbar.runNow")}
        </Button>
      </div>
    </header>
  );
}
