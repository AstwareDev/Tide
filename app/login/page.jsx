"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, ShieldCheck, Zap } from "lucide-react";
import { LanguageSelect } from "@/components/settings/language-select";
import { useLocale } from "@/lib/i18n/locale-context";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const { t } = useLocale();

  const FEATURES = [
    { icon: Zap, text: t("login.feature1") },
    { icon: Mail, text: t("login.feature2") },
    { icon: ShieldCheck, text: t("login.feature3") },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative">
      <div className="absolute top-5 right-5">
        <LanguageSelect />
      </div>
      <div className="w-full max-w-md px-8">
        <div className="flex justify-center mb-10">
          <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/15">
            <img src="/tide.png" alt="Tide" className="w-full h-full object-cover" />
          </div>
        </div>

        <h1 className="text-foreground text-3xl font-bold text-center mb-2 tracking-tight">{t("login.welcome")}</h1>
        <p className="text-muted-foreground text-center mb-10 text-sm leading-relaxed">{t("login.subtitle")}</p>

        <div className="space-y-3 mb-10">
          {FEATURES.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={14} className="text-primary" />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <a
          href="/api/auth/login"
          className="w-full py-3 px-4 bg-white text-gray-900 font-semibold rounded-xl border border-border hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
            <path d="M43.6 20.1H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.4 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" fill="#FFC107" />
            <path d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.4 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" fill="#FF3D00" />
            <path d="M24 44c5.4 0 10.2-2 13.8-5.2l-6.4-5.4C29.4 35.1 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8L6 33c3.3 6.5 10 11 18 11z" fill="#4CAF50" />
            <path d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.4 5.4C37 37.5 44 32 44 24c0-1.3-.1-2.6-.4-3.9z" fill="#1976D2" />
          </svg>
          {t("login.connectGmail")}
        </a>

        {error && <p className="mt-3 text-destructive text-xs text-center">{error}</p>}
      </div>
    </div>
  );
}
