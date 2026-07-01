import { createContext, useContext, useState, useEffect } from "react";

const AgentContext = createContext(null);

const DEFAULT_AGENTS = [
  {
    id: "default-education",
    name: "Education Labeler",
    prompt: "Email is from an educational institution, course platform, or related to learning, courses, or certifications.",
    action: "label",
    labelName: "Education",
    enabled: true,
    isDefault: true,
  },
  {
    id: "default-ads",
    name: "Ads Deleter",
    prompt: "Email is a promotional advertisement, marketing email, sales pitch, or unsolicited commercial message.",
    action: "delete",
    labelName: null,
    enabled: true,
    isDefault: true,
  },
  {
    id: "default-security",
    name: "Stale Security Notifications",
    prompt: "Email is a security notification, password reset confirmation, login alert, or account activity notice that requires no further action.",
    action: "delete",
    labelName: null,
    enabled: true,
    isDefault: true,
  },
];

export function AgentProvider({ children }) {
  const [agents, setAgents] = useState(DEFAULT_AGENTS);
  const [runnerStatus, setRunnerStatus] = useState({ running: false, lastRunAt: null });

  useEffect(() => {
    const load = async () => {
      try {
        if (window.api?.agents?.list) {
          const list = await window.api.agents.list();
          if (list?.length) setAgents(list);
        }
      } catch {}
    };
    load();
  }, []);

  const createAgent = (data) => {
    const agent = {
      ...data,
      id: crypto.randomUUID(),
      isDefault: false,
      createdAt: Date.now(),
    };
    setAgents((prev) => [...prev, agent]);
    window.api?.agents?.create?.(data).catch(() => {});
    return agent;
  };

  const updateAgent = (id, data) => {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
    window.api?.agents?.update?.({ id, ...data }).catch(() => {});
  };

  const deleteAgent = (id) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
    window.api?.agents?.delete?.({ id }).catch(() => {});
  };

  const runNow = async () => {
    setRunnerStatus((s) => ({ ...s, running: true }));
    try {
      await window.api?.agents?.runNow?.();
    } catch {}
    setTimeout(() => {
      setRunnerStatus({ running: false, lastRunAt: Date.now() });
    }, 2000);
  };

  return (
    <AgentContext.Provider value={{ agents, runnerStatus, createAgent, updateAgent, deleteAgent, runNow }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgents() {
  return useContext(AgentContext);
}
