"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Minus, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";

export function AgentPreviewPanel({ prompt, action, labelName }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!prompt || prompt.trim().length < 8) {
      setResults(null);
      return;
    }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.agents.preview({ prompt, action, labelName });
        setResults(data.results);
      } catch {
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 600);
    return () => clearTimeout(timerRef.current);
  }, [prompt, action, labelName]);

  if (!prompt || prompt.trim().length < 8) {
    return <p className="text-xs text-gray-600">Type a rule above to preview matches against your recent inbox.</p>;
  }

  return (
    <div className="border border-white/[0.08] rounded-lg bg-white/[0.02] p-3">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Live preview</p>
        {loading && <Loader2 size={12} className="animate-spin text-gray-500" />}
      </div>
      {!results ? (
        <p className="text-xs text-gray-600">{loading ? "Checking recent emails…" : "No recent emails to preview against."}</p>
      ) : (
        <div className="space-y-1.5">
          {results.map((r) => (
            <div key={r.messageId} className="flex items-start gap-2 text-xs">
              {r.matches ? (
                <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Minus size={13} className="text-gray-600 shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <span className={r.matches ? "text-gray-300" : "text-gray-600"}>{r.subject}</span>
                <p className="text-gray-600 italic truncate">{r.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
