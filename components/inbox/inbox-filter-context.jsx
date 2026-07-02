"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const InboxFilterContext = createContext(null);

export function InboxFilterProvider({ children }) {
  const [selectedLabelIds, setSelectedLabelIds] = useState(new Set());
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [labels, setLabels] = useState([]);
  const [threads, setThreads] = useState([]);

  const toggleLabel = useCallback((id) => {
    setSelectedLabelIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedLabelIds(new Set());
    setShowUnreadOnly(false);
  }, []);

  const userLabels = useMemo(() => labels.filter((l) => l.type === "user"), [labels]);

  const value = useMemo(
    () => ({
      selectedLabelIds,
      toggleLabel,
      showUnreadOnly,
      setShowUnreadOnly,
      clearFilters,
      labels,
      setLabels,
      userLabels,
      threads,
      setThreads,
    }),
    [selectedLabelIds, toggleLabel, showUnreadOnly, clearFilters, labels, userLabels, threads]
  );

  return <InboxFilterContext.Provider value={value}>{children}</InboxFilterContext.Provider>;
}

export function useInboxFilter() {
  const ctx = useContext(InboxFilterContext);
  if (!ctx) throw new Error("useInboxFilter must be used within an InboxFilterProvider");
  return ctx;
}
