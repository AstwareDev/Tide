import { kv } from "@vercel/kv";

const KEYS = {
  tokens: "tide:gmail:tokens",
  userEmail: "tide:gmail:userEmail",
  settings: "tide:settings",
  agents: "tide:agents",
  activity: "tide:activity",
  processedMessageIds: "tide:processedMessageIds",
  agentStatus: "tide:agents:status",
};

const DEFAULT_SETTINGS = {
  pollingIntervalMs: 300000,
  maxConcurrentClassifications: 5,
};

export async function getTokens() {
  return (await kv.get(KEYS.tokens)) || null;
}

export async function setTokens(tokens) {
  await kv.set(KEYS.tokens, tokens);
}

export async function clearTokens() {
  await kv.del(KEYS.tokens);
}

export async function getUserEmail() {
  return (await kv.get(KEYS.userEmail)) || null;
}

export async function setUserEmail(email) {
  await kv.set(KEYS.userEmail, email);
}

export async function clearUserEmail() {
  await kv.del(KEYS.userEmail);
}

export async function getSettings() {
  const settings = await kv.get(KEYS.settings);
  return { ...DEFAULT_SETTINGS, ...(settings || {}) };
}

export async function setSettings(partial) {
  const current = await getSettings();
  const next = { ...current, ...partial };
  await kv.set(KEYS.settings, next);
  return next;
}

export async function getAgents() {
  return (await kv.get(KEYS.agents)) || null;
}

export async function setAgents(list) {
  await kv.set(KEYS.agents, list);
  return list;
}

export async function appendActivity(entry) {
  await kv.lpush(KEYS.activity, JSON.stringify(entry));
  await kv.ltrim(KEYS.activity, 0, 199);
}

export async function listActivity(limit = 100) {
  const raw = await kv.lrange(KEYS.activity, 0, Math.max(0, limit - 1));
  return raw.map((item) => (typeof item === "string" ? JSON.parse(item) : item));
}

export async function updateActivityEntry(id, patch) {
  const all = await listActivity(200);
  const next = all.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry));
  await kv.del(KEYS.activity);
  if (next.length) {
    await kv.rpush(KEYS.activity, ...next.map((e) => JSON.stringify(e)));
  }
  return next.find((entry) => entry.id === id) || null;
}

export async function isProcessed(id) {
  return Boolean(await kv.sismember(KEYS.processedMessageIds, id));
}

export async function markProcessed(id) {
  await kv.sadd(KEYS.processedMessageIds, id);
}

export async function markProcessedBatch(ids) {
  if (!ids.length) return;
  await kv.sadd(KEYS.processedMessageIds, ...ids);
}

export async function unmarkProcessed(id) {
  await kv.srem(KEYS.processedMessageIds, id);
}

export async function getAgentRunStatus() {
  return (
    (await kv.get(KEYS.agentStatus)) || { running: false, lastRunAt: null, processedCount: 0 }
  );
}

export async function setAgentRunStatus(status) {
  await kv.set(KEYS.agentStatus, status);
}
