import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

const ClassificationSchema = z.object({
  matches: z.boolean().describe("Whether this email matches the agent's described criteria"),
  reason: z.string().describe("One-sentence explanation of the decision, shown in the activity log"),
});

export async function classifyEmail({ agent, email }) {
  const { object } = await generateObject({
    model: openrouter(process.env.OPENROUTER_MODEL || "anthropic/claude-sonnet-4.5"),
    schema: ClassificationSchema,
    system:
      "You are an email triage assistant. Decide whether the given email matches the rule described by the user. Be conservative: only return matches: true when the email clearly satisfies the rule.",
    prompt: [
      `Rule: ${agent.prompt}`,
      `Action to take on match: ${agent.action}${agent.labelName ? ` (label: ${agent.labelName})` : ""}`,
      "",
      `Email subject: ${email.subject}`,
      `Email from: ${email.from}`,
      `Email body (truncated): ${email.body}`,
    ].join("\n"),
  });

  return object;
}
