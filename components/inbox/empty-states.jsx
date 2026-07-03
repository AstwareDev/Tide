"use client";

import { Mail, ChevronRight, PartyPopper } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";

export function EmptyInbox({ hasQuery }) {
  const { t } = useLocale();
  if (hasQuery) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Mail size={32} strokeWidth={1.25} className="mb-3" />
        <p className="text-sm">{t("inbox.noMatch")}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
      <PartyPopper size={32} strokeWidth={1.25} className="mb-3" />
      <p className="text-sm font-medium text-muted-foreground">{t("inbox.inboxZero")}</p>
    </div>
  );
}

export function EmptyDetail() {
  const { t } = useLocale();
  return (
    <div className="flex-1 flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <ChevronRight size={32} strokeWidth={1.25} className="mx-auto mb-3" />
        <p className="text-sm">{t("inbox.selectEmail")}</p>
      </div>
    </div>
  );
}
