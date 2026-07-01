"use client";

import { useCallback, useState } from "react";

export function useInboxSelection(threadIds) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [checked, setChecked] = useState(new Set());

  const move = useCallback(
    (delta) => {
      setActiveIndex((i) => Math.max(0, Math.min(threadIds.length - 1, i + delta)));
    },
    [threadIds.length]
  );

  const toggleChecked = useCallback((id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const extendChecked = useCallback(
    (delta) => {
      setActiveIndex((i) => {
        const next = Math.max(0, Math.min(threadIds.length - 1, i + delta));
        setChecked((prevChecked) => {
          const nextChecked = new Set(prevChecked);
          nextChecked.add(threadIds[i]);
          nextChecked.add(threadIds[next]);
          return nextChecked;
        });
        return next;
      });
    },
    [threadIds]
  );

  const activeId = threadIds[activeIndex] ?? null;

  return { activeIndex, activeId, setActiveIndex, move, checked, toggleChecked, extendChecked, setChecked };
}
