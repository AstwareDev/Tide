import { useLocation } from "react-router-dom";
import { Play, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAgents } from "../../context/AgentContext";

const TITLES = {
  "/inbox": "Inbox",
  "/agents": "Agents",
  "/activity": "Activity",
  "/settings": "Settings",
};

export default function TopBar() {
  const { pathname } = useLocation();
  const { email } = useAuth();
  const { runnerStatus, runNow } = useAgents();

  const title = TITLES[pathname] || "Tide";

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-white/5 bg-[#0f1117]">
      <h1 className="text-white font-semibold text-base">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Connection badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-gray-300 max-w-[160px] truncate">{email}</span>
        </div>

        {/* Run Now button */}
        <button
          onClick={runNow}
          disabled={runnerStatus.running}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-full transition-colors"
        >
          {runnerStatus.running ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Play size={12} fill="currentColor" />
          )}
          {runnerStatus.running ? "Running…" : "Run Now"}
        </button>
      </div>
    </header>
  );
}
