const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/auth/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function updateUser(id, data) {
  const res = await fetch(`${API_BASE}/auth/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${API_BASE}/auth/users/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
}


