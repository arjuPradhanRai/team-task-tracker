import { useEffect, useState } from "react";
import api from "../api/axios";
import Badge from "../components/Badge";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status:"", priority:"", page:1, limit:10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchTasks(); }, [filters]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      params.append("page", filters.page);
      params.append("limit", filters.limit);
      const { data } = await api.get(`/tasks?${params}`);
      setTasks(data.data || data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const set = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }));

  return (
    <div style={styles.wrap}>
      <div style={styles.filters}>
        <select style={styles.select} value={filters.status} onChange={e => set("status", e.target.value)}>
          <option value="">All statuses</option>
          {["TODO","IN_PROGRESS","IN_REVIEW","DONE","BLOCKED"].map(s => <option key={s}>{s}</option>)}
        </select>
        <select style={styles.select} value={filters.priority} onChange={e => set("priority", e.target.value)}>
          <option value="">All priorities</option>
          {["LOW","MEDIUM","HIGH"].map(p => <option key={p}>{p}</option>)}
        </select>
        <select style={styles.select} value={filters.limit} onChange={e => set("limit", Number(e.target.value))}>
          {[10,25,50].map(l => <option key={l} value={l}>{l} per page</option>)}
        </select>
        <span style={styles.count}>{tasks.length} tasks</span>
      </div>

      {loading ? <p style={styles.empty}>Loading...</p> : tasks.length === 0 ? <p style={styles.empty}>No tasks found</p> : (
        <table style={styles.table}>
          <thead>
            <tr>{["Title","Status","Priority","Assignee","Due date"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t.id} style={styles.tr}>
                <td style={styles.td}>{t.title}</td>
                <td style={styles.td}><Badge type="status" value={t.status} /></td>
                <td style={styles.td}><Badge type="priority" value={t.priority} /></td>
                <td style={styles.td}>{t.assignee?.name || <span style={{color:"#aaa"}}>Unassigned</span>}</td>
                <td style={{...styles.td, color:"#888"}}>{t.due_date ? new Date(t.due_date).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={styles.pagination}>
        <button style={styles.pageBtn} disabled={filters.page <= 1} onClick={() => setFilters(f=>({...f,page:f.page-1}))}>← Prev</button>
        <span style={{fontSize:"13px",color:"#666"}}>Page {filters.page}</span>
        <button style={styles.pageBtn} disabled={tasks.length < filters.limit} onClick={() => setFilters(f=>({...f,page:f.page+1}))}>Next →</button>
      </div>
    </div>
  );
}

const styles = {
  wrap: { padding:"1.5rem", maxWidth:"1100px", margin:"0 auto" },
  filters: { display:"flex", gap:"8px", marginBottom:"1.25rem", alignItems:"center", flexWrap:"wrap" },
  select: { padding:"7px 10px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"13px" },
  count: { marginLeft:"auto", fontSize:"13px", color:"#888" },
  table: { width:"100%", borderCollapse:"collapse", fontSize:"13px" },
  th: { textAlign:"left", padding:"8px 12px", color:"#888", fontWeight:500, borderBottom:"1px solid #eee" },
  td: { padding:"10px 12px", borderBottom:"1px solid #f5f5f5" },
  tr: { cursor:"default" },
  empty: { textAlign:"center", padding:"3rem", color:"#aaa", fontSize:"14px" },
  pagination: { display:"flex", gap:"8px", justifyContent:"flex-end", alignItems:"center", marginTop:"1rem" },
  pageBtn: { padding:"5px 12px", border:"1px solid #ddd", borderRadius:"8px", background:"none", cursor:"pointer", fontSize:"13px" },
};