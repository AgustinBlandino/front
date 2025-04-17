import React, { useEffect, useState } from 'react'

export default function ServiciosView() {
  const [servicios, setServicios] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [destinos, setDestinos] = useState([])
  const [nuevo, setNuevo] = useState({
    id_Proveedor: '', id_Destino: '', tipoServicio: '', descripcion: '',
    precioUnitario: '', modalidad: 'por_persona', duracionDias: 1, activo: true
  })

  const cargar = async () => {
    const resServicios = await fetch('backend-anda.railway.internal/api/servicios')
    const data = await resServicios.json()
    const serviciosNormalizados = data.map(s => ({
      ...s,
      id_Proveedor: s.iD_Proveedor,
      id_Destino: s.iD_Destino
    }))
    setServicios(serviciosNormalizados)


    const resProveedores = await fetch('backend-anda.railway.internal/api/proveedores')
    setProveedores(await resProveedores.json())

    const resDestinos = await fetch('backend-anda.railway.internal/api/destinos')


    setDestinos(await resDestinos.json())
  }

  useEffect(() => { cargar() }, [])

  const guardar = async () => {
    if (!nuevo.tipoServicio || !nuevo.descripcion) return
    await fetch('backend-anda.railway.internal/api/servicios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    })
    setNuevo({
      id_Proveedor: '', id_Destino: '', tipoServicio: '', descripcion: '',
      precioUnitario: '', modalidad: 'por_persona', duracionDias: 1, activo: true
    })
    cargar()
  }

  const borrar = async (id) => {
    await fetch(`backend-anda.railway.internal/api/servicios/${id}`, { method: 'DELETE' })
    cargar()
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🧾 Servicios</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        <select className="border px-2 py-1" value={nuevo.id_Proveedor}
          onChange={e => setNuevo({ ...nuevo, id_Proveedor: parseInt(e.target.value) })}>
          <option value="">Proveedor</option>
          {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>

        <select className="border px-2 py-1" value={nuevo.idDestino}
          onChange={e => setNuevo({ ...nuevo, id: parseInt(e.target.value) })}>
          <option value="">Destino</option>
          {destinos.map(d => <option key={d.id} value={d.id}>{d.descripcion}</option>)}
        </select>
        {/* <select value={s.idDestino} onChange={e => actualizar(i, 'idDestino', e.target.value)} className="border w-full">
          <option value="">--</option>
          {destinos.map(d => <option key={d.id} value={d.id}>{d.descripcion}</option>)}
        </select> */}

        <input placeholder="Tipo de Servicio" className="border px-2 py-1" value={nuevo.tipoServicio}
          onChange={e => setNuevo({ ...nuevo, tipoServicio: e.target.value })} />
        <input placeholder="Descripción" className="border px-2 py-1 col-span-2" value={nuevo.descripcion}
          onChange={e => setNuevo({ ...nuevo, descripcion: e.target.value })} />
        <input placeholder="Precio Unitario" type="number" className="border px-2 py-1" value={nuevo.precioUnitario}
          onChange={e => setNuevo({ ...nuevo, precioUnitario: parseFloat(e.target.value) || '' })} />
        <select className="border px-2 py-1" value={nuevo.modalidad}
          onChange={e => setNuevo({ ...nuevo, modalidad: e.target.value })}>
          <option value="por_persona">por_persona</option>
          <option value="por_grupo">por_grupo</option>
        </select>
        <input placeholder="Duración (días)" type="number" className="border px-2 py-1" value={nuevo.duracionDias}
          onChange={e => setNuevo({ ...nuevo, duracionDias: parseInt(e.target.value) || 1 })} />
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={nuevo.activo}
            onChange={e => setNuevo({ ...nuevo, activo: e.target.checked })} />
          Activo
        </label>
        <button className="bg-green-600 text-white px-4 py-1 rounded col-span-1" onClick={guardar}>➕ Agregar</button>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Proveedor</th>
            <th className="border p-2">Destino</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Precio</th>
            <th className="border p-2">Modalidad</th>
            <th className="border p-2">Duración</th>
            <th className="border p-2">Activo</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map(s => (
            <tr key={s.id}>
              <td className="border p-2">{s.id}</td>
              <td className="border p-2">{proveedores.find(p => p.id === s.id_Proveedor)?.nombre || s.id_Proveedor}</td>
              <td className="border p-2">{destinos.find(d => d.id === s.id_Destino)?.descripcion || s.id_Destino}</td>
              <td className="border p-2">{s.tipoServicio}</td>
              <td className="border p-2">{s.descripcion}</td>
              <td className="border p-2">${s.precioUnitario}</td>
              <td className="border p-2">{s.modalidad}</td>
              <td className="border p-2">{s.duracionDias}</td>
              <td className="border p-2">{s.activo ? '✅' : '❌'}</td>
              <td className="border p-2">
                <button onClick={() => borrar(s.id)} className="text-red-600">🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}