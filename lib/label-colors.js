// Deterministic pastel palette for Gmail user labels, in the spirit of Notion's
// tag colors. Falls back to a hash of the label id so the same label always
// gets the same color across renders, independent of Gmail's own color field
// (which most user labels never set).
const PALETTE = [
  { dot: "#3b82f6", bg: "rgba(59,130,246,0.12)", text: "#2563eb" }, // blue
  { dot: "#10b981", bg: "rgba(16,185,129,0.12)", text: "#059669" }, // green
  { dot: "#f59e0b", bg: "rgba(245,158,11,0.14)", text: "#b45309" }, // amber
  { dot: "#ef4444", bg: "rgba(239,68,68,0.12)", text: "#dc2626" }, // red
  { dot: "#a855f7", bg: "rgba(168,85,247,0.12)", text: "#9333ea" }, // purple
  { dot: "#ec4899", bg: "rgba(236,72,153,0.12)", text: "#db2777" }, // pink
  { dot: "#06b6d4", bg: "rgba(6,182,212,0.12)", text: "#0891b2" }, // cyan
  { dot: "#84cc16", bg: "rgba(132,204,22,0.14)", text: "#65a30d" }, // lime
  { dot: "#6b7280", bg: "rgba(107,114,128,0.14)", text: "#4b5563" }, // gray
  { dot: "#f97316", bg: "rgba(249,115,22,0.13)", text: "#c2410c" }, // orange
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getLabelColor(label) {
  if (label?.color?.backgroundColor) {
    return {
      dot: label.color.backgroundColor,
      bg: label.color.backgroundColor,
      text: label.color.textColor || "#ffffff",
      solid: true,
    };
  }
  const key = label?.id || label?.name || "?";
  return PALETTE[hashString(key) % PALETTE.length];
}
