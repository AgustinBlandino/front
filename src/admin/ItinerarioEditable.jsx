// src/admin/ItinerarioEditable.jsx
import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export default function ItinerarioEditable({ servicios, setServicios }) {
    const actualizarCampo = (idx, campo, valor) => {
        const nuevo = [...servicios]
        nuevo[idx][campo] = campo === 'precio' || campo === 'cantidad' ? parseFloat(valor) || 0 : valor
        setServicios(nuevo)
    }

    const eliminarServicio = (idx) => {
        const nuevo = [...servicios]
        nuevo.splice(idx, 1)
        setServicios(nuevo)
    }

    const agregarServicio = () => {
        const nuevo = [...servicios]
        nuevo.push({
            id: Date.now(),
            dia: 1,
            orden: 1,
            destino: '',
            proveedor: '',
            tipo: '',
            descripcion: '',
            cantidad: 1,
            precio: 0
        })
        setServicios(nuevo)
    }

    const onDragEnd = (result) => {
        if (!result.destination) return
        const nuevo = [...servicios]
        const [moved] = nuevo.splice(result.source.index, 1)
        nuevo.splice(result.destination.index, 0, moved)
        setServicios(nuevo)
    }

    const total = servicios.reduce((acc, s) => acc + (s.precio * (s.cantidad || 1)), 0)

    return (
        <div className="mt-6">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="servicios">
                    {(provided) => (
                        <table
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="w-full text-sm border"
                        >
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2">Día</th>
                                    <th className="border p-2">Orden</th>
                                    <th className="border p-2">Destino</th>
                                    <th className="border p-2">Proveedor</th>
                                    <th className="border p-2">Tipo</th>
                                    <th className="border p-2">Descripción</th>
                                    <th className="border p-2">Cantidad</th>
                                    <th className="border p-2">Precio</th>
                                    <th className="border p-2">Total</th>
                                    <th className="border p-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {servicios.map((s, idx) => (
                                    <Draggable key={s.id.toString()} draggableId={s.id.toString()} index={idx}>
                                        {(provided) => (
                                            <tr ref={provided.innerRef} {...provided.draggableProps}>
                                                <td className="border p-1 text-center" {...provided.dragHandleProps}>
                                                    <input className="w-12 border px-1" type="number" value={s.dia} onChange={e => actualizarCampo(idx, 'dia', e.target.value)} />
                                                </td>
                                                <td className="border p-1 text-center">
                                                    <input className="w-12 border px-1" type="number" value={s.orden} onChange={e => actualizarCampo(idx, 'orden', e.target.value)} />
                                                </td>
                                                <td className="border p-1">
                                                    <input className="w-full border px-1" value={s.destino} onChange={e => actualizarCampo(idx, 'destino', e.target.value)} />
                                                </td>
                                                <td className="border p-1">
                                                    <input className="w-full border px-1" value={s.proveedor} onChange={e => actualizarCampo(idx, 'proveedor', e.target.value)} />
                                                </td>
                                                <td className="border p-1">
                                                    <input className="w-full border px-1" value={s.tipo} onChange={e => actualizarCampo(idx, 'tipo', e.target.value)} />
                                                </td>
                                                <td className="border p-1">
                                                    <input className="w-full border px-1" value={s.descripcion} onChange={e => actualizarCampo(idx, 'descripcion', e.target.value)} />
                                                </td>
                                                <td className="border p-1">
                                                    <input className="w-16 border px-1" type="number" value={s.cantidad} onChange={e => actualizarCampo(idx, 'cantidad', e.target.value)} />
                                                </td>
                                                <td className="border p-1">
                                                    <input className="w-24 border px-1" type="number" value={s.precio} onChange={e => actualizarCampo(idx, 'precio', e.target.value)} />
                                                </td>
                                                <td className="border p-1 text-right pr-2">
                                                    ${(s.precio * (s.cantidad || 1)).toLocaleString()}
                                                </td>
                                                <td className="border p-1 text-center">
                                                    <button onClick={() => eliminarServicio(idx)} className="text-red-600">🗑</button>
                                                </td>
                                            </tr>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </tbody>
                        </table>
                    )}
                </Droppable>
            </DragDropContext>

            <div className="mt-4 text-right">
                <button onClick={agregarServicio} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded mr-2">
                    ➕ Agregar servicio
                </button>
                <span className="text-green-700 font-bold text-lg">
                    💰 Total: ${total.toLocaleString()}
                </span>
            </div>
        </div>
    )
}
