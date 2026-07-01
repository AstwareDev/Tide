import { Badge } from "@/components/ui/badge";

const ACTION_BADGE_VARIANT = {
  label: "default",
  delete: "destructive",
  archive: "amber",
  skip: "secondary",
};

export function AgentDecisionCard({ classification }) {
  if (!classification) return null;
  return (
    <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-medium">Agent Decision</p>
      <div className="flex items-center gap-2 mb-2">
        <Badge variant={ACTION_BADGE_VARIANT[classification.action] || "secondary"}>
          {classification.action === "label" ? `Label: ${classification.labelApplied}` : classification.action}
        </Badge>
        <span className="text-xs text-gray-500">by {classification.agentName}</span>
      </div>
      {classification.reason && <p className="text-xs text-gray-500 italic">{classification.reason}</p>}
    </div>
  );
}
