# Tide

> AI-powered Gmail inbox management. Passive agents read your email, label what matters, and quietly delete the noise.

## What is Tide?

Tide is a desktop app (Electron + React) that connects to your Gmail account and runs background AI agents. Each agent reads your unlabeled emails, classifies them using Claude AI, and takes action automatically — labeling important ones, archiving clutter, or deleting things that were only ever useful for a moment (ads, stale security alerts, password-change confirmations).

You define the rules. The agents do the work.

**Default agents out of the box:**
- **Education Labeler** — labels emails from courses, universities, or learning platforms as `Education`
- **Ads Deleter** — trashes promotional and marketing emails
- **Stale Security Notification Deleter** — removes one-time alerts like "new sign-in detected" or "password changed successfully" that have no ongoing value

---

## Prerequisites

- **Node.js** ≥ 20
- **A Google Cloud project** with the Gmail API enabled and OAuth2 credentials (Desktop App type)
- **An Anthropic API key** — get one at [console.anthropic.com](https://console.anthropic.com)

---

## Google Cloud Setup

You need OAuth2 credentials to let Tide access Gmail on your behalf. This is a one-time setup.

1. Go to [Google Cloud Console](https://console.cloud.google.com) and create a new project (or use an existing one).

2. Navigate to **APIs & Services → Library**, search for **Gmail API**, and click **Enable**.

3. Navigate to **APIs & Services → OAuth consent screen**:
   - Choose **External** (or Internal if using Google Workspace)
   - Fill in the app name (e.g. "Tide"), your email, and developer contact
   - Add the scope: `https://www.googleapis.com/auth/gmail.modify`
   - Add your Gmail address as a test user

4. Navigate to **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Desktop app**
   - Name it anything (e.g. "Tide Desktop")
   - Click **Create**

5. Copy your **Client ID** and **Client Secret**. You'll need them in the next step.

---

## Installation

```bash
git clone https://github.com/your-username/tide
cd tide
npm install
```

Open `electron/auth/gmailAuth.js` and replace the placeholder values:

```js
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'
const CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET'
```

> These are "installed app" OAuth2 credentials. It is safe to include them in a desktop app — Google designed this credential type for exactly this use case.

---

## Development

```bash
npm run dev
```

The app opens automatically. Click **Connect Gmail** to authenticate, then your inbox loads.

---

## Building for Distribution

```bash
npm run package
```

Output is placed in the `release/` directory.

**macOS note:** distributing to other machines requires code signing. Set up an Apple Developer certificate and configure `electron-builder` accordingly, or distribute unsigned builds for personal use only.

---

## Agent Configuration

Agents are configured in the **Agents** screen. Each agent has:

| Field | Description |
|---|---|
| **Name** | Display name for the agent |
| **Prompt** | Natural language instruction — describe what kind of email this agent should handle |
| **Action** | What to do when the prompt matches: `label`, `archive`, `delete`, or `skip` |
| **Label** | (Only for `label` action) The Gmail label to apply |
| **Enabled** | Toggle the agent on or off |

**Tips for writing effective prompts:**
- Be specific about what the email *is*, not what to do with it (the action handles that)
- Include examples of senders or subject patterns if relevant
- Agents default to `skip` when uncertain — a conservative prompt is safer than an aggressive one

**Action types:**
- `label` — applies a Gmail label and keeps the email in your inbox
- `archive` — removes from inbox, keeps in All Mail
- `delete` — moves to Trash (Gmail empties Trash after 30 days)
- `skip` — do nothing (the agent's no-match response)

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Electron Main Process                              │
│                                                     │
│  ┌──────────┐  ┌─────────────┐  ┌───────────────┐  │
│  │ Gmail    │  │  Anthropic  │  │  Agent Runner │  │
│  │ OAuth2   │  │  Classifier │  │  (polling)    │  │
│  └──────────┘  └─────────────┘  └───────────────┘  │
│                                                     │
│  electron-store (tokens, agents, activity, settings)│
└──────────────────────┬──────────────────────────────┘
                       │ IPC (contextBridge)
┌──────────────────────▼──────────────────────────────┐
│  React Renderer                                     │
│  Auth → Inbox → Agents → Activity → Settings        │
└─────────────────────────────────────────────────────┘
```

**All Gmail and Claude API calls happen in the main process** — credentials never touch the renderer.

**OAuth2 flow:** Tide starts a temporary local HTTP server, opens your browser to Google's login page, catches the redirect on `localhost`, exchanges the code for tokens, and stores them securely in your OS user data directory. Your browser handles the actual login — Tide never sees your password.

**Agent cycle:** Every 5 minutes (configurable), the agent runner fetches up to 100 unlabeled emails, sends each one to Claude with the agent's prompt, and applies the returned action. Already-processed emails are tracked to avoid re-classifying.

---

## Privacy

- Email content is sent to **Claude's API** (Anthropic) for classification. No other third party receives your email data.
- OAuth tokens are stored in your OS `userData` directory (e.g. `~/Library/Application Support/Tide` on macOS), not in the project directory.
- Tide has no analytics, no telemetry, and no backend of its own.

---

## Limitations

- **"Delete" means Trash**, not permanent deletion. Gmail automatically empties Trash after 30 days.
- The agent runner processes up to **100 unlabeled emails per cycle**. Very large backlogs may take several cycles to clear.
- Classification accuracy depends on prompt quality. Start with conservative prompts and tune based on the Activity log.
- Gmail API has a daily quota. For most personal inboxes this is never a concern.

---

## License

MIT
