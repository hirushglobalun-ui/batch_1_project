import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, User, Mail, Lock } from "lucide-react";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/register", form);
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Create Account</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginBottom: '2rem' }}>Sign up to start your journey</p>
      
      {error && <div style={{ color: 'var(--error)', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid var(--error)', fontSize: '0.875rem' }}>{error}</div>}

      <form onSubmit={handleRegister}>
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-dim)' }}>Full Name</label>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              style={{ paddingLeft: '2.5rem' }}
              placeholder="John Doe" 
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})} 
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-dim)' }}>Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input 
              style={{ paddingLeft: '2.5rem' }}
              type="email"
              placeholder="name@example.com" 
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
          <UserPlus size={20} />
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="link-text">
        Already have an account? <Link to="/">Log in here</Link>
      </div>
    </div>
  );
}

export default Register;
