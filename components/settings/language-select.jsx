"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FlagIcon } from "@/components/ui/flag-icon";
import { LANGUAGES } from "@/lib/i18n/translations";
import { useLocale } from "@/lib/i18n/locale-context";

export function LanguageSelect() {
  const { locale, setLocale } = useLocale();
  const current = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm transition-colors hover:border-primary/40 hover:bg-accent">
          <FlagIcon code={current.code} className="h-4 w-6" />
          <span className="font-medium text-foreground">{current.native}</span>
          <ChevronDown
            size={14}
            className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[220px] p-1.5">
        <div className="flex items-center gap-1.5 px-2 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <Globe size={11} />
          Language
        </div>
        {LANGUAGES.map((lang) => {
          const active = lang.code === locale;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLocale(lang.code)}
              className={`gap-3 rounded-md py-2 ${active ? "bg-accent" : ""}`}
            >
              <FlagIcon code={lang.code} className="h-4 w-6" />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{lang.native}</p>
                <p className="truncate text-[11px] text-muted-foreground">{lang.label}</p>
              </div>
              {active && <Check size={14} className="shrink-0 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
