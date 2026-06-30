import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, LogOut, Key, Clock, Cpu } from "lucide-react";

function SettingRow({ icon: Icon, label, description, children }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-white/[0.06]">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
          <Icon size={15} className="text-gray-400" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm text-gray-200 font-medium">{label}</p>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsScreen() {
  const { email, disconnect } = useAuth();
  const navigate = useNavigate();

  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [interval, setInterval] = useState("5");

  const handleSaveKey = async () => {
    try {
      await window.api?.settings?.save?.({ anthropicApiKey: apiKey });
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDisconnect = async () => {
    await disconnect();
    navigate("/auth");
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-xl mx-auto p-6">

        {/* AI Provider */}
        <div className="mb-6">
          <h2 className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-3">AI Provider</h2>
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-4">
            <SettingRow icon={Cpu} label="AI Provider" description="The SDK used to run email classification agents">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-violet-400" />
                <span className="text-xs text-gray-300">Vercel AI SDK</span>
              </div>
            </SettingRow>

            <SettingRow icon={Key} label="API Key" description="Your AI provider API key — stored locally, never sent to our servers">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="bg-white/5 border border-white/10 rounded-lg pl-3 pr-8 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500/60 w-52"
                  />
                  <button
                    onClick={() => setShowKey((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
                <button
                  onClick={handleSaveKey}
                  disabled={!apiKey}
                  className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  {saved ? <Check size={13} className="text-white" /> : <Check size={13} className="text-white" />}
                </button>
              </div>
            </SettingRow>
          </div>
        </div>

        {/* Agent settings */}
        <div className="mb-6">
          <h2 className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-3">Agents</h2>
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-4">
            <SettingRow icon={Clock} label="Polling interval" description="How often agents scan for new unlabeled emails">
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500/60"
              >
                <option value="1">Every minute</option>
                <option value="5">Every 5 minutes</option>
                <option value="15">Every 15 minutes</option>
                <option value="30">Every 30 minutes</option>
                <option value="60">Every hour</option>
              </select>
            </SettingRow>
          </div>
        </div>

        {/* Account */}
        <div>
          <h2 className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-3">Account</h2>
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-4">
            <SettingRow icon={LogOut} label="Gmail account" description={email || "Connected"}>
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-medium rounded-lg transition-colors"
              >
                <LogOut size={12} />
                Disconnect
              </button>
            </SettingRow>
          </div>
        </div>

        {/* Privacy note */}
        <div className="mt-8 p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
          <p className="text-xs text-gray-600 leading-relaxed">
            <span className="text-gray-400 font-medium">Privacy:</span> Email content is sent to your AI provider for classification only. OAuth tokens are stored in your OS user data directory. Tide has no backend and no telemetry.
          </p>
        </div>
      </div>
    </div>
  );
}
