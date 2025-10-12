import React, { useEffect, useMemo, useState } from "react";
import { fetchUsers, updateUser, deleteUser } from "../services/userService";

const UserControl = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", role: "user" });
  const [query, setQuery] = useState("");

  const roles = useMemo(() => [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
    { value: "sales_manager", label: "Sales Manager" },
    { value: "delivery_manager", label: "Delivery Manager" },
    { value: "shipment_manager", label: "Shipment Manager" },
  ], []);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchUsers();
      setUsers(data);
    } catch (e) {
      setError(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (u) => {
    setEditingId(u._id);
    setForm({ firstName: u.firstName, lastName: u.lastName, phone: u.phone, email: u.email, role: u.role });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ firstName: "", lastName: "", phone: "", email: "", role: "user" });
  };

  const submitEdit = async () => {
    try {
      setLoading(true);
      setError("");
      const updated = await updateUser(editingId, form);
      setUsers(prev => prev.map(u => u._id === editingId ? updated : u));
      cancelEdit();
    } catch (e) {
      setError(e?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      setLoading(true);
      setError("");
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (e) {
      setError(e?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const printUser = (u) => {
    const content = `\nUser Details\n-------------\nName: ${u.firstName} ${u.lastName}\nEmail: ${u.email}\nPhone: ${u.phone}\nRole: ${u.role}`;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!doctype html><html><head><title>User Details</title></head><body><pre style="font-family:Arial, sans-serif; white-space:pre-wrap;">${content}</pre></body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  const tableStyle = {
    width: "100%",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    borderCollapse: "separate",
    borderSpacing: 0,
    overflow: "hidden",
  };

  const th = {
    padding: "14px 16px",
    textAlign: "left",
    background: "#f1f5f9",
    color: "#334155",
    fontWeight: 700,
    fontSize: 14,
    borderBottom: "1px solid #e2e8f0",
  };

  const td = {
    padding: "14px 16px",
    textAlign: "left",
    borderBottom: "1px solid #f1f5f9",
    color: "#1f2937",
    fontSize: 14,
    background: "#ffffff",
  };

  const rowAlt = { background: "#fcfdff" };
  const actionsWrap = { display: "flex", gap: 10 };

  const iconBtn = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    cursor: "pointer",
    transition: "all .15s ease",
  };

  const badge = (bg, color) => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    background: bg,
    color: color,
    fontWeight: 600,
    fontSize: 12,
  });

  const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 21h4l11-11a2.828 2.828 0 10-4-4L4 17v4z" stroke="#1d4ed8" strokeWidth="2" fill="#e7f0ff"/>
    </svg>
  );
  const DeleteIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" stroke="#b91c1c" strokeWidth="2"/>
    </svg>
  );
  const PrintIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9V4h12v5M6 14h12v6H6v-6zM6 14H4a2 2 0 01-2-2V9a2 2 0 012-2h16a2 2 0 012 2v3a2 2 0 01-2 2h-2" stroke="#15803d" strokeWidth="2"/>
    </svg>
  );

  const filtered = users.filter(u => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ marginTop: 0, marginBottom: 6 }}>User Control</h1>
          <p style={{ margin: 0, color: "#64748b" }}>Manage registered users with edit, delete and print actions.</p>
        </div>
        <div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, phone, role"
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              minWidth: 280,
              outline: "none",
            }}
          />
        </div>
      </div>

      {error && (
        <div style={{ background: "#ffe8e6", color: "#b00020", padding: 12, borderRadius: 8, marginBottom: 16 }}>{error}</div>
      )}

      <div style={{ overflowX: "auto", marginTop: 12 }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Phone</th>
              <th style={th}>Role</th>
              <th style={{ ...th, textAlign: "right", width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, idx) => (
              <tr key={u._id} style={idx % 2 ? rowAlt : undefined}>
                <td style={td}>{u.firstName} {u.lastName}</td>
                <td style={td}>{u.email}</td>
                <td style={td}>{u.phone}</td>
                <td style={td}>
                  <span style={
                    u.role === 'admin' ? badge('#eef2ff','#3730a3') :
                    u.role?.includes('manager') ? badge('#ecfdf5','#065f46') :
                    badge('#f1f5f9','#334155')
                  }>
                    {u.role}
                  </span>
                </td>
                <td style={{ ...td }}>
                  <div style={{ ...actionsWrap, justifyContent: "flex-end" }}>
                    <button title="Edit" aria-label="Edit user" style={iconBtn} onClick={() => startEdit(u)}>
                      <EditIcon />
                    </button>
                    <button title="Delete" aria-label="Delete user" style={iconBtn} onClick={() => removeUser(u._id)}>
                      <DeleteIcon />
                    </button>
                    <button title="Print" aria-label="Print user" style={iconBtn} onClick={() => printUser(u)}>
                      <PrintIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr>
                <td style={{ ...td, color: "#64748b" }} colSpan={5}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && <p>Loading...</p>}

      {editingId && (
        <div style={{ marginTop: 20, background: "#ffffff", padding: 20, borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Edit User</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input style={{ padding: 10, borderRadius: 10, border: "1px solid #e2e8f0" }} placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <input style={{ padding: 10, borderRadius: 10, border: "1px solid #e2e8f0" }} placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            <input style={{ padding: 10, borderRadius: 10, border: "1px solid #e2e8f0" }} placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input style={{ padding: 10, borderRadius: 10, border: "1px solid #e2e8f0" }} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <select style={{ padding: 10, borderRadius: 10, border: "1px solid #e2e8f0" }} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button style={{ padding: "10px 14px", borderRadius: 10, border: "none", background: "#1d4ed8", color: "#fff", fontWeight: 700, cursor: "pointer" }} onClick={submitEdit}>Save</button>
            <button style={{ padding: "10px 14px", borderRadius: 10, border: "none", background: "#94a3b8", color: "#fff", fontWeight: 700, cursor: "pointer" }} onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserControl;


