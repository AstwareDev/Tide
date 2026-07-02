async function request(path, options) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request to ${path} failed`);
  }
  return res.json();
}

export const api = {
  auth: {
    status: () => request("/api/auth/status"),
    logout: () => request("/api/auth/logout", { method: "POST" }),
  },
  gmail: {
    threads: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/api/gmail/threads${qs ? `?${qs}` : ""}`);
    },
    thread: (id) => request(`/api/gmail/threads/${id}`),
    labels: () => request("/api/gmail/labels"),
    avatars: (emails) => request("/api/gmail/avatars", { method: "POST", body: JSON.stringify({ emails }) }),
    action: (body) => request("/api/gmail/actions", { method: "POST", body: JSON.stringify(body) }),
  },
  agents: {
    list: () => request("/api/agents"),
    create: (data) => request("/api/agents", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => request(`/api/agents/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    remove: (id) => request(`/api/agents/${id}`, { method: "DELETE" }),
    runNow: () => request("/api/agents/run-now", { method: "POST" }),
    status: () => request("/api/agents/status"),
    preview: (data) => request("/api/agents/preview", { method: "POST", body: JSON.stringify(data) }),
  },
  activity: {
    list: (limit = 100) => request(`/api/activity?limit=${limit}`),
    undo: (entryId) => request("/api/activity/undo", { method: "POST", body: JSON.stringify({ entryId }) }),
  },
  settings: {
    get: () => request("/api/settings"),
    update: (data) => request("/api/settings", { method: "PATCH", body: JSON.stringify(data) }),
  },
};
