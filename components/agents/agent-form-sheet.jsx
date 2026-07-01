"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AgentPreviewPanel } from "@/components/agents/agent-preview-panel";
import { AgentTemplatePicker } from "@/components/agents/agent-template-picker";
import { cn } from "@/lib/utils";

const ACTIONS = [
  { value: "label", label: "Label", color: "text-blue-400 border-blue-500/30" },
  { value: "archive", label: "Archive", color: "text-amber-400 border-amber-500/30" },
  { value: "delete", label: "Delete", color: "text-red-400 border-red-500/30" },
];

export function AgentFormSheet({ open, onOpenChange, initial, onSave }) {
  const [form, setForm] = useState({ name: "", prompt: "", action: "label", labelName: "", enabled: true });

  useEffect(() => {
    if (open) {
      setForm(initial || { name: "", prompt: "", action: "label", labelName: "", enabled: true });
    }
  }, [open, initial]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{initial ? "Edit Agent" : "New Agent"}</SheetTitle>
        </SheetHeader>

        {!initial && (
          <>
            <p className="text-xs text-muted-foreground mb-2">Start from a template</p>
            <AgentTemplatePicker onPick={(tpl) => setForm((f) => ({ ...f, ...tpl }))} />
            <Separator className="my-4" />
          </>
        )}

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Newsletter Archiver" />
          </div>

          <div>
            <Label>Prompt</Label>
            <Textarea
              value={form.prompt}
              onChange={(e) => set("prompt", e.target.value)}
              placeholder="Describe what kind of email this agent should handle…"
              rows={4}
            />
          </div>

          <div>
            <Label>Action</Label>
            <div className="flex gap-2">
              {ACTIONS.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => set("action", a.value)}
                  className={cn(
                    "flex-1 rounded-lg border py-2 text-sm font-medium transition-colors",
                    form.action === a.value ? `bg-accent ${a.color}` : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {form.action === "label" && (
            <div>
              <Label>Label name</Label>
              <Input value={form.labelName || ""} onChange={(e) => set("labelName", e.target.value)} placeholder="e.g. Education" />
            </div>
          )}

          <div>
            <Label>Preview</Label>
            <AgentPreviewPanel prompt={form.prompt} action={form.action} labelName={form.labelName} />
          </div>
        </div>

        <SheetFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!form.name || !form.prompt}
            onClick={() => {
              onSave(form);
              onOpenChange(false);
            }}
          >
            {initial ? "Save changes" : "Create agent"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
