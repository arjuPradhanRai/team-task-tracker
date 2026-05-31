import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <span style={styles.logo}>☑ TaskTracker</span>
        <Link style={styles.link} to="/">Tasks</Link>
        <Link style={styles.link} to="/analytics">Analytics</Link>
      </div>
      <button style={styles.btn} onClick={logout}>Sign out</button>
    </nav>
  );
}

const styles = {
  nav: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 1.5rem", height:"52px", background:"#fff", borderBottom:"1px solid #eee" },
  left: { display:"flex", alignItems:"center", gap:"1.5rem" },
  logo: { fontWeight:500, fontSize:"15px" },
  link: { fontSize:"14px", color:"#444", textDecoration:"none" },
  btn: { fontSize:"13px", padding:"5px 12px", border:"1px solid #ddd", borderRadius:"8px", background:"none", cursor:"pointer" },
};