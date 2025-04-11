import React from 'react'
import { Link } from 'react-router-dom'

export default function AdminPanel() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">⚙️ Panel de Administración</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          to="/admin/proveedores"
          className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-6 flex items-center gap-4 hover:bg-blue-50"
        >
          <span className="text-3xl">🏢</span>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Gestionar Proveedores</h2>
            <p className="text-sm text-gray-600">Agregar, editar o eliminar proveedores.</p>
          </div>
        </Link>

        <Link
          to="/admin/servicios"
          className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-6 flex items-center gap-4 hover:bg-green-50"
        >
          <span className="text-3xl">🧾</span>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Gestionar Servicios</h2>
            <p className="text-sm text-gray-600">Crear y mantener servicios disponibles.</p>
          </div>
        </Link>
        <Link
          to="/admin/cotizar"
          className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-6 flex items-center gap-4 hover:bg-blue-50"
        >
          <span className="text-3xl">🤖</span>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Cotización Automática </h2>
            <p className="text-sm text-gray-600">Crear cotización.</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
