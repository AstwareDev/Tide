"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyboardShortcutsProvider, useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { NavRail } from "@/components/layout/nav-rail";
import { TopBar } from "@/components/layout/top-bar";
import { CommandPalette } from "@/components/layout/command-palette";
import { ShortcutsHelpDialog } from "@/components/layout/shortcuts-help-dialog";
import { api } from "@/lib/api-client";

function AppShell({ children }) {
  const router = useRouter();
  const [email, setEmail] = useState(null);
  const [running, setRunning] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    api.auth.status().then((s) => setEmail(s.email)).catch(() => {});
  }, []);

  const runNow = useCallback(async () => {
    setRunning(true);
    try {
      const result = await api.agents.runNow();
      toast.success(
        result.actionsTaken
          ? `Processed ${result.processed} emails, ${result.actionsTaken} action${result.actionsTaken === 1 ? "" : "s"} taken`
          : `Checked ${result.processed || 0} emails, nothing to do`
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRunning(false);
    }
  }, []);

  useKeyboardShortcuts(
    {
      "mod+k": () => setCommandOpen((o) => !o),
      "?": () => setHelpOpen((o) => !o),
      "g>i": () => router.push("/inbox"),
      "g>a": () => router.push("/agents"),
      "g>t": () => router.push("/activity"),
      "g>s": () => router.push("/settings"),
    },
    { allowInInputs: ["mod+k"] }
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <NavRail email={email} />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar email={email} running={running} onRunNow={runNow} />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} onRunNow={runNow} />
      <ShortcutsHelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}

export default function AppLayout({ children }) {
  return (
    <KeyboardShortcutsProvider>
      <AppShell>{children}</AppShell>
    </KeyboardShortcutsProvider>
  );
}
