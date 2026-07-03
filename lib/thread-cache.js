import { api } from "@/lib/api-client";

// In-memory only — module-level so it survives remounts within a session but
// resets on full reload. Holds either an in-flight promise (while fetching)
// or the resolved thread, so the modal can render instantly when a thread was
// already prefetched on hover.
const cache = new Map();

export function prefetchThread(id) {
  if (!id || cache.has(id)) return;
  cache.set(id, api.gmail.thread(id).catch((err) => {
    cache.delete(id);
    throw err;
  }));
}

export function getThread(id) {
  if (!cache.has(id)) prefetchThread(id);
  return cache.get(id);
}
