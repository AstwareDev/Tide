import { OAuth2Client } from "google-auth-library";
import { getTokens, setTokens } from "@/lib/kv";

export const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/contacts.readonly",
  "https://www.googleapis.com/auth/contacts.other.readonly",
];

function getRedirectUri() {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/api/auth/callback`;
}

// Constructs a fresh OAuth2Client per invocation — serverless functions don't
// share memory across invocations, so there is no long-lived singleton like
// there was in the Electron main process.
export async function getOAuth2Client() {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    getRedirectUri()
  );

  client.on("tokens", async (tokens) => {
    const existing = (await getTokens()) || {};
    await setTokens({ ...existing, ...tokens });
  });

  const tokens = await getTokens();
  if (tokens) client.setCredentials(tokens);

  return client;
}

export function buildAuthUrl(client) {
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: GMAIL_SCOPES,
  });
}
