import React, { useState } from 'react'

export default function CotizacionTablaSimplificada({ servicios, setServicios }) {
    const actualizarCampo = (idx, campo, valor) => {
        const nuevos = [...servicios]
        nuevos[idx][campo] = campo === 'precio' || campo === 'cantidad' ? parseFloat(valor) || 0 : valor
        setServicios(nuevos)
    }

    const eliminar = (idx) => {
        const nuevos = [...servicios]
        nuevos.splice(idx, 1)
        setServicios(nuevos)
    }

    const clonar = (idx) => {
        const nuevo = { ...servicios[idx], id: Date.now() }
        setServicios([...servicios, nuevo])
    }

    const total = servicios.reduce((sum, s) => sum + s.precio * (s.cantidad || 1), 0)

    return (
        <div className="p-4 border rounded shadow bg-white mt-4">
            <h3 className="font-semibold text-lg mb-2">📋 Cotización simplificada</h3>
            <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">Día</th>
                        <th className="border p-2">Orden</th>
                        <th className="border p-2">Descripción</th>
                        <th className="border p-2">Cantidad</th>
                        <th className="border p-2">Precio</th>
                        <th className="border p-2">Subtotal</th>
                        <th className="border p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {servicios.map((s, idx) => (
                        <tr key={s.id}>
                            <td className="border p-1">
                                <input type="number" value={s.dia} onChange={e => actualizarCampo(idx, 'dia', e.target.value)} className="w-16 border px-1" />
                            </td>
                            <td className="border p-1">
                                <input type="number" value={s.orden} onChange={e => actualizarCampo(idx, 'orden', e.target.value)} className="w-16 border px-1" />
                            </td>
                            <td className="border p-1">
                                <input value={s.descripcion} onChange={e => actualizarCampo(idx, 'descripcion', e.target.value)} className="w-full border px-1" />
                            </td>
                            <td className="border p-1">
                                <input type="number" value={s.cantidad} onChange={e => actualizarCampo(idx, 'cantidad', e.target.value)} className="w-16 border px-1" />
                            </td>
                            <td className="border p-1">
                                <input type="number" value={s.precio} onChange={e => actualizarCampo(idx, 'precio', e.target.value)} className="w-24 border px-1" />
                            </td>
                            <td className="border p-1 text-right pr-2">
                                ${(s.precio * (s.cantidad || 1)).toLocaleString()}
                            </td>
                            <td className="border p-1 text-center">
                                <button onClick={() => clonar(idx)} className="text-blue-600 mr-2">🌀</button>
                                <button onClick={() => eliminar(idx)} className="text-red-600">🗑</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-right font-bold text-green-700 mt-2">
                💰 Total: ${total.toLocaleString()}
            </div>
        </div>
    )
}
