import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AgentProvider } from "./context/AgentContext";
import { ActivityProvider } from "./context/ActivityContext";
import AuthScreen from "./screens/AuthScreen";
import InboxScreen from "./screens/InboxScreen";
import AgentsScreen from "./screens/AgentsScreen";
import ActivityScreen from "./screens/ActivityScreen";
import SettingsScreen from "./screens/SettingsScreen";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";

function ProtectedLayout() {
  const { connected } = useAuth();
  if (!connected) return <Navigate to="/auth" replace />;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0f1117]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/inbox" element={<InboxScreen />} />
            <Route path="/agents" element={<AgentsScreen />} />
            <Route path="/activity" element={<ActivityScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="*" element={<Navigate to="/inbox" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function RootRedirect() {
  const { connected } = useAuth();
  return <Navigate to={connected ? "/inbox" : "/auth"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <AgentProvider>
        <ActivityProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/auth" element={<AuthScreen />} />
              <Route path="/*" element={<ProtectedLayout />} />
            </Routes>
          </HashRouter>
        </ActivityProvider>
      </AgentProvider>
    </AuthProvider>
  );
}
