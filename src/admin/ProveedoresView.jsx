import React, { useEffect, useState } from 'react'

export default function ProveedoresView() {
  const [proveedores, setProveedores] = useState([])
  const [nuevo, setNuevo] = useState({
    nombre: '', notas: '', moneda: 'ARS', activo: true
  })

  const cargar = async () => {
    const res = await fetch('https://backend-anda.railway.internal/api/proveedores')
    const data = await res.json()
    setProveedores(data)
  }

  useEffect(() => { cargar() }, [])

  const guardar = async () => {
    if (!nuevo.nombre) return
    await fetch('https://backend-anda.railway.internal/api/proveedores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    })
    setNuevo({ nombre: '', notas: '', moneda: 'ARS', activo: true })
    cargar()
  }

  const borrar = async (id) => {
    await fetch(`https://backend-anda.railway.internal/api/proveedores/${id}`, { method: 'DELETE' })
    cargar()
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📦 Proveedores</h2>

      <div className="mb-4 flex flex-col md:flex-row gap-2">
        <input placeholder="Nombre" className="border px-2 py-1" value={nuevo.nombre}
          onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} />
        <input placeholder="Notas" className="border px-2 py-1" value={nuevo.notas}
          onChange={e => setNuevo({ ...nuevo, notas: e.target.value })} />
        <select className="border px-2 py-1" value={nuevo.moneda}
          onChange={e => setNuevo({ ...nuevo, moneda: e.target.value })}>
          <option value="ARS">ARS</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={nuevo.activo}
            onChange={e => setNuevo({ ...nuevo, activo: e.target.checked })} />
          Activo
        </label>
        <button className="bg-green-600 text-white px-4 py-1 rounded" onClick={guardar}>➕ Agregar</button>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Notas</th>
            <th className="border p-2">Moneda</th>
            <th className="border p-2">Activo</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map(p => (
            <tr key={p.id}>
              <td className="border p-2">{p.id}</td>
              <td className="border p-2">{p.nombre}</td>
              <td className="border p-2">{p.notas}</td>
              <td className="border p-2">{p.moneda}</td>
              <td className="border p-2">{p.activo ? '✅' : '❌'}</td>
              <td className="border p-2">
                <button onClick={() => borrar(p.id)} className="text-red-600">🗑 Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}