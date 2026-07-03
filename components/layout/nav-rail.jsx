"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Inbox, Bot, Activity, Settings, LogOut } from "lucide-react";
import { SenderAvatar } from "@/components/inbox/sender-avatar";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { useLocale } from "@/lib/i18n/locale-context";

export function NavRail({ email }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLocale();
  const [hovered, setHovered] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarPending, setAvatarPending] = useState(true);

  const isInbox = pathname?.startsWith("/inbox");
  const collapsed = isInbox && !hovered;

  const NAV = [
    { href: "/inbox", icon: Inbox, label: t("nav.inbox") },
    { href: "/agents", icon: Bot, label: t("nav.agents") },
    { href: "/activity", icon: Activity, label: t("nav.activity") },
    { href: "/settings", icon: Settings, label: t("nav.settings") },
  ];

  useEffect(() => {
    if (!email) return;
    let active = true;
    setAvatarPending(true);
    api.gmail
      .avatars([email])
      .then((data) => active && setAvatarUrl(data.avatars?.[email] || null))
      .catch(() => {})
      .finally(() => active && setAvatarPending(false));
    return () => {
      active = false;
    };
  }, [email]);

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } finally {
      router.push("/login");
    }
  };

  return (
    <aside
      onMouseEnter={() => isInbox && setHovered(true)}
      onMouseLeave={() => isInbox && setHovered(false)}
      className={cn(
        "flex shrink-0 flex-col border-r border-border bg-muted/50 overflow-hidden transition-[width] duration-200 ease-out",
        collapsed ? "w-[68px]" : "w-[232px]"
      )}
    >
      <div className={cn("pb-6 pt-5", collapsed ? "px-0 flex justify-center" : "px-5")}>
        <Link href="/inbox" className="flex items-center gap-2.5">
          {/* Logo is placed as-is without any clipping or rounding classes */}
          <img src="/tide.png" alt="Tide" className="h-8 w-8 shrink-0" />
          {!collapsed && <span className="text-lg font-bold tracking-tight text-foreground whitespace-nowrap">Tide</span>}
        </Link>
      </div>

      <nav className={cn("flex flex-1 flex-col gap-1", collapsed ? "px-2" : "px-3")}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg py-2 text-sm transition-colors whitespace-nowrap",
                collapsed ? "justify-center px-0" : "px-3",
                active
                  ? "bg-primary text-primary-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon
                size={16}
                strokeWidth={active ? 2.25 : 2}
                className={cn("shrink-0", !active && "text-muted-foreground group-hover:text-foreground")}
              />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className={cn("flex items-center gap-2.5 rounded-lg py-1.5", collapsed ? "justify-center px-0" : "px-2")}>
          <SenderAvatar
            avatarUrl={avatarUrl}
            from={email}
            senderName={email}
            pending={avatarPending}
            className="h-8 w-8 shrink-0"
          />
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">{email || t("nav.connecting")}</p>
                <p className="text-[11px] text-muted-foreground">{t("nav.gmailConnected")}</p>
              </div>
              <button
                onClick={handleLogout}
                title={t("nav.logout")}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
              >
                <LogOut size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
