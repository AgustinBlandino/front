import React, { useEffect, useState } from 'react';

export default function ServiciosView() {
  const [servicios, setServicios] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [nuevo, setNuevo] = useState({
    id_Proveedor: '',
    id_Destino: '',
    tipoServicio: '',
    descripcion: '',
    precioUnitario: '',
    modalidad: 'por_persona',
    duracionDias: 1,
    activo: true,
  });

  const cargar = async () => {
    const resServicios = await fetch('https://backend-anda-production.up.railway.app/api/servicios');
    const data = await resServicios.json();
    const serviciosNormalizados = data.map(s => ({
      ...s,
      id_Proveedor: s.iD_Proveedor,
      id_Destino: s.iD_Destino
    }));
    setServicios(serviciosNormalizados);

    const resProveedores = await fetch('https://backend-anda-production.up.railway.app/api/proveedores');
    setProveedores(await resProveedores.json());

    const resDestinos = await fetch('https://backend-anda-production.up.railway.app/api/destinos');
    setDestinos(await resDestinos.json());
  };

  useEffect(() => { cargar(); }, []);

  const guardar = async () => {
    if (!nuevo.tipoServicio || !nuevo.descripcion) return;
    await fetch('https://backend-anda-production.up.railway.app/api/servicios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    });
    setNuevo({
      id_Proveedor: '',
      id_Destino: '',
      tipoServicio: '',
      descripcion: '',
      precioUnitario: '',
      modalidad: 'por_persona',
      duracionDias: 1,
      activo: true
    });
    cargar();
  };

  const borrar = async (id) => {
    await fetch(`https://backend-anda-production.up.railway.app/api/servicios/${id}`, { method: 'DELETE' });
    cargar();
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Servicios</h2>

      <div className="flex flex-col md:grid md:grid-cols-3 gap-3">
        <select
          className="border px-3 py-2 rounded"
          value={nuevo.id_Proveedor}
          onChange={e => setNuevo({ ...nuevo, id_Proveedor: parseInt(e.target.value) })}
        >
          <option value="">Proveedor</option>
          {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>

        <select
          className="border px-3 py-2 rounded"
          value={nuevo.id_Destino}
          onChange={e => setNuevo({ ...nuevo, id_Destino: parseInt(e.target.value) })}
        >
          <option value="">Destino</option>
          {destinos.map(d => <option key={d.id} value={d.id}>{d.descripcion}</option>)}
        </select>

        <input
          placeholder="Tipo de Servicio"
          className="border px-3 py-2 rounded"
          value={nuevo.tipoServicio}
          onChange={e => setNuevo({ ...nuevo, tipoServicio: e.target.value })}
        />
        <input
          placeholder="Descripción"
          className="border px-3 py-2 rounded md:col-span-2"
          value={nuevo.descripcion}
          onChange={e => setNuevo({ ...nuevo, descripcion: e.target.value })}
        />
        <input
          placeholder="Precio Unitario"
          type="number"
          className="border px-3 py-2 rounded"
          value={nuevo.precioUnitario}
          onChange={e => setNuevo({ ...nuevo, precioUnitario: parseFloat(e.target.value) || '' })}
        />
        <select
          className="border px-3 py-2 rounded"
          value={nuevo.modalidad}
          onChange={e => setNuevo({ ...nuevo, modalidad: e.target.value })}
        >
          <option value="por_persona">por_persona</option>
          <option value="por_grupo">por_grupo</option>
        </select>
        <input
          placeholder="Duración (días)"
          type="number"
          className="border px-3 py-2 rounded"
          value={nuevo.duracionDias}
          onChange={e => setNuevo({ ...nuevo, duracionDias: parseInt(e.target.value) || 1 })}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={nuevo.activo}
            onChange={e => setNuevo({ ...nuevo, activo: e.target.checked })}
          />
          Activo
        </label>
        <button
          onClick={guardar}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Agregar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
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
                  <button
                    onClick={() => borrar(s.id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
