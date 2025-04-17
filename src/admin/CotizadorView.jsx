import React, { useEffect, useState } from 'react';
import ClientModal from './ClientModal';

export default function CotizadorView() {
    const [mensaje, setMensaje] = useState('');
    const [servicios, setServicios] = useState([]);
    const [destinos, setDestinos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [catalogoServicios, setCatalogoServicios] = useState([]);

    const [clientes, setClientes] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);

    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const d = await fetch('https://backend-anda-production.up.railway.app/api/destinos').then(r => r.json());
            const p = await fetch('https://backend-anda-production.up.railway.app/api/proveedores').then(r => r.json());
            const s = await fetch('https://backend-anda-production.up.railway.app/api/servicios').then(r => r.json());
            const c = await fetch('https://backend-anda-production.up.railway.app/api/clientes').then(r => r.json());

            setDestinos(d);
            setProveedores(p);
            setCatalogoServicios(s);
            setClientes(c);
        };

        fetchData();
    }, []);

    const cotizar = async () => {
        if (!clienteSeleccionado) {
            alert('Debes seleccionar un cliente antes de cotizar.');
            return;
        }

        setCargando(true);
        setError(null);

        try {
            const res = await fetch('https://backend-anda-production.up.railway.app/api/ia/cotizar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mensaje })
            });

            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            const parseado = typeof data === 'string' ? JSON.parse(data) : data;

            const plano = parseado.itinerario.flatMap(d =>
                d.servicios.map((s, i) => ({
                    id: `${s.id}-${Date.now()}-${i}`,
                    dia: d.dia,
                    orden: i + 1,
                    descripcion: s.descripcion,
                    tipo: s.tipo,
                    cantidad: s.cantidad || 1,
                    precio: s.precio || 0,
                    idDestino: s.idDestino || '',
                    idProveedor: s.idProveedor || '',
                    idServicio: s.idServicio || ''
                }))
            );

            setServicios(plano);
        } catch (err) {
            setError('Error llamando al servicio de IA.');
            console.error(err);
        } finally {
            setCargando(false);
        }
    };

    const agregarFila = () => {
        setServicios([
            ...servicios,
            {
                id: Date.now(),
                dia: 1,
                orden: servicios.length + 1,
                idDestino: '',
                idProveedor: '',
                idServicio: '',
                cantidad: 1,
                precio: 0
            }
        ]);
    };

    const actualizar = (idx, campo, valor) => {
        const nuevo = [...servicios];
        if (campo === 'idDestino') {
            nuevo[idx].idDestino = parseInt(valor);
            nuevo[idx].idProveedor = '';
            nuevo[idx].idServicio = '';
        } else if (campo === 'idProveedor') {
            nuevo[idx].idProveedor = parseInt(valor);
            nuevo[idx].idServicio = '';
        } else if (campo === 'idServicio') {
            nuevo[idx].idServicio = parseInt(valor);
            const serv = catalogoServicios.find(s => s.id === parseInt(valor));
            if (serv) nuevo[idx].precio = serv.precioUnitario;
        } else {
            nuevo[idx][campo] =
                campo === 'precio' || campo === 'cantidad' || campo === 'orden' || campo === 'dia'
                    ? parseFloat(valor) || 0
                    : valor;
        }

        setServicios(nuevo);
    };

    const eliminar = idx => {
        const nuevo = servicios.filter((_, i) => i !== idx);
        setServicios(nuevo.map((s, i) => ({ ...s, orden: i + 1 })));
    };

    const clonar = idx => {
        const nuevo = [...servicios];
        const clon = { ...nuevo[idx], id: Date.now(), orden: nuevo.length + 1 };
        nuevo.splice(idx + 1, 0, clon);
        setServicios(nuevo);
    };

    const guardarCliente = async nuevo => {
        const res = await fetch('https://backend-anda-production.up.railway.app/api/clientes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevo)
        });

        const creado = await res.json();
        setClientes([...clientes, creado]);
        setClienteSeleccionado(creado.id);
    };

    const total = servicios.reduce((sum, s) => sum + s.precio * s.cantidad, 0);
    const guardarCotizacion = async () => {
        if (!clienteSeleccionado) {
            alert("Seleccioná un cliente antes de guardar.");
            return;
        }

        const payload = {
            id_Cliente: clienteSeleccionado,
            total: servicios.reduce((sum, s) => sum + s.precio * s.cantidad, 0),
            detalles: servicios.map(s => ({
                id_Servicio: s.idServicio,
                cantidad: s.cantidad,
                precioUnitario: s.precio,
                dia: s.dia,
                orden: s.orden
            }))
        };

        const res = await fetch('https://backend-anda-production.up.railway.app/api/ia/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("✅ Cotización guardada con éxito.");
        } else {
            alert("❌ Hubo un error al guardar.");
        }
    };


    return (
        <div className="p-6 space-y-8">
            <section>
                <div className="flex items-center space-x-4 mb-4">
                    <label className="font-bold">Cliente:</label>
                    <select
                        className="border p-2 rounded"
                        value={clienteSeleccionado}
                        onChange={e => setClienteSeleccionado(e.target.value)}
                    >
                        <option value="">-- Seleccionar cliente --</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.nombre} {c.apellido} ({c.dni})
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => setMostrarModal(true)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                        ➕ Agregar
                    </button>
                </div>

                <h2 className="text-xl font-bold mb-2">💡 Cotización</h2>
                <textarea
                    className="border p-2 rounded w-full max-w-xl"
                    rows={3}
                    placeholder="Ej: Luna de miel en Bariloche, 5 días, $200.000"
                    value={mensaje}
                    onChange={e => setMensaje(e.target.value)}
                />

                {error && <p className="text-red-600 mt-2">{error}</p>}
            </section>
            <button
                onClick={cotizar}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
                {cargando ? '⏳ Generando...' : '🎯 Cotizar'}
            </button>
            <section>
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
                        {servicios.map((s, i) => (
                            <tr key={s.id}>
                                <td className="border p-1"><input type="number" value={s.dia} onChange={e => actualizar(i, 'dia', e.target.value)} className="w-14 border" /></td>
                                <td className="border p-1"><input type="number" value={s.orden} onChange={e => actualizar(i, 'orden', e.target.value)} className="w-14 border" /></td>
                                <td className="border p-1">
                                    <select value={s.idDestino} onChange={e => actualizar(i, 'idDestino', e.target.value)} className="border w-full">
                                        <option value="">--</option>
                                        {destinos.map(d => <option key={d.id} value={d.id}>{d.descripcion}</option>)}
                                    </select>
                                </td>
                                <td className="border p-1">
                                    <select value={s.idProveedor} onChange={e => actualizar(i, 'idProveedor', e.target.value)} className="border w-full">
                                        <option value="">--</option>
                                        {proveedores.filter(p => parseInt(p.iD_Destino) === parseInt(s.idDestino))
                                            .map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                                    </select>
                                </td>
                                <td className="border p-1">
                                    <select value={s.idServicio} onChange={e => actualizar(i, 'idServicio', e.target.value)} className="border w-full">
                                        <option value="">--</option>
                                        {catalogoServicios.filter(sv => parseInt(sv.iD_Proveedor) === parseInt(s.idProveedor))
                                            .map(sv => <option key={sv.id} value={sv.id}>{sv.descripcion}</option>)}
                                    </select>
                                </td>
                                <td className="border p-1"><input type="number" value={s.precio} onChange={e => actualizar(i, 'precio', e.target.value)} className="w-20 border text-right" /></td>
                                <td className="border p-1"><input type="number" value={s.cantidad} onChange={e => actualizar(i, 'cantidad', e.target.value)} className="w-16 border text-right" /></td>
                                <td className="border p-1 text-right">${(s.precio * s.cantidad).toLocaleString()}</td>
                                <td className="border p-1">
                                    <button onClick={() => clonar(i)} className="text-blue-600 mr-2">🌀</button>
                                    <button onClick={() => eliminar(i)} className="text-red-600">🗑</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="9" className="text-center py-2">
                                <button
                                    onClick={agregarFila}
                                    title="Agregar fila"
                                    className="text-2xl text-green-600 hover:text-green-800 transition-colors duration-150"
                                >
                                    ➕
                                </button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <button
                    onClick={guardarCotizacion}
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                >
                    💾 Guardar Cotización
                </button>
                <div className="flex justify-between items-center mt-4">
                    <p className="font-bold text-green-700 text-lg">
                        💰 Total: ${total.toLocaleString()}
                    </p>
                </div>
            </section>

            <ClientModal
                isOpen={mostrarModal}
                onClose={() => setMostrarModal(false)}
                onGuardar={guardarCliente}
            />
        </div>
    );
}
