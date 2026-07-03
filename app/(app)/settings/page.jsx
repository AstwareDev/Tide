"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Key, Clock, Cpu, LogOut, Check, X, Globe, Bot, UserCircle2, ShieldCheck } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SettingRow } from "@/components/settings/setting-row";
import { LanguageSelect } from "@/components/settings/language-select";
import { api } from "@/lib/api-client";
import { useLocale } from "@/lib/i18n/locale-context";

function SettingsCard({ children }) {
  return <div className="rounded-xl border border-border bg-card px-4 shadow-sm">{children}</div>;
}

const TAB_TRIGGER_CLASS =
  "justify-start gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground data-[state=active]:shadow-none";

export default function SettingsPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [email, setEmail] = useState(null);
  const [settings, setSettings] = useState({ pollingIntervalMs: 300000, geminiKeyConfigured: false });

  useEffect(() => {
    api.auth.status().then((s) => setEmail(s.email)).catch(() => {});
    api.settings.get().then(setSettings).catch(() => {});
  }, []);

  const handleDisconnect = async () => {
    await api.auth.logout();
    router.push("/login");
  };

  const handleIntervalChange = async (value) => {
    const next = { ...settings, pollingIntervalMs: Number(value) };
    setSettings(next);
    await api.settings.update({ pollingIntervalMs: Number(value) }).catch(() => {});
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("settings.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("settings.subtitle")}</p>
        </header>

        <Tabs defaultValue="general" orientation="vertical" className="flex items-start gap-8">
          <TabsList className="h-auto w-52 shrink-0 flex-col items-stretch gap-1 bg-transparent p-0">
            <TabsTrigger value="general" className={TAB_TRIGGER_CLASS}>
              <Globe size={15} /> {t("settings.tabs.general")}
            </TabsTrigger>
            <TabsTrigger value="ai" className={TAB_TRIGGER_CLASS}>
              <Cpu size={15} /> {t("settings.tabs.ai")}
            </TabsTrigger>
            <TabsTrigger value="agents" className={TAB_TRIGGER_CLASS}>
              <Bot size={15} /> {t("settings.tabs.agents")}
            </TabsTrigger>
            <TabsTrigger value="account" className={TAB_TRIGGER_CLASS}>
              <UserCircle2 size={15} /> {t("settings.tabs.account")}
            </TabsTrigger>
          </TabsList>

          <div className="min-w-0 flex-1 space-y-6">
            <TabsContent value="general" className="mt-0">
              <SettingsCard>
                <SettingRow icon={Globe} label={t("settings.language.label")} description={t("settings.language.description")}>
                  <LanguageSelect />
                </SettingRow>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="ai" className="mt-0">
              <SettingsCard>
                <SettingRow icon={Cpu} label={t("settings.ai.provider")} description={t("settings.ai.providerDesc")}>
                  <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-xs text-muted-foreground">{t("settings.ai.providerValue")}</span>
                  </div>
                </SettingRow>

                <SettingRow icon={Key} label={t("settings.ai.apiKey")} description={t("settings.ai.apiKeyDesc")}>
                  <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5">
                    {settings.geminiKeyConfigured ? (
                      <>
                        <Check size={13} className="text-emerald-500" />
                        <span className="text-xs text-muted-foreground">{t("settings.ai.configured")}</span>
                      </>
                    ) : (
                      <>
                        <X size={13} className="text-destructive" />
                        <span className="text-xs text-muted-foreground">{t("settings.ai.notSet")}</span>
                      </>
                    )}
                  </div>
                </SettingRow>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="agents" className="mt-0">
              <SettingsCard>
                <SettingRow
                  icon={Clock}
                  label={t("settings.agentsTab.pollingInterval")}
                  description={t("settings.agentsTab.pollingDesc")}
                >
                  <Select value={String(settings.pollingIntervalMs)} onValueChange={handleIntervalChange}>
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60000">{t("settings.agentsTab.every1")}</SelectItem>
                      <SelectItem value="300000">{t("settings.agentsTab.every5")}</SelectItem>
                      <SelectItem value="900000">{t("settings.agentsTab.every15")}</SelectItem>
                      <SelectItem value="1800000">{t("settings.agentsTab.every30")}</SelectItem>
                      <SelectItem value="3600000">{t("settings.agentsTab.every60")}</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingRow>
              </SettingsCard>
            </TabsContent>

            <TabsContent value="account" className="mt-0">
              <SettingsCard>
                <SettingRow icon={LogOut} label={t("settings.account.gmailAccount")} description={email || t("settings.account.connected")}>
                  <Button variant="destructive" size="sm" onClick={handleDisconnect}>
                    <LogOut size={12} />
                    {t("settings.account.disconnect")}
                  </Button>
                </SettingRow>
              </SettingsCard>
            </TabsContent>

            <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary p-4">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">{t("settings.privacyTitle")}:</span> {t("settings.privacyBody")}
              </p>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
