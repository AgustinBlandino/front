import React, { useEffect, useState } from 'react'

export default function CotizadorView() {
    const [mensaje, setMensaje] = useState('')
    const [itinerario, setItinerario] = useState([])
    const [manual, setManual] = useState([])
    const [destinos, setDestinos] = useState([])
    const [proveedores, setProveedores] = useState([])
    const [servicios, setServicios] = useState([])
    const [error, setError] = useState(null)
    const [cargando, setCargando] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const d = await fetch('http://localhost:5000/api/destinos').then(r => r.json())
            const p = await fetch('http://localhost:5000/api/proveedores').then(r => r.json())
            const s = await fetch('http://localhost:5000/api/servicios').then(r => r.json())

            // 🔧 Convertimos a minúscula estandarizada
            setDestinos(d.map(dest => ({ ...dest, id: dest.id, descripcion: dest.descripcion })))
            setProveedores(p.map(prov => ({
                ...prov,
                id: prov.id,
                nombre: prov.nombre,
                idDestino: prov.iD_Destino
            })))
            setServicios(s.map(serv => ({
                ...serv,
                id: serv.id,
                descripcion: serv.descripcion,
                idProveedor: serv.iD_Proveedor
            })))
        }

        fetchData()
    }, [])


    const cotizar = async () => {
        setCargando(true)
        setError(null)
        try {
            const res = await fetch('http://localhost:5000/api/ia/cotizar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mensaje })
            })
            if (!res.ok) throw new Error(await res.text())
            const data = await res.json()
            const parseado = typeof data === 'string' ? JSON.parse(data) : data
            const plano = parseado.itinerario.flatMap(d => d.servicios.map((s, i) => ({
                ...s,
                dia: d.dia,
                orden: i + 1,
                cantidad: s.cantidad || 1
            })))
            setItinerario(plano)
        } catch (err) {
            setError('Error procesando la cotización.')
            console.error(err)
        } finally {
            setCargando(false)
        }
    }

    const agregarManual = () => {
        setManual([...manual, {
            id: Date.now(),
            dia: 1,
            orden: manual.length + 1,
            idDestino: '',
            idProveedor: '',
            idServicio: '',
            cantidad: 1,
            precio: 0,
        }])
    }

    const actualizarManual = (idx, campo, valor) => {
        const nuevo = [...manual]
        if (campo === 'idDestino') {
            nuevo[idx].idDestino = parseInt(valor)
            nuevo[idx].idProveedor = ''
            nuevo[idx].idServicio = ''
        } else if (campo === 'idProveedor') {
            nuevo[idx].idProveedor = parseInt(valor)
            nuevo[idx].idServicio = ''
        } else if (campo === 'idServicio') {
            nuevo[idx].idServicio = parseInt(valor)
            const serv = servicios.find(s => s.id === parseInt(valor))
            if (serv) nuevo[idx].precio = serv.precioUnitario
        } else {
            nuevo[idx][campo] = campo === 'precio' || campo === 'cantidad' || campo === 'orden' || campo === 'dia'
                ? parseFloat(valor) || 0
                : valor
        }
        setManual(nuevo)
    }

    const eliminarManual = (idx) => {
        const nuevo = manual.filter((_, i) => i !== idx)
        setManual(nuevo.map((s, i) => ({ ...s, orden: i + 1 })))
    }

    const clonarManual = (idx) => {
        const nuevo = [...manual]
        const clon = { ...nuevo[idx], id: Date.now(), orden: nuevo.length + 1 }
        nuevo.splice(idx + 1, 0, clon)
        setManual(nuevo)
    }

    const totalManual = manual.reduce((sum, s) => sum + s.precio * s.cantidad, 0)

    return (
        <div className="p-6 space-y-8">
            <section>
                <h2 className="text-xl font-bold mb-2">💡 Cotización con IA</h2>
                <textarea
                    className="border p-2 rounded w-full max-w-xl"
                    rows={3}
                    placeholder="Ej: Luna de miel en Bariloche, 5 días, $200.000"
                    value={mensaje}
                    onChange={e => setMensaje(e.target.value)}
                />
                <button
                    onClick={cotizar}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {cargando ? '⏳ Generando...' : '🎯 Cotizar'}
                </button>
                {error && <p className="text-red-600 mt-2">{error}</p>}

                {itinerario.length > 0 && (
                    <table className="mt-4 w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Día</th>
                                <th className="border p-2">Orden</th>
                                <th className="border p-2">Tipo</th>
                                <th className="border p-2">Descripción</th>
                                <th className="border p-2">Cantidad</th>
                                <th className="border p-2">Precio</th>
                                <th className="border p-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itinerario.map((s, i) => (
                                <tr key={i}>
                                    <td className="border p-1 text-center">{s.dia}</td>
                                    <td className="border p-1 text-center">{s.orden}</td>
                                    <td className="border p-1">{s.tipo}</td>
                                    <td className="border p-1">{s.descripcion}</td>
                                    <td className="border p-1 text-center">{s.cantidad}</td>
                                    <td className="border p-1 text-right">${s.precio}</td>
                                    <td className="border p-1 text-right">${(s.precio * s.cantidad).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            <section>
                <h2 className="text-xl font-bold mb-2">✍️ Carga manual</h2>
                <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Día</th>
                            <th className="border p-2">Orden</th>
                            <th className="border p-2">Destino</th>
                            <th className="border p-2">Proveedor</th>
                            <th className="border p-2">Servicio</th>
                            <th className="border p-2">Precio</th>
                            <th className="border p-2">Personas</th>
                            <th className="border p-2">Total</th>
                            <th className="border p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {manual.map((s, i) => (
                            <tr key={s.id}>
                                <td className="border p-1"><input type="number" value={s.dia} onChange={e => actualizarManual(i, 'dia', e.target.value)} className="w-14 border" /></td>
                                <td className="border p-1"><input type="number" value={s.orden} onChange={e => actualizarManual(i, 'orden', e.target.value)} className="w-14 border" /></td>
                                <td className="border p-1">
                                    <select value={s.idDestino} onChange={e => actualizarManual(i, 'idDestino', e.target.value)} className="border w-full">
                                        <option value="">--</option>
                                        {destinos.map(d => <option key={d.id} value={d.id}>{d.descripcion}</option>)}
                                    </select>

                                </td>
                                <td className="border p-1">
                                    <select value={s.idProveedor} onChange={e => actualizarManual(i, 'idProveedor', e.target.value)} className="border w-full">
                                        <option value="">--</option>
                                        {proveedores
                                            .filter(p => parseInt(p.idDestino) === parseInt(s.idDestino))
                                            .map(p => (
                                                <option key={p.id} value={p.id}>{p.nombre}</option>
                                            ))}
                                    </select>

                                </td>
                                <td className="border p-1">
                                    <select value={s.idServicio} onChange={e => actualizarManual(i, 'idServicio', e.target.value)} className="border w-full">
                                        <option value="">--</option>
                                        {servicios
                                            .filter(sv => parseInt(sv.idProveedor) === parseInt(s.idProveedor))
                                            .map(sv => (
                                                <option key={sv.id} value={sv.id}>{sv.descripcion}</option>
                                            ))}
                                    </select>


                                </td>
                                <td className="border p-1"><input type="number" value={s.precio} onChange={e => actualizarManual(i, 'precio', e.target.value)} className="w-20 border text-right" /></td>
                                <td className="border p-1"><input type="number" value={s.cantidad} onChange={e => actualizarManual(i, 'cantidad', e.target.value)} className="w-16 border text-right" /></td>
                                <td className="border p-1 text-right">${(s.precio * s.cantidad).toLocaleString()}</td>
                                <td className="border p-1">
                                    <button onClick={() => clonarManual(i)} className="text-blue-600 mr-2">🌀</button>
                                    <button onClick={() => eliminarManual(i)} className="text-red-600">🗑</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="9" className="text-center py-2">
                                <button onClick={agregarManual} className="text-2xl text-green-600 hover:text-green-800">
                                    ➕
                                </button>
                            </td>
                        </tr>
                    </tfoot>

                </table>

                <div className="text-right mt-2 font-bold text-green-700">
                    💰 Total: ${totalManual.toLocaleString()}
                </div>
            </section>
        </div>
    )
}
