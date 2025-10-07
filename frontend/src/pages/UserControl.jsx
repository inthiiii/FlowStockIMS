import React, { useEffect, useMemo, useState } from "react";
import { fetchUsers, updateUser, deleteUser } from "../services/userService";

const UserControl = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", role: "user" });

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
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    borderCollapse: "collapse",
  };

  const thtd = { borderBottom: "1px solid #e9ecef", padding: "12px 14px", textAlign: "left" };
  const actionsWrap = { display: "flex", gap: 8 };
  const btn = { padding: "8px 12px", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 };

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>User Control</h1>
      <p>View, edit, delete and print registered users.</p>

      {error && (
        <div style={{ background: "#ffe8e6", color: "#b00020", padding: 12, borderRadius: 8, marginBottom: 16 }}>{error}</div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thtd}>Name</th>
              <th style={thtd}>Email</th>
              <th style={thtd}>Phone</th>
              <th style={thtd}>Role</th>
              <th style={thtd}></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td style={thtd}>{u.firstName} {u.lastName}</td>
                <td style={thtd}>{u.email}</td>
                <td style={thtd}>{u.phone}</td>
                <td style={thtd}>{u.role}</td>
                <td style={thtd}>
                  <div style={actionsWrap}>
                    <button style={{ ...btn, background: "#e7f3ff", color: "#023E8A" }} onClick={() => startEdit(u)}>Edit</button>
                    <button style={{ ...btn, background: "#fff5f5", color: "#c82333" }} onClick={() => removeUser(u._id)}>Delete</button>
                    <button style={{ ...btn, background: "#eefaf1", color: "#1b7f3a" }} onClick={() => printUser(u)}>Print</button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && !loading && (
              <tr>
                <td style={thtd} colSpan={5}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && <p>Loading...</p>}

      {editingId && (
        <div style={{ marginTop: 20, background: "#fff", padding: 16, borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <h3 style={{ marginTop: 0 }}>Edit User</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <input placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <input placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button style={{ ...btn, background: "#023E8A", color: "#fff" }} onClick={submitEdit}>Save</button>
            <button style={{ ...btn, background: "#adb5bd", color: "#fff" }} onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserControl;


