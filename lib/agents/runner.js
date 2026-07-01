import { getAgents, setAgents, isProcessed, markProcessed, setAgentRunStatus, getAgentRunStatus } from "@/lib/kv";
import { DEFAULT_AGENTS } from "@/lib/agents/defaults";
import { listThreads } from "@/lib/gmail/fetchThreads";
import { getMessages } from "@/lib/gmail/fetchMessages";
import { applyAction } from "@/lib/gmail/modifyMessage";
import { classifyEmail } from "@/lib/ai/classifier";
import { logAgentAction } from "@/lib/activity/log";

const CANDIDATE_BATCH_SIZE = 100;

async function ensureDefaultAgents() {
  const existing = await getAgents();
  if (existing) return existing;
  return setAgents(DEFAULT_AGENTS);
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function runAgentCycle() {
  const status = await getAgentRunStatus();
  if (status.running) {
    return { skipped: true, reason: "already running" };
  }
  await setAgentRunStatus({ ...status, running: true });

  try {
    const allAgents = await ensureDefaultAgents();
    const enabledAgents = allAgents.filter((a) => a.enabled);

    if (!enabledAgents.length) {
      await setAgentRunStatus({ running: false, lastRunAt: Date.now(), processedCount: 0 });
      return { processed: 0, actionsTaken: 0 };
    }

    const { threads } = await listThreads({ maxResults: CANDIDATE_BATCH_SIZE, unlabeledOnly: true });
    const candidateMessageIds = [];
    for (const thread of threads) {
      // threads.list metadata gives us the latest message id via the thread id itself;
      // fetch full messages below keyed by message id (last message per thread).
      candidateMessageIds.push(thread.id);
    }

    const unprocessedThreadIds = [];
    for (const id of candidateMessageIds) {
      if (!(await isProcessed(id))) unprocessedThreadIds.push(id);
    }

    let processedCount = 0;
    let actionsTaken = 0;

    const settings = { maxConcurrentClassifications: 5 };
    const batches = chunk(unprocessedThreadIds, settings.maxConcurrentClassifications);

    for (const batch of batches) {
      await Promise.all(
        batch.map(async (threadId) => {
          const thread = threads.find((t) => t.id === threadId);
          if (!thread) return;

          const [email] = await getMessages([threadId]).catch(() => [null]);
          const normalizedEmail = email || {
            id: threadId,
            threadId,
            subject: thread.subject,
            from: thread.from,
            body: thread.snippet,
          };

          for (const agent of enabledAgents) {
            const result = await classifyEmail({ agent, email: normalizedEmail });
            if (result.matches) {
              const labelId = await applyAction(normalizedEmail.id, agent.action, agent.labelName).catch(() => null);
              await logAgentAction({
                agentName: agent.name,
                messageId: normalizedEmail.id,
                threadId,
                subject: normalizedEmail.subject,
                from: normalizedEmail.from,
                action: agent.action,
                labelApplied: agent.action === "label" ? agent.labelName : null,
                labelId: agent.action === "label" ? labelId : null,
                reason: result.reason,
              });
              actionsTaken += 1;
              break;
            }
          }

          await markProcessed(threadId);
          processedCount += 1;
        })
      );
    }

    await setAgentRunStatus({ running: false, lastRunAt: Date.now(), processedCount });
    return { processed: processedCount, actionsTaken };
  } catch (error) {
    await setAgentRunStatus({ running: false, lastRunAt: Date.now(), error: String(error?.message || error) });
    throw error;
  }
}
