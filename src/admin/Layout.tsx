import React from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
    return (
        <div className="flex min-h-screen">
            <nav className="w-64 bg-blue-900 text-white p-4 space-y-4">
                <h1 className="text-xl font-bold mb-6">💼 Anda</h1>
                <ul className="space-y-2">
                    <li><Link to="/admin/cotizador" className="block hover:bg-blue-700 px-2 py-1 rounded">🧾 Cotizador</Link></li>
                    <li><Link to="/admin/proveedores" className="block hover:bg-blue-700 px-2 py-1 rounded">🧑‍💼 Proveedores</Link></li>
                    <li><Link to="/admin/servicios" className="block hover:bg-blue-700 px-2 py-1 rounded">🛎️ Servicios</Link></li>
                </ul>
            </nav>

            <main className="flex-1 bg-gray-50 p-6">
                <Outlet />
            </main>
        </div>
    )
}
