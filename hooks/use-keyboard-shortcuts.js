"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";

const KeyboardShortcutsContext = createContext(null);

function isTypingTarget(target) {
  if (!target) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable ||
    target.closest?.("[role='dialog']") != null && target.closest?.("[data-allow-typing]") != null
  );
}

const CHORD_WINDOW_MS = 600;

export function KeyboardShortcutsProvider({ children }) {
  const scopesRef = useRef([]); // stack of { id, handlers: Map<key, fn>, allowInInputs: Set<key> }
  const chordRef = useRef({ pending: null, timer: null });

  const register = useCallback((id, handlers, options = {}) => {
    const scope = { id, handlers, allowInInputs: options.allowInInputs || new Set() };
    scopesRef.current = [...scopesRef.current, scope];
    return () => {
      scopesRef.current = scopesRef.current.filter((s) => s.id !== id);
    };
  }, []);

  useEffect(() => {
    function normalizeKey(e) {
      const parts = [];
      if (e.metaKey || e.ctrlKey) parts.push("mod");
      if (e.shiftKey) parts.push("shift");
      parts.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
      return parts.join("+");
    }

    function handleKeyDown(e) {
      const key = normalizeKey(e);
      const typing = isTypingTarget(e.target);

      // Walk scopes from most-recently-registered (innermost) to outermost.
      for (let i = scopesRef.current.length - 1; i >= 0; i--) {
        const scope = scopesRef.current[i];

        // Chord support: "g" then a follow-up key within CHORD_WINDOW_MS.
        if (chordRef.current.pending && scope.handlers.has(`${chordRef.current.pending}>${key}`)) {
          if (typing && !scope.allowInInputs.has(`${chordRef.current.pending}>${key}`)) continue;
          e.preventDefault();
          scope.handlers.get(`${chordRef.current.pending}>${key}`)(e);
          clearChord();
          return;
        }

        if (scope.handlers.has(key)) {
          if (typing && !scope.allowInInputs.has(key)) continue;
          const isChordStarter = [...scope.handlers.keys()].some((k) => k.startsWith(`${key}>`));
          if (isChordStarter) {
            startChord(key);
            return;
          }
          e.preventDefault();
          scope.handlers.get(key)(e);
          return;
        }
      }
    }

    function startChord(key) {
      chordRef.current.pending = key;
      clearTimeout(chordRef.current.timer);
      chordRef.current.timer = setTimeout(clearChord, CHORD_WINDOW_MS);
    }

    function clearChord() {
      chordRef.current.pending = null;
      clearTimeout(chordRef.current.timer);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <KeyboardShortcutsContext.Provider value={{ register }}>{children}</KeyboardShortcutsContext.Provider>
  );
}

let scopeCounter = 0;

// handlers: { "j": fn, "mod+k": fn, "g>i": fn (chord) }
export function useKeyboardShortcuts(handlers, { enabled = true, allowInInputs = [] } = {}) {
  const ctx = useContext(KeyboardShortcutsContext);
  const idRef = useRef(null);
  if (idRef.current === null) idRef.current = `scope-${scopeCounter++}`;

  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!ctx || !enabled) return;
    const map = new Map(Object.entries(handlersRef.current));
    return ctx.register(idRef.current, map, { allowInInputs: new Set(allowInInputs) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, enabled, JSON.stringify(Object.keys(handlers))]);
}
