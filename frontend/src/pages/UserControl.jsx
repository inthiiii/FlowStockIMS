import React, { useEffect, useMemo, useState } from "react";
import { fetchUsers, updateUser, deleteUser } from "../services/userService";

// SVG Icon Components for a cleaner look
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const AdminIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const ManagerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const PrintIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>;

const UserControl = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", role: "user" });
  const [query, setQuery] = useState("");

  const roles = useMemo(() => [
    { value: "user", label: "User" }, { value: "admin", label: "Admin" },
    { value: "sales_manager", label: "Sales Manager" },
    { value: "delivery_manager", label: "Delivery Manager" },
    { value: "shipment_manager", label: "Shipment Manager" },
  ], []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setError("");
        const data = await fetchUsers();
        setUsers(data);
      } catch (e) {
        setError(e?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter(u => u.role === 'admin').length;
    const managers = users.filter(u => u.role?.includes('manager')).length;
    return { total, admins, managers };
  }, [users]);
  
  const startEdit = (user) => { setEditingId(user._id); setForm({ ...user }); };
  const cancelEdit = () => { setEditingId(null); setForm({ firstName: "", lastName: "", phone: "", email: "", role: "user" }); };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      const updatedUser = await updateUser(editingId, form);
      setUsers(prev => prev.map(u => u._id === editingId ? updatedUser : u));
      cancelEdit();
    } catch (e) {
      setError(e?.message || "Failed to update user");
    }
  };

  const removeUser = async (id) => {
    if (!window.confirm("Delete this user? This action cannot be undone.")) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (e) {
      setError(e?.message || "Failed to delete user");
    }
  };

  const printUser = (user) => {
    const content = `...`; // Content is unchanged
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(content);
    win.document.close();
    win.focus();
    win.print();
  };

  const styles = {
    container: { maxWidth: "1600px", margin: "0 auto", padding: "50px 30px", fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%)" },
    header: { textAlign: 'center', marginBottom: "40px", animation: "fadeInDown 0.6s ease-out" },
    title: { color: "#023E8A", fontSize: "3rem", fontWeight: "700", margin: "0 0 12px 0" },
    subtitle: { color: "#64748b", fontSize: "1.15rem", margin: 0 },
    statsContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px", marginBottom: "40px", animation: "fadeInUp 0.7s ease-out" },
    statCard: { background: "#ffffff", padding: "25px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", display: 'flex', alignItems: 'center', gap: '20px' },
    statIcon: { color: '#023E8A', flexShrink: 0 },
    statValue: { fontSize: "2.2rem", color: "#1e293b", fontWeight: "700", lineHeight: "1.1" },
    statLabel: { fontSize: "0.9rem", color: "#64748b", fontWeight: "500" },
    controlsContainer: { display: "flex", justifyContent: "center", marginBottom: "40px", animation: "fadeInUp 0.8s ease-out" },
    searchInput: { padding: "14px 20px", border: "2px solid #e2e8f0", borderRadius: "12px", fontSize: "1rem", minWidth: "400px", outline: "none", transition: "all 0.3s ease", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" },
    tableContainer: { backgroundColor: "#ffffff", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)", overflow: "hidden", border: "1px solid #e2e8f0", animation: "fadeInUp 0.9s ease-out" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { padding: "18px 20px", textAlign: "left", fontWeight: "600", fontSize: "0.85rem", background: "linear-gradient(135deg, #023E8A 0%, #0353b8 100%)", color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.5px" },
    td: { padding: "18px 20px", color: "#334155", borderBottom: "1px solid #f1f5f9" },
    actionsWrap: { display: "flex", justifyContent: "flex-end", gap: 10 },
    iconButton: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: "10px", border: "1px solid #e2e8f0", background: "#ffffff", cursor: "pointer", transition: "all .2s ease", color: '#475569' },
    badgeBase: { display: "inline-block", padding: "6px 14px", borderRadius: "20px", fontWeight: "600", fontSize: "0.8rem", textTransform: "capitalize" },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10, 25, 47, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' },
    modalContent: { background: 'white', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '600px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
    formInput: { padding: "12px 16px", border: "2px solid #e2e8f0", borderRadius: "10px", fontSize: "1rem", outline: "none", width: "100%", boxSizing: "border-box" },
    formActions: { display: "flex", justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 20, borderTop: '1px solid #e2e8f0' },
    formButton: { padding: "12px 24px", borderRadius: "10px", border: "none", fontWeight: "600", cursor: "pointer" },
    errorBox: { background: "#fee2e2", color: "#991b1b", padding: 14, borderRadius: 10, marginBottom: 20, border: '1px solid #fecaca' },
    loadingContainer: { textAlign: "center", padding: "100px 20px" },
    noUsersContainer: { textAlign: 'center', padding: '60px 20px' },
    noUsersText: { fontSize: '1.2rem', color: '#475569', fontWeight: 500, marginTop: '15px' },
  };
  
  const styleSheet = `
    @keyframes fadeInDown { 
      from { opacity: 0; transform: translateY(-20px); } 
      to { opacity: 1; transform: translateY(0); } 
    }
    @keyframes fadeInUp { 
      from { opacity: 0; transform: translateY(20px); } 
      to { opacity: 1; transform: translateY(0); } 
    }
    input:focus, select:focus { 
      border-color: #023E8A !important; 
      box-shadow: 0 0 0 3px rgba(2, 62, 138, 0.1) !important; 
    }
    tr:hover td { 
      background-color: #f8fafc; 
    }
    .icon-btn:hover { 
      background-color: #f1f5f9; 
      transform: translateY(-2px); 
      box-shadow: 0 4px 8px rgba(0,0,0,0.05); 
    }
    .form-btn:hover { 
      transform: translateY(-2px); 
      box-shadow: 0 6px 12px rgba(0,0,0,0.2); 
    }
  `;

  const filteredUsers = users.filter(u => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    return (
      fullName.includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.toLowerCase().includes(q) || u.role?.toLowerCase().replace('_', ' ').includes(q)
    );
  });
  
  if (loading) { return <div style={styles.loadingContainer}>Loading users...</div>; }

  return (
    <div style={styles.container}>
      <style>{styleSheet}</style>
      
      <div style={styles.header}>
        <h1 style={styles.title}>User Management Dashboard</h1>
        <p style={styles.subtitle}>Oversee, manage, and analyze all user accounts within the system.</p>
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.statCard}><div style={styles.statIcon}><UserIcon/></div><div><div style={styles.statValue}>{stats.total}</div><div style={styles.statLabel}>Total Users</div></div></div>
        <div style={styles.statCard}><div style={styles.statIcon}><AdminIcon/></div><div><div style={styles.statValue}>{stats.admins}</div><div style={styles.statLabel}>Administrators</div></div></div>
        <div style={styles.statCard}><div style={styles.statIcon}><ManagerIcon/></div><div><div style={styles.statValue}>{stats.managers}</div><div style={styles.statLabel}>Managers</div></div></div>
      </div>
      
      <div style={styles.controlsContainer}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, email, phone, or role..." style={styles.searchInput}/>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th><th style={styles.th}>Contact</th><th style={styles.th}>Role</th><th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
              <tr key={user._id}>
                <td style={styles.td}>{user.firstName} {user.lastName}</td>
                <td style={styles.td}>{user.email}<br/><span style={{color: '#64748b', fontSize: '0.9em'}}>{user.phone}</span></td>
                <td style={styles.td}><span style={{...styles.badgeBase, ...(user.role === 'admin' ? {background: '#e0f2fe', color: '#0369a1'} : user.role?.includes('manager') ? {background: '#dcfce7', color: '#166534'} : {background: '#f1f5f9', color: '#475569'})}}>{user.role.replace('_', ' ')}</span></td>
                <td style={styles.td}>
                  <div style={styles.actionsWrap}>
                    <button className="icon-btn" title="Edit" style={styles.iconButton} onClick={() => startEdit(user)}><EditIcon /></button>
                    <button className="icon-btn" title="Delete" style={{...styles.iconButton, color: '#b91c1c'}} onClick={() => removeUser(user._id)}><DeleteIcon /></button>
                    <button className="icon-btn" title="Print" style={{...styles.iconButton, color: '#15803d'}} onClick={() => printUser(user)}><PrintIcon /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" style={{padding: '60px 0'}}>
                <div style={styles.noUsersContainer}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  <p style={styles.noUsersText}>{query ? `No users found for "${query}"` : "No users in the system."}</p>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editingId && (
        <div style={styles.modalOverlay} onClick={cancelEdit}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, marginBottom: 24, color: '#023E8A', fontSize: '1.5rem' }}>Editing: {form.firstName} {form.lastName}</h3>
            <form onSubmit={submitEdit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <input style={styles.formInput} placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                <input style={styles.formInput} placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                <input style={styles.formInput} placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input style={styles.formInput} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <select style={{...styles.formInput, gridColumn: '1 / -1'}} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div style={styles.formActions}>
                <button type="button" style={{...styles.formButton, background: '#f1f5f9', color: '#475569'}} onClick={cancelEdit}>Cancel</button>
                <button type="submit" style={{...styles.formButton, background: 'linear-gradient(135deg, #023E8A 0%, #0353b8 100%)', color: '#fff'}}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserControl;