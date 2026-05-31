const statusColors = {
  TODO: { bg:"#e8e8e8", color:"#555" },
  IN_PROGRESS: { bg:"#dbeafe", color:"#1e40af" },
  IN_REVIEW: { bg:"#fef3c7", color:"#92400e" },
  DONE: { bg:"#dcfce7", color:"#166534" },
  BLOCKED: { bg:"#fee2e2", color:"#991b1b" },
};
const priorityColors = {
  LOW: { bg:"#e8e8e8", color:"#555" },
  MEDIUM: { bg:"#fef3c7", color:"#92400e" },
  HIGH: { bg:"#fee2e2", color:"#991b1b" },
};

export default function Badge({ type, value }) {
  const map = type === "status" ? statusColors : priorityColors;
  const style = map[value] || { bg:"#eee", color:"#333" };
  const label = type === "status"
    ? { TODO:"Todo", IN_PROGRESS:"In progress", IN_REVIEW:"In review", DONE:"Done", BLOCKED:"Blocked" }[value]
    : value;
  return (
    <span style={{ background:style.bg, color:style.color, padding:"3px 8px", borderRadius:"100px", fontSize:"11px", fontWeight:500 }}>
      {label}
    </span>
  );
}