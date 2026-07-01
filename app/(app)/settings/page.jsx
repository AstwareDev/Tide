"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Key, Clock, Cpu, LogOut, Check, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SettingRow } from "@/components/settings/setting-row";
import { api } from "@/lib/api-client";

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [settings, setSettings] = useState({ pollingIntervalMs: 300000, openrouterKeyConfigured: false });

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
      <div className="max-w-xl mx-auto p-6">
        <Tabs defaultValue="ai">
          <TabsList>
            <TabsTrigger value="ai">AI Provider</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="ai">
            <div className="bg-card border border-border rounded-xl px-4">
              <SettingRow icon={Cpu} label="AI Provider" description="The SDK used to run email classification agents">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground">OpenRouter</span>
                </div>
              </SettingRow>

              <SettingRow icon={Key} label="API Key" description="Set OPENROUTER_API_KEY in your Vercel project's environment variables">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
                  {settings.openrouterKeyConfigured ? (
                    <>
                      <Check size={13} className="text-emerald-500" />
                      <span className="text-xs text-muted-foreground">Configured</span>
                    </>
                  ) : (
                    <>
                      <X size={13} className="text-destructive" />
                      <span className="text-xs text-muted-foreground">Not set</span>
                    </>
                  )}
                </div>
              </SettingRow>
            </div>
          </TabsContent>

          <TabsContent value="agents">
            <div className="bg-card border border-border rounded-xl px-4">
              <SettingRow
                icon={Clock}
                label="Polling interval"
                description="Actual cadence is set by the Vercel Cron schedule (vercel.json) at deploy time — this is informational only"
              >
                <Select value={String(settings.pollingIntervalMs)} onValueChange={handleIntervalChange}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60000">Every minute</SelectItem>
                    <SelectItem value="300000">Every 5 minutes</SelectItem>
                    <SelectItem value="900000">Every 15 minutes</SelectItem>
                    <SelectItem value="1800000">Every 30 minutes</SelectItem>
                    <SelectItem value="3600000">Every hour</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
            </div>
          </TabsContent>

          <TabsContent value="account">
            <div className="bg-card border border-border rounded-xl px-4">
              <SettingRow icon={LogOut} label="Gmail account" description={email || "Connected"}>
                <Button variant="destructive" size="sm" onClick={handleDisconnect}>
                  <LogOut size={12} />
                  Disconnect
                </Button>
              </SettingRow>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 p-4 bg-secondary border border-border rounded-xl">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">Privacy:</span> Email content is sent to your AI provider for
            classification only. OAuth tokens are stored in Vercel KV, scoped to this deployment. Tide has no
            third-party analytics.
          </p>
        </div>
      </div>
    </div>
  );
}
