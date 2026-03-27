import { useEffect, useState } from "react";
import api from "../api";
import { LogOut, Plus, Trash2, LayoutDashboard, User, GraduationCap, Users, Edit3, XCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    studentClass: "Plus One"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/items"); 
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    fetchStudents();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.age) return;
    
    try {
      if (isEditing) {
        await api.put(`/items/${editId}`, form);
        setIsEditing(false);
        setEditId(null);
      } else {
        await api.post("/items", form);
      }
      setForm({ name: "", age: "", gender: "Male", studentClass: "Plus One" });
      fetchStudents();
    } catch (err) {
      console.error("Failed to save student", err);
    }
  };

  const startEdit = (student) => {
    setIsEditing(true);
    setEditId(student._id);
    setForm({
      name: student.name,
      age: student.age,
      gender: student.gender,
      studentClass: student.studentClass
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setForm({ name: "", age: "", gender: "Male", studentClass: "Plus One" });
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await api.delete(`/items/${id}`);
      fetchStudents();
    } catch (err) {
      console.error("Failed to delete student", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard" style={{ width: '100%', maxWidth: '1000px' }}>
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'var(--primary)', padding: '0.75rem', borderRadius: '1rem', color: 'white' }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Student Management</h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Dashboard Overview</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-dim)', marginRight: '0.5rem' }}>{user.name}</span>
            <button onClick={logout} className="delete-btn" style={{ fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <LogOut size={16} />
            Logout
            </button>
        </div>
      </div>

      <div style={{ 
          marginBottom: '2rem', 
          background: isEditing ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255,255,255,0.03)', 
          padding: '1.5rem', 
          borderRadius: '1rem', 
          border: '1px solid',
          borderColor: isEditing ? 'var(--primary)' : 'var(--card-border)',
          transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isEditing ? <Edit3 size={18} /> : <Plus size={18} />}
                {isEditing ? `Editing Student: ${form.name}` : "Add New Student"}
            </h3>
            {isEditing && (
                <button onClick={cancelEdit} style={{ width: 'auto', padding: '0.4rem 0.8rem', background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)' }}>
                    Cancel Edit
                </button>
            )}
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <input 
              placeholder="Full Name" 
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})} 
              required
            />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <input 
              type="number"
              placeholder="Age" 
              value={form.age}
              onChange={(e) => setForm({...form, age: e.target.value})} 
              required
            />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <select 
              value={form.gender}
              onChange={(e) => setForm({...form, gender: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--card-border)', borderRadius: '0.75rem', color: 'white' }}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <select 
              value={form.studentClass}
              onChange={(e) => setForm({...form, studentClass: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--card-border)', borderRadius: '0.75rem', color: 'white' }}
            >
              <option value="Plus One">Plus One</option>
              <option value="Plus Two">Plus Two</option>
            </select>
          </div>
          <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', gridColumn: 'span 1', background: isEditing ? 'var(--success)' : 'var(--primary)' }}>
            {isEditing ? <CheckCircle size={20} /> : <Plus size={20} />}
            {isEditing ? "Update Details" : "Add Student"}
          </button>
        </form>
      </div>

      <div className="items-list">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'var(--text-main)' }}>Records Registry</h3>
        {loading ? (
             <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>Loading records...</p>
        ) : students.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--card-border)', borderRadius: '1rem', color: 'var(--text-dim)' }}>
            No student records found. Add your first student to see them here.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--card-border)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-dim)' }}>ID</th>
                  <th style={{ padding: '1rem', color: 'var(--text-dim)' }}>Name</th>
                  <th style={{ padding: '1rem', color: 'var(--text-dim)' }}>Age</th>
                  <th style={{ padding: '1rem', color: 'var(--text-dim)' }}>Gender</th>
                  <th style={{ padding: '1rem', color: 'var(--text-dim)' }}>Class</th>
                  <th style={{ padding: '1rem', color: 'var(--text-dim)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: editId === student._id ? 'rgba(99, 102, 241, 0.05)' : 'transparent' }}>
                    <td style={{ padding: '1rem' }}><span style={{ color: 'var(--primary)', fontWeight: '600' }}>{student.studentId}</span></td>
                    <td style={{ padding: '1rem' }}>{student.name}</td>
                    <td style={{ padding: '1rem' }}>{student.age}</td>
                    <td style={{ padding: '1rem' }}>{student.gender}</td>
                    <td style={{ padding: '1rem' }}>
                        <span style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem' }}>
                            {student.studentClass}
                        </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                            onClick={() => startEdit(student)} 
                            style={{ width: 'auto', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '0.4rem', borderRadius: '0.4rem' }}
                            title="Edit Student"
                        >
                            <Edit3 size={16} />
                        </button>
                        <button 
                            onClick={() => deleteStudent(student._id)} 
                            className="delete-btn" 
                            style={{ padding: '0.4rem', borderRadius: '0.4rem' }}
                            title="Delete Student"
                        >
                            <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem' }}>
        © 2026 Admin Student Management Suite • Full Stack CRUD System
      </div>
    </div>
  );
}

export default Home;
