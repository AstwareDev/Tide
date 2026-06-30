import { NavLink } from "react-router-dom";
import { Inbox, Bot, Activity, Settings } from "lucide-react";

const NAV = [
  { to: "/inbox", icon: Inbox, label: "Inbox" },
  { to: "/agents", icon: Bot, label: "Agents" },
  { to: "/activity", icon: Activity, label: "Activity" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-[220px] shrink-0 flex flex-col bg-[#0a0c12] border-r border-white/5 py-4">
      {/* Logo */}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M7 1V13M1 4L13 10M13 4L1 10" stroke="white" strokeWidth="1" strokeOpacity="0.6" />
            </svg>
          </div>
          <span className="text-white font-semibold text-[15px] tracking-tight">Tide</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-white/10 text-white font-medium"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`
            }
          >
            <Icon size={16} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 mt-4">
        <div className="text-[11px] text-gray-600">v0.1.0</div>
      </div>
    </aside>
  );
}
