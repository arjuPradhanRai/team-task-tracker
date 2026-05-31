import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Analytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/analytics").then(r => {
      setData(r.data.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalOverdue = data.reduce((s, r) => s + r.overdueTasks, 0);
  const avgs = data.filter(r => r.avgCompletionHours !== null).map(r => r.avgCompletionHours);
  const avgAll = avgs.length ? (avgs.reduce((a,b)=>a+b,0)/avgs.length).toFixed(1) : "—";
  const maxOverdue = Math.max(...data.map(r => r.overdueTasks), 1);

  return (
    <div style={styles.wrap}>
      <div style={styles.metrics}>
        {[["Total users", data.length],["Overdue tasks", totalOverdue],["Avg completion", `${avgAll}h`]].map(([label,val]) => (
          <div key={label} style={styles.metricCard}>
            <div style={styles.metricLabel}>{label}</div>
            <div style={styles.metricValue}>{val}</div>
          </div>
        ))}
      </div>

      <h3 style={styles.sectionTitle}>Per-user breakdown</h3>
      {loading ? <p style={styles.empty}>Loading...</p> : (
        <table style={styles.table}>
          <thead>
            <tr>{["User","Email","Overdue tasks","Avg completion"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {data.map(r => (
              <tr key={r.userId}>
                <td style={styles.td}>{r.name}</td>
                <td style={{...styles.td, color:"#888"}}>{r.email}</td>
                <td style={styles.td}>
                  <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                    <div style={{width:`${Math.round((r.overdueTasks/maxOverdue)*80)}px`,height:"6px",borderRadius:"3px",background:r.overdueTasks>0?"#f7c1c1":"#eee"}} />
                    {r.overdueTasks}
                  </div>
                </td>
                <td style={{...styles.td, color:"#888"}}>{r.avgCompletionHours !== null ? `${r.avgCompletionHours}h` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  wrap: { padding:"1.5rem", maxWidth:"1100px", margin:"0 auto" },
  metrics: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:"12px", marginBottom:"1.5rem" },
  metricCard: { background:"#f8f8f8", borderRadius:"10px", padding:"1rem" },
  metricLabel: { fontSize:"12px", color:"#888", marginBottom:"6px" },
  metricValue: { fontSize:"26px", fontWeight:500 },
  sectionTitle: { fontSize:"14px", fontWeight:500, marginBottom:"0.75rem" },
  table: { width:"100%", borderCollapse:"collapse", fontSize:"13px" },
  th: { textAlign:"left", padding:"8px 12px", color:"#888", fontWeight:500, borderBottom:"1px solid #eee" },
  td: { padding:"10px 12px", borderBottom:"1px solid #f5f5f5" },
  empty: { textAlign:"center", padding:"3rem", color:"#aaa", fontSize:"14px" },
};