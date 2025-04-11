const API_URL = "http://localhost:5000/api";

export async function fetchProveedores() {
  const res = await fetch(`${API_URL}/proveedores`);
  return res.json();
}

export async function createProveedor(data) {
  const res = await fetch(`${API_URL}/proveedores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateProveedor(id, data) {
  const res = await fetch(`${API_URL}/proveedores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteProveedor(id) {
  return fetch(`${API_URL}/proveedores/${id}`, {
    method: "DELETE"
  });
}