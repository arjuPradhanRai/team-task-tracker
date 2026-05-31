import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h2 style={styles.title}>☑ TaskTracker</h2>
        <h3 style={styles.sub}>Sign in</h3>
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Email" type="email"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input style={styles.input} placeholder="Password" type="password"
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.btn} type="submit">Sign in</button>
        </form>
        <p style={styles.link}>No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f5f5f5" },
  card: { background:"#fff", padding:"2rem", borderRadius:"12px", width:"100%", maxWidth:"400px", boxShadow:"0 1px 4px rgba(0,0,0,0.1)" },
  title: { marginBottom:"0.25rem", fontSize:"20px" },
  sub: { fontWeight:400, color:"#666", marginBottom:"1.5rem", fontSize:"15px" },
  input: { width:"100%", padding:"10px 12px", marginBottom:"12px", border:"1px solid #ddd", borderRadius:"8px", fontSize:"14px", boxSizing:"border-box" },
  btn: { width:"100%", padding:"10px", background:"#111", color:"#fff", border:"none", borderRadius:"8px", fontSize:"14px", cursor:"pointer", marginTop:"4px" },
  error: { color:"#c0392b", fontSize:"13px", marginBottom:"8px" },
  link: { textAlign:"center", marginTop:"1rem", fontSize:"13px", color:"#666" },
};