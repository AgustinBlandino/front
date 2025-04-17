import React, { useEffect, useState } from 'react';

export default function CotizacionesView() {
    const [clientes, setClientes] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState("");
    const [cotizaciones, setCotizaciones] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [seleccionada, setSeleccionada] = useState(null);

    const [destinos, setDestinos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [catalogoServicios, setCatalogoServicios] = useState([]);

    useEffect(() => {
        const cargarDatos = async () => {
            const [resClientes, resDestinos, resProveedores, resServicios] = await Promise.all([
                fetch('https://backend-anda-production.up.railway.app/api/clientes'),
                fetch('https://backend-anda-production.up.railway.app/api/destinos'),
                fetch('https://backend-anda-production.up.railway.app/api/proveedores'),
                fetch('https://backend-anda-production.up.railway.app/api/servicios'),
            ]);
            setClientes(await resClientes.json());
            setDestinos(await resDestinos.json());
            setProveedores(await resProveedores.json());
            setCatalogoServicios(await resServicios.json());
        };
        cargarDatos();
    }, []);

    const buscarCotizaciones = async () => {
        const res = await fetch(`https://backend-anda-production.up.railway.app/api/ia/cotizaciones?clienteId=${clienteSeleccionado}`);
        const data = await res.json();
        setCotizaciones(data);
    };

    const cargarCotizacion = async (id) => {
        const res = await fetch(`https://backend-anda-production.up.railway.app/api/ia/cotizaciones/${id}`);
        const data = await res.json();
        setSeleccionada(data);
        setServicios(data.detalles.map((d, i) => ({
            dia: d.dia,
            orden: d.orden,
            idDestino: d.iD_Destino,
            idProveedor: d.iD_Proveedor,
            idServicio: d.iD_Servicio,
            descripcion: d.descripcion,
            tipo: d.tipoServicio,
            precio: d.precioUnitario,
            cantidad: d.cantidad
        })));
    };

    const actualizar = (i, campo, valor) => {
        const nuevaLista = [...servicios];
        nuevaLista[i][campo] = campo === 'precio' || campo === 'cantidad' || campo === 'dia' || campo === 'orden'
            ? parseFloat(valor) || 0
            : valor;
        setServicios(nuevaLista);
    };

    const clonar = (i) => {
        const duplicado = { ...servicios[i], orden: servicios[i].orden + 1 };
        setServicios([...servicios, duplicado]);
    };

    const eliminar = (i) => {
        const nuevaLista = [...servicios];
        nuevaLista.splice(i, 1);
        setServicios(nuevaLista);
    };

    const agregarFila = () => {
        setServicios([...servicios, {
            dia: 1,
            orden: servicios.length + 1,
            idDestino: "",
            idProveedor: "",
            idServicio: "",
            descripcion: "",
            tipo: "",
            precio: 0,
            cantidad: 1
        }]);
    };

    const guardar = async () => {
        const total = servicios.reduce((sum, s) => sum + s.precio * s.cantidad, 0);
        const payload = {
            ...seleccionada,
            total,
            detalles: servicios.map(s => ({
                id_Servicio: s.idServicio,
                cantidad: s.cantidad,
                precioUnitario: s.precio,
                dia: s.dia,
                orden: s.orden
            }))
        };

        const res = await fetch(`https://backend-anda-production.up.railway.app/api/ia/cotizaciones/${seleccionada.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Cotización actualizada ✅");
        } else {
            alert("❌ Error al guardar");
        }
    };

    return (
        <div className="p-4 space-y-6">
            <h2 className="text-xl font-bold">Cotizaciones Guardadas</h2>

            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <select
                    value={clienteSeleccionado}
                    onChange={e => setClienteSeleccionado(e.target.value)}
                    className="border p-2 w-full sm:w-auto"
                >
                    <option value="">Seleccionar cliente</option>
                    {clientes.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>
                    ))}
                </select>
                <button onClick={buscarCotizaciones} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Buscar
                </button>
            </div>

            <ul className="list-disc pl-5">
                {cotizaciones.map(c => (
                    <li
                        key={c.id}
                        className="cursor-pointer hover:underline text-blue-700"
                        onClick={() => cargarCotizacion(c.id)}
                    >
                        Cotización #{c.id} - {new Date(c.fecha).toLocaleDateString()} - Total: ${c.total.toLocaleString()}
                    </li>
                ))}
            </ul>

            {seleccionada && (
                <section className="overflow-x-auto">
                    <h3 className="text-lg font-semibold mb-2">Servicios Cotizados</h3>
                    <table className="min-w-full border text-sm">
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
                                <tr key={i}>
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
                                    <button onClick={agregarFila} className="text-2xl text-green-600 hover:text-green-800 transition-colors duration-150">➕</button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
                        <p className="font-bold text-green-700 text-lg">
                            Total: ${servicios.reduce((sum, s) => sum + s.precio * s.cantidad, 0).toLocaleString()}
                        </p>
                        <button onClick={guardar} className="bg-blue-600 text-white px-4 py-2 rounded">
                            Guardar Cambios
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}
