import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ organizationName:"", name:"", email:"", password:"" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/register", form);
      localStorage.setItem("accessToken", data.tokens.accessToken);
      localStorage.setItem("refreshToken", data.tokens.refreshToken);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h2 style={styles.title}>☑ TaskTracker</h2>
        <h3 style={styles.sub}>Create account</h3>
        <form onSubmit={handleSubmit}>
          {["organizationName","name","email","password"].map(field => (
            <input key={field} style={styles.input}
              placeholder={field === "organizationName" ? "Organization name" : field.charAt(0).toUpperCase()+field.slice(1)}
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              value={form[field]}
              onChange={e => setForm({...form, [field]: e.target.value})}
              required />
          ))}
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.btn} type="submit">Create account</button>
        </form>
        <p style={styles.link}>Have an account? <Link to="/login">Sign in</Link></p>
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