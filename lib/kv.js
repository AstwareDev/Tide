import { Pool } from "pg";

const KEYS = {
  tokens: "tide:gmail:tokens",
  userEmail: "tide:gmail:userEmail",
  settings: "tide:settings",
  agents: "tide:agents",
  agentStatus: "tide:agents:status",
};

const DEFAULT_SETTINGS = {
  pollingIntervalMs: 300000,
  maxConcurrentClassifications: 5,
};

// Reused across warm serverless invocations; each cold start gets its own pool.
let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 1,
    });
  }
  return pool;
}

async function query(text, params) {
  return getPool().query(text, params);
}

async function getKv(key) {
  const { rows } = await query("SELECT value FROM tide_kv WHERE key = $1", [key]);
  return rows[0]?.value ?? null;
}

async function setKv(key, value) {
  await query(
    `INSERT INTO tide_kv (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [key, JSON.stringify(value)]
  );
}

async function delKv(key) {
  await query("DELETE FROM tide_kv WHERE key = $1", [key]);
}

export async function getTokens() {
  return getKv(KEYS.tokens);
}

export async function setTokens(tokens) {
  await setKv(KEYS.tokens, tokens);
}

export async function clearTokens() {
  await delKv(KEYS.tokens);
}

export async function getUserEmail() {
  return getKv(KEYS.userEmail);
}

export async function setUserEmail(email) {
  await setKv(KEYS.userEmail, email);
}

export async function clearUserEmail() {
  await delKv(KEYS.userEmail);
}

export async function getSettings() {
  const settings = await getKv(KEYS.settings);
  return { ...DEFAULT_SETTINGS, ...(settings || {}) };
}

export async function setSettings(partial) {
  const current = await getSettings();
  const next = { ...current, ...partial };
  await setKv(KEYS.settings, next);
  return next;
}

export async function getAgents() {
  return getKv(KEYS.agents);
}

export async function setAgents(list) {
  await setKv(KEYS.agents, list);
  return list;
}

export async function appendActivity(entry) {
  await query(
    `INSERT INTO tide_activity (id, data) VALUES ($1, $2)
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
    [entry.id, JSON.stringify(entry)]
  );
  await query(
    `DELETE FROM tide_activity WHERE id NOT IN (
       SELECT id FROM tide_activity ORDER BY created_at DESC LIMIT 200
     )`
  );
}

export async function listActivity(limit = 100) {
  const { rows } = await query(
    "SELECT data FROM tide_activity ORDER BY created_at DESC LIMIT $1",
    [limit]
  );
  return rows.map((row) => row.data);
}

export async function updateActivityEntry(id, patch) {
  const { rows } = await query("SELECT data FROM tide_activity WHERE id = $1", [id]);
  if (!rows.length) return null;
  const next = { ...rows[0].data, ...patch };
  await query("UPDATE tide_activity SET data = $2 WHERE id = $1", [id, JSON.stringify(next)]);
  return next;
}

export async function isProcessed(id) {
  const { rows } = await query("SELECT 1 FROM tide_processed_messages WHERE id = $1", [id]);
  return rows.length > 0;
}

export async function markProcessed(id) {
  await query(
    "INSERT INTO tide_processed_messages (id) VALUES ($1) ON CONFLICT DO NOTHING",
    [id]
  );
}

export async function markProcessedBatch(ids) {
  if (!ids.length) return;
  await query(
    `INSERT INTO tide_processed_messages (id)
     SELECT unnest($1::text[]) ON CONFLICT DO NOTHING`,
    [ids]
  );
}

export async function unmarkProcessed(id) {
  await query("DELETE FROM tide_processed_messages WHERE id = $1", [id]);
}

export async function getAgentRunStatus() {
  return (await getKv(KEYS.agentStatus)) || { running: false, lastRunAt: null, processedCount: 0 };
}

export async function setAgentRunStatus(status) {
  await setKv(KEYS.agentStatus, status);
}
