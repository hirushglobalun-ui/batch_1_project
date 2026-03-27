import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please check your credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Welcome Back</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginBottom: '2rem' }}>Login to access your dashboard</p>
      
      {error && <div style={{ color: 'var(--error)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid var(--error)', fontSize: '0.875rem' }}>{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-dim)' }}>Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              style={{ paddingLeft: '2.5rem' }}
              placeholder="name@example.com" 
              type="email"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} 
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-dim)' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              style={{ paddingLeft: '2.5rem' }}
              type="password" 
              placeholder="••••••••" 
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} 
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <LogIn size={20} />
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="link-text">
        Don't have an account? <Link to="/register">Register now</Link>
      </div>
    </div>
  );
}

export default Login;
