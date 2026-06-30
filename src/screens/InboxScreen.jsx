import { useState } from "react";
import { Mail, Trash2, Archive, Tag, ChevronRight, Search } from "lucide-react";

const MOCK_EMAILS = [
  { id: "1", subject: "Week 4: Neural Networks deep dive", from: "Prof. Smith <cs231n@stanford.edu>", snippet: "This week we'll cover backpropagation, gradient descent, and activation functions in detail...", date: Date.now() - 3600000, labelIds: [], classification: { action: "label", labelApplied: "Education", agentName: "Education Labeler" } },
  { id: "2", subject: "🔥 Flash Sale — 70% off everything today only!", from: "deals@fashionstore.com", snippet: "Don't miss our biggest sale of the year. Shop now and save big on all categories...", date: Date.now() - 7200000, labelIds: [], classification: { action: "delete", agentName: "Ads Deleter" } },
  { id: "3", subject: "Your password was successfully changed", from: "security-noreply@accounts.google.com", snippet: "Your Google Account password was changed on June 28. If you made this change, you're all set...", date: Date.now() - 86400000, labelIds: [], classification: { action: "delete", agentName: "Stale Security Notifications" } },
  { id: "4", subject: "Re: Project proposal feedback", from: "alex@company.com", snippet: "Hey, I reviewed the proposal and have a few thoughts. The architecture section looks solid but...", date: Date.now() - 10800000, labelIds: [], classification: null },
  { id: "5", subject: "New login from Chrome on Windows", from: "security@twitter.com", snippet: "We detected a new sign-in to your account from a new device. If this was you, you can ignore this...", date: Date.now() - 172800000, labelIds: [], classification: { action: "delete", agentName: "Stale Security Notifications" } },
  { id: "6", subject: "Your Coursera certificate is ready", from: "no-reply@coursera.org", snippet: "Congratulations! You've earned your certificate for Machine Learning Specialization...", date: Date.now() - 21600000, labelIds: [], classification: { action: "label", labelApplied: "Education", agentName: "Education Labeler" } },
  { id: "7", subject: "Exclusive offer: upgrade your plan", from: "hello@notion.so", snippet: "We're offering Notion Plus at 40% off for loyal users. This offer expires in 48 hours...", date: Date.now() - 43200000, labelIds: [], classification: { action: "delete", agentName: "Ads Deleter" } },
  { id: "8", subject: "Team standup notes — June 30", from: "sarah@company.com", snippet: "Here are the notes from today's standup. Action items are highlighted in yellow...", date: Date.now() - 1800000, labelIds: [], classification: null },
];

const ACTION_BADGE = {
  label: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  delete: "bg-red-500/15 text-red-400 border border-red-500/20",
  archive: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  skip: "bg-gray-500/15 text-gray-400 border border-gray-500/20",
};

function formatDate(ms) {
  const diff = Date.now() - ms;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export default function InboxScreen() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  const filtered = MOCK_EMAILS.filter(
    (e) =>
      e.subject.toLowerCase().includes(query.toLowerCase()) ||
      e.from.toLowerCase().includes(query.toLowerCase())
  );

  const selectedEmail = MOCK_EMAILS.find((e) => e.id === selected);

  return (
    <div className="flex h-full">
      {/* List panel */}
      <div className={`flex flex-col border-r border-white/5 ${selected ? "w-[420px] shrink-0" : "flex-1"}`}>
        {/* Search */}
        <div className="p-3 border-b border-white/5">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
            <Search size={14} className="text-gray-500 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search emails…"
              className="bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none flex-1"
            />
          </div>
        </div>

        {/* Email list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-600">
              <Mail size={32} strokeWidth={1.25} className="mb-3" />
              <p className="text-sm">No emails found</p>
            </div>
          ) : (
            filtered.map((email) => (
              <button
                key={email.id}
                onClick={() => setSelected(email.id === selected ? null : email.id)}
                className={`w-full text-left px-4 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${
                  selected === email.id ? "bg-white/[0.06]" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-[13px] font-medium text-gray-200 truncate">{email.subject}</span>
                  <span className="text-[11px] text-gray-600 shrink-0">{formatDate(email.date)}</span>
                </div>
                <div className="text-[11px] text-gray-500 mb-1.5 truncate">{email.from}</div>
                <div className="flex items-center gap-2">
                  {email.classification ? (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ACTION_BADGE[email.classification.action]}`}>
                      {email.classification.action === "label"
                        ? `Label: ${email.classification.labelApplied}`
                        : email.classification.action}
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-600">Unprocessed</span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selectedEmail && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-white font-semibold text-base mb-1">{selectedEmail.subject}</h2>
            <p className="text-gray-400 text-sm">{selectedEmail.from}</p>
            <p className="text-gray-600 text-xs mt-1">{formatDate(selectedEmail.date)}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{selectedEmail.snippet}</p>

            {selectedEmail.classification && (
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-medium">Agent Decision</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ACTION_BADGE[selectedEmail.classification.action]}`}>
                    {selectedEmail.classification.action === "label"
                      ? `Label: ${selectedEmail.classification.labelApplied}`
                      : selectedEmail.classification.action.charAt(0).toUpperCase() + selectedEmail.classification.action.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500">by {selectedEmail.classification.agentName}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty detail state */}
      {!selectedEmail && (
        <div className="flex-1 flex items-center justify-center text-gray-700">
          <div className="text-center">
            <ChevronRight size={32} strokeWidth={1.25} className="mx-auto mb-3" />
            <p className="text-sm">Select an email to preview</p>
          </div>
        </div>
      )}
    </div>
  );
}
